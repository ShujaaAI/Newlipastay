import React, { useState, useRef, useEffect } from 'react';
import {
  Smartphone,
  ShieldCheck,
  ArrowRight,
  KeyRound,
  Sparkles,
  ArrowLeft,
  UserCheck,
  Flame
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import { Badge } from '../ui/Badge';
import {
  formatKenyanPhone,
  findHostByPhone,
  setCurrentHost,
  saveHost,
  HostAccount
} from '../../utils/hostAuth';
import { getSavedHostLeads } from '../../utils/hosts';
import {
  isFirebaseRealConfigured,
  getRecaptchaVerifier,
  sendFirebasePhoneOtp,
  fetchHostDocFromFirestore,
} from '../../lib/firebase';
import type { ConfirmationResult } from 'firebase/auth';

export interface LoginPageProps {
  onSuccess: (host: HostAccount) => void;
  onNavigateToRegister: (prefilledPhone?: string) => void;
  onBackToHome: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onSuccess,
  onNavigateToRegister,
  onBackToHome,
}) => {
  const [rawPhone, setRawPhone] = useState('0712345001'); // Default demo host Brian
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isFirebaseLive, setIsFirebaseLive] = useState(false);

  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setIsFirebaseLive(isFirebaseRealConfigured());
  }, []);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRawPhone(e.target.value);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const formatted = formatKenyanPhone(rawPhone);

    if (!formatted || formatted.length < 12) {
      setErrorMsg('Please enter a valid 9 or 10-digit Kenyan phone number.');
      return;
    }

    // Check if host exists in localStorage or Firestore
    const localHost = findHostByPhone(formatted);
    const hostLeads = getSavedHostLeads();
    const matchingLead = hostLeads.find(
      (hl) => formatKenyanPhone(hl.phone) === formatted
    );

    // If Firebase is configured, check Firestore too
    let firestoreHost = null;
    if (isFirebaseRealConfigured()) {
      firestoreHost = await fetchHostDocFromFirestore(formatted);
    }

    if (!localHost && !matchingLead && !firestoreHost) {
      setErrorMsg('Phone not registered as a host. Redirecting to registration...');
      setTimeout(() => {
        onNavigateToRegister(rawPhone);
      }, 1200);
      return;
    }

    setErrorMsg('');
    setLoading(true);

    try {
      const phoneE164 = `+${formatted}`;

      if (isFirebaseRealConfigured()) {
        const verifier = getRecaptchaVerifier('recaptcha-container-login');
        if (verifier) {
          try {
            const conf = await sendFirebasePhoneOtp(phoneE164, verifier);
            if (conf) {
              setConfirmationResult(conf);
              setLoading(false);
              setStep('otp');
              setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
              return;
            }
          } catch (fbErr: any) {
            console.warn('[Firebase Login Auth Error]:', fbErr);
            setErrorMsg(`Firebase notice: ${fbErr?.message || 'Using fallback mode'}. Testing code 123456 ready.`);
          }
        }
      }

      // Fallback test mode
      setTimeout(() => {
        setLoading(false);
        setStep('otp');
        setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
      }, 500);
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err?.message || 'Failed to send OTP code.');
      setStep('otp');
    }
  };

  const handleOtpBoxChange = (index: number, value: string) => {
    const singleDigit = value.slice(-1);
    const updated = [...otpDigits];
    updated[index] = singleDigit;
    setOtpDigits(updated);
    setErrorMsg('');

    if (singleDigit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const entered = otpDigits.join('');

    if (entered.length < 6) {
      setErrorMsg('Please enter all 6 digits of the OTP.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      let uid = '';

      if (confirmationResult) {
        try {
          const userCredential = await confirmationResult.confirm(entered);
          if (userCredential.user) {
            uid = userCredential.user.uid;
          }
        } catch (firebaseConfirmErr: any) {
          if (entered === '123456') {
            console.log('[LipaStay] Accepted demo fallback OTP 123456 on login');
          } else {
            setLoading(false);
            setErrorMsg('Invalid OTP code. For demo testing, enter code: 123456');
            return;
          }
        }
      } else {
        if (entered !== '123456') {
          setLoading(false);
          setErrorMsg('Invalid OTP code. For demo testing, use code: 123456');
          return;
        }
      }

      const formatted = formatKenyanPhone(rawPhone);

      // On login, fetch host doc from Firestore
      let hostDoc = null;
      if (isFirebaseRealConfigured()) {
        hostDoc = await fetchHostDocFromFirestore(uid || formatted);
      }

      let host = findHostByPhone(formatted);

      if (hostDoc) {
        host = {
          id: hostDoc.uid,
          name: hostDoc.name,
          phone: hostDoc.phone,
          tillNumber: hostDoc.till,
          businessName: hostDoc.businessName,
          tillVerified: hostDoc.status === 'verified',
          isPro: true,
          createdAt: new Date().toISOString(),
        };
        saveHost(host);
      } else if (!host) {
        const matchingLead = getSavedHostLeads().find(
          (hl) => formatKenyanPhone(hl.phone) === formatted
        );
        if (matchingLead) {
          host = {
            id: matchingLead.id,
            name: matchingLead.hostName,
            phone: formatted,
            tillNumber: matchingLead.tillNumber,
            tillVerified: true,
            businessName: `${matchingLead.hostName.toUpperCase()} STAYS`,
            isPro: true,
            createdAt: matchingLead.createdAt,
          };
          saveHost(host);
        }
      }

      setLoading(false);
      if (host) {
        setCurrentHost(host);
        onSuccess(host);
      } else {
        onNavigateToRegister(rawPhone);
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err?.message || 'Login failed. Please retry.');
    }
  };

  const handleSelectDemoHost = (phone: string) => {
    setRawPhone(phone);
    setErrorMsg('');
  };

  const handleFillDemoOtp = () => {
    setOtpDigits(['1', '2', '3', '4', '5', '6']);
    setErrorMsg('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      {/* Invisible reCAPTCHA container for Firebase login */}
      <div id="recaptcha-container-login"></div>

      <div className="w-full max-w-md space-y-6">
        {/* Back Link */}
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B7280] hover:text-[#111111] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to LipaStay Home</span>
        </button>

        <Card className="border border-[#EBE5DB] shadow-lg rounded-3xl overflow-hidden bg-white">
          <CardHeader className="bg-[#FFFBF5] border-b border-[#EBE5DB] pb-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Badge variant="mpesa" icon={<UserCheck className="w-3 h-3 text-[#00A651]" />}>
                  Host Portal Login
                </Badge>
                {isFirebaseLive ? (
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Flame className="w-3 h-3 text-orange-500 fill-orange-500" />
                    <span>Firebase Auth</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-neutral-600 bg-neutral-200 px-2 py-0.5 rounded-full">
                    Fallback OTP Ready
                  </span>
                )}
              </div>
              <span className="text-[10px] text-[#6B7280] font-mono">Passwordless</span>
            </div>
            <CardTitle className="text-xl sm:text-2xl font-black text-[#111111]">
              {step === 'phone' ? 'Log in to Host Dashboard' : 'Confirm Phone OTP'}
            </CardTitle>
            <CardDescription>
              {step === 'phone'
                ? 'Enter your Safaricom phone number to receive an instant OTP login code.'
                : `Enter the 6-digit code sent to +254 ${formatKenyanPhone(rawPhone).slice(3)}`}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6 space-y-5">
            {errorMsg && (
              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-xl font-medium animate-in fade-in">
                {errorMsg}
              </div>
            )}

            {step === 'phone' ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                {/* Phone Input with 254 prefix */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider">
                    Host Safaricom Number
                  </label>
                  <div className="relative flex rounded-xl border border-[#EBE5DB] bg-[#FFFBF5] overflow-hidden focus-within:ring-2 focus-within:ring-[#00A651]">
                    <span className="inline-flex items-center px-3.5 bg-neutral-100 border-r border-[#EBE5DB] text-xs font-bold font-mono text-[#111111]">
                      +254
                    </span>
                    <input
                      type="tel"
                      required
                      placeholder="712 345 678"
                      value={
                        rawPhone.startsWith('+254')
                          ? rawPhone.slice(4)
                          : rawPhone.startsWith('254')
                          ? rawPhone.slice(3)
                          : rawPhone.startsWith('0')
                          ? rawPhone.slice(1)
                          : rawPhone
                      }
                      onChange={handlePhoneChange}
                      className="w-full px-3 py-2.5 bg-transparent text-sm font-semibold font-mono focus:outline-none"
                    />
                  </div>
                  <p className="text-[10px] text-[#6B7280]">
                    We will send a one-time login SMS code.
                  </p>
                </div>

                {/* Demo Host Selectors */}
                <div className="p-3 rounded-2xl bg-[#FFFBF5] border border-[#EBE5DB] space-y-2">
                  <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">
                    Quick Demo Host Login:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleSelectDemoHost('0712345001')}
                      className="text-xs px-2.5 py-1 rounded-lg bg-white border border-[#EBE5DB] hover:border-[#00A651] font-medium text-[#111111] transition-colors cursor-pointer"
                    >
                      Brian Mwangi (Kilimani)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectDemoHost('0722345002')}
                      className="text-xs px-2.5 py-1 rounded-lg bg-white border border-[#EBE5DB] hover:border-[#00A651] font-medium text-[#111111] transition-colors cursor-pointer"
                    >
                      Faith Chebet (Westlands)
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="mpesa"
                  fullWidth
                  size="lg"
                  disabled={loading}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="font-bold py-3 text-sm rounded-xl shadow-md shadow-[#00A651]/20"
                >
                  {loading ? 'Inatuma SMS OTP...' : 'Tuma OTP Code'}
                </Button>
              </form>
            ) : (
              /* OTP 6-BOX STEP */
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="space-y-2 text-center">
                  <div className="flex justify-center gap-2 sm:gap-2.5">
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => {
                          otpInputRefs.current[idx] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpBoxChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className="w-11 h-13 sm:w-12 sm:h-14 text-center font-mono text-xl sm:text-2xl font-black rounded-xl border-2 border-[#EBE5DB] bg-[#FFFBF5] focus:border-[#00A651] focus:bg-white focus:outline-none transition-all shadow-xs"
                      />
                    ))}
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs text-[#6B7280]">
                    <span>
                      {confirmationResult
                        ? 'Real Firebase SMS code sent'
                        : 'Testing Mock Code:'}{' '}
                      <strong className="text-[#008440] font-mono">123456</strong>
                    </span>
                    <button
                      type="button"
                      onClick={handleFillDemoOtp}
                      className="text-[#FF6B35] font-bold hover:underline cursor-pointer"
                    >
                      Fill 123456
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="mpesa"
                  fullWidth
                  size="lg"
                  disabled={loading || otpDigits.join('').length < 6}
                  leftIcon={<KeyRound className="w-4 h-4" />}
                  className="font-bold py-3 text-sm rounded-xl shadow-md shadow-[#00A651]/20"
                >
                  {loading ? 'Inathibitisha...' : 'Verify OTP & Open Dashboard'}
                </Button>

                <div className="flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => setStep('phone')}
                    className="text-[#6B7280] hover:text-[#111111] underline"
                  >
                    Change Phone Number
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpDigits(['', '', '', '', '', '']);
                      setErrorMsg('OTP code resent! Enter SMS code or fallback code 123456.');
                    }}
                    className="text-[#008440] font-bold hover:underline"
                  >
                    Resend Code
                  </button>
                </div>
              </form>
            )}
          </CardContent>

          <CardFooter className="bg-[#FFFBF5] border-t border-[#EBE5DB] p-4 text-center justify-center">
            <p className="text-xs text-[#6B7280]">
              Don&apos;t have a host account yet?{' '}
              <button
                type="button"
                onClick={() => onNavigateToRegister(rawPhone)}
                className="font-bold text-[#00A651] hover:underline cursor-pointer"
              >
                Register free here
              </button>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
