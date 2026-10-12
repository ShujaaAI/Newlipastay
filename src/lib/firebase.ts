import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  Auth,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
  Firestore,
} from 'firebase/firestore';

// 1. Firebase Configuration (loaded from client env or placeholder)
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyPlaceholderKeyForLipaStayTesting',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'lipastay-co-ke.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'lipastay-co-ke',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'lipastay-co-ke.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789012',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789012:web:abcdef123456',
};

// Check if valid real Firebase project is configured
export function isFirebaseRealConfigured(): boolean {
  const key = firebaseConfig.apiKey;
  return (
    Boolean(key) &&
    key !== 'AIzaSyPlaceholderKeyForLipaStayTesting' &&
    key !== 'your-api-key' &&
    !key.includes('Placeholder')
  );
}

// 2. Safe Singleton Initialization
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.warn('[LipaStay Firebase] Initialized in demo/fallback mode:', error);
}

export { app, auth, db };

// 3. RecaptchaVerifier Setup (Invisible for mobile-first Kenyan UX)
export function getRecaptchaVerifier(containerId: string): RecaptchaVerifier | null {
  if (!auth) return null;
  try {
    // If window already has a verifier, re-use or re-initialize
    const win = window as any;
    if (win.recaptchaVerifier) {
      try {
        win.recaptchaVerifier.clear();
      } catch (e) {
        // ignore
      }
    }

    win.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {
        console.log('[LipaStay] reCAPTCHA verified');
      },
      'expired-callback': () => {
        console.warn('[LipaStay] reCAPTCHA expired, please try again');
      },
    });

    return win.recaptchaVerifier;
  } catch (err) {
    console.warn('[LipaStay] Failed to initialize RecaptchaVerifier:', err);
    return null;
  }
}

// 4. Send Firebase Phone Auth SMS
export async function sendFirebasePhoneOtp(
  phoneE164: string,
  verifier: RecaptchaVerifier
): Promise<ConfirmationResult | null> {
  if (!auth || !isFirebaseRealConfigured()) {
    console.log('[LipaStay] Real Firebase not configured, utilizing demo OTP mode (123456)');
    return null;
  }

  try {
    const confirmation = await signInWithPhoneNumber(auth, phoneE164, verifier);
    return confirmation;
  } catch (error) {
    console.error('[LipaStay] signInWithPhoneNumber error:', error);
    throw error;
  }
}

export interface FirestoreHostDoc {
  uid: string;
  name: string;
  phone: string;
  till: string;
  businessName?: string;
  status: 'pending' | 'verified';
  createdAt?: any;
  updatedAt?: any;
}

// 5. Create Host Document in Firestore collection 'hosts'
export async function createHostDocInFirestore(
  uid: string,
  hostData: {
    name: string;
    phone: string;
    till: string;
    businessName?: string;
  }
): Promise<void> {
  if (!db || !isFirebaseRealConfigured()) {
    console.log('[LipaStay Mock] Host doc simulated in collection "hosts":', hostData);
    return;
  }

  try {
    const hostRef = doc(db, 'hosts', uid);
    const payload: FirestoreHostDoc = {
      uid,
      name: hostData.name,
      phone: hostData.phone,
      till: hostData.till,
      businessName: hostData.businessName || `${hostData.name.toUpperCase()} STAYS`,
      status: 'pending', // Required: status pending
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(hostRef, payload, { merge: true });
    console.log('[LipaStay] Host document created in Firestore collection "hosts" successfully!');
  } catch (err) {
    console.error('[LipaStay] Firestore setDoc error in collection "hosts":', err);
    // Don't crash app if Firestore rules or offline
  }
}

// 6. Fetch Host Document on Login
export async function fetchHostDocFromFirestore(
  phoneOrUid: string
): Promise<FirestoreHostDoc | null> {
  if (!db || !isFirebaseRealConfigured()) {
    return null;
  }

  try {
    // Try by UID first
    const directRef = doc(db, 'hosts', phoneOrUid);
    const directSnap = await getDoc(directRef);
    if (directSnap.exists()) {
      return directSnap.data() as FirestoreHostDoc;
    }

    // Try by phone query
    const q = query(collection(db, 'hosts'), where('phone', '==', phoneOrUid));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs[0].data() as FirestoreHostDoc;
    }
  } catch (err) {
    console.warn('[LipaStay] Firestore fetch error:', err);
  }

  return null;
}
