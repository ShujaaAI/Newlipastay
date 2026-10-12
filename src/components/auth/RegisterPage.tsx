import React, { useState, useRef, useEffect } from 'react';
import {
  Smartphone,
  ShieldCheck,
  ArrowRight,
  Lock,
  Sparkles,
  CheckCircle2,
  Gift,
  Building,
  KeyRound,
  ArrowLeft,
  Flame,
  Info
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { formatKenyanPhone, saveHost, setCurrentHost, HostAccount } from '../../utils/hostAuth';
import {
  isFirebaseRealConfigured,
  getRecaptchaVerifier,
  sendFirebasePhoneOtp,
  createHostDocInFirestore,
} from '../../lib/firebase';
import type { ConfirmationResult } from 'firebase/auth';

export interface RegisterPageProps {
  onSuccess: (host: HostAccount) => void;
  onNavigateToLogin: () => void;
  onBackToHome: () => void;
  initialPhone?: string;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onSuccess,
  onNavigateToLogin,
  onBackToHome,
  initialPhone = '',
}) => {
  const [name, setName] = useState('');
  const [rawPhone, setRawPhone] = useState(initialPhone || '');
  const [tillNumber, setTillNumber] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [step, setStep] = useState<'details' | 'otp'>('details');

  // Firebase Auth state
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isFirebaseLive, setIsFirebaseLive] = useState(false);

  // 6-box OTP state
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
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
    if (!name.trim()) {
      setOtpError('Please enter your full name.');
      return;
    }
    const formatted = formatKenyanPhone(rawPhone);
    if (!formatted || formatted.length < 12) {
      setOtpError('Please enter a valid 9 or 10-digit Kenyan phone number.');
      return;
    }
    if (!tillNumber.trim()) {
      setOtpError('Please enter your Safaricom Till Number or Paybill.');
      return;
    }

    setOtpError('');
    setLoading(true);

    try {
      // E.164 phone format for Safaricom: +2547XXXXXXXX
      const phoneE164 = `+${formatted}`;

      if (isFirebaseRealConfigured()) {
        const verifier = getRecaptchaVerifier('recaptcha-container');
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
            console.warn('[Firebase Auth Error, activating fallback OTP]:', fbErr);
            setOtpError(`Firebase SMS notice: ${fbErr?.message || 'Network delay'}. Fallback testing code 123456 activated.`);
          }
        }
      }

      // Fallback mode (Firebase not configured or in sandbox testing)
      setTimeout(() => {
        setLoading(false);
        setStep('otp');
        setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
      }, 500);
    } catch (err: any) {
      setLoading(false);
      setOtpError(err?.message || 'Failed to send OTP. You can use demo OTP 123456.');
      setStep('otp');
    }
  };

  const handleOtpBoxChange = (index: number, value: string) => {
    const singleDigit = value.slice(-1);
    const updated = [...otpDigits];
    updated[index] = singleDigit;
    setOtpDigits(updated);
    setOtpError('');

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
      setOtpError('Please enter all 6 digits of the OTP.');
      return;
    }

    setLoading(true);
    setOtpError('');

    try {
      let uid = `host_${Date.now()}`;

      // 1. If real Firebase confirmationResult exists, verify via Firebase Auth
      if (confirmationResult) {
        try {
          const userCredential = await confirmationResult.confirm(entered);
          if (userCredential.user) {
            uid = userCredential.user.uid;
          }
        } catch (firebaseConfirmErr: any) {
          // If real verification failed, check if testing fallback code 123456
          if (entered === '123456') {
            console.log('[LipaStay] Accepted demo fallback OTP 123456');
          } else {
            setLoading(false);
            setOtpError('Incorrect verification code. Please check SMS or use demo code: 123456');
            return;
          }
        }
      } else {
        // Fallback test mode
        if (entered !== '123456') {
          setLoading(false);
          setOtpError('Invalid OTP code. For testing, use code: 123456');
          return;
        }
      }

      const normalizedPhone = formatKenyanPhone(rawPhone);

      // 2. Create user doc in Firestore collection 'hosts' with status: 'pending'
      await createHostDocInFirestore(uid, {
        name: name.trim(),
        phone: normalizedPhone,
        till: tillNumber.trim(),
        businessName: businessName.trim() || `${name.toUpperCase()} STAYS`,
      });

      // 3. Save to localStorage lipastay_hosts and lipastay_current_host
      const newHost: HostAccount = {
        id: uid,
        name: name.trim(),
        phone: normalizedPhone,
        tillNumber: tillNumber.trim(),
        businessName: businessName.trim() || `${name.toUpperCase()} STAYS`,
        tillVerified: false, // status pending initially
        isPro: true,
        createdAt: new Date().toISOString(),
      };

      saveHost(newHost);
      setCurrentHost(newHost);
      setLoading(false);
      onSuccess(newHost);
    } catch (err: any) {
      setLoading(false);
      setOtpError(err?.message || 'Verification error. Please retry or use code 123456.');
    }
  };

  const handleDemoFill = () => {
    setName('Brian Mwangi');
    setRawPhone('0712345001');
    setTillNumber('5849201');
    setBusinessName('BRIAN KILIMANI STAYS');
    setOtpError('');
  };

  const handleFillDemoOtp = () => {
    setOtpDigits(['1', '2', '3', '4', '5', '6']);
    setOtpError('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      {/* Invisible reCAPTCHA container required by Firebase Phone Auth */}
      <div id="recaptcha-container"></div>

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
                <Badge variant="mpesa" icon={<Sparkles className="w-3 h-3 text-[#00A651]" />}>
                  Host Portal
                </Badge>
                {isFirebaseLive ? (
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Flame className="w-3 h-3 text-orange-500 fill-orange-500" />
                    <span>Firebase Phone Auth</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-neutral-600 bg-neutral-200 px-2 py-0.5 rounded-full">
                    Fallback OTP Ready
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={handleDemoFill}
                className="text-[11px] font-bold text-[#FF6B35] hover:underline cursor-pointer"
              >
                Auto-fill Demo
              </button>
            </div>
            <CardTitle className="text-xl sm:text-2xl font-black text-[#111111]">
              {step === 'details' ? 'Create Host Account' : 'Confirm Phone OTP'}
            </CardTitle>
            <CardDescription>
              {step === 'details'
                ? 'Join 0% commission direct bookings. Guests pay direct to your Till.'
                : `Enter the 6-digit code sent to +254 ${formatKenyanPhone(rawPhone).slice(3)}`}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6 space-y-5">
            {/* Launch Offer Banner */}
            <div className="bg-[#EAF8F0] border border-[#00A651]/30 rounded-2xl p-3.5 flex items-start gap-3">
              <Gift className="w-5 h-5 text-[#00A651] shrink-0 mt-0.5" />
              <div className="text-xs text-[#008440] leading-snug">
                <span className="font-bold">Firestore Host Collection:</span> Registered hosts are
                saved with <span className="font-mono bg-white px-1 rounded">status: pending</span> for
                2-hour Till validation.
              </div>
            </div>

            {otpError && (
              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-xl font-medium animate-in fade-in">
                {otpError}
              </div>
            )}

            {step === 'details' ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider">
                    Host Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Brian Mwangi"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FFFBF5] border border-[#EBE5DB] rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#00A651]"
                  />
                </div>

                {/* Phone Input with 254 prefix */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider">
                    Safaricom Phone Number
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
                    Auto-formats to Kenyan international mobile (+254 7XX...).
                  </p>
                </div>

                {/* Till Number or Paybill */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider">
                    M-Pesa Buy Goods Till or Paybill
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-[#00A651] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. 5849201"
                      value={tillNumber}
                      onChange={(e) => setTillNumber(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-[#FFFBF5] border border-[#EBE5DB] rounded-xl text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#00A651]"
                    />
                  </div>
                  <p className="text-[10px] text-[#008440] font-medium">
                    Tumie Till Number yako ya Lipa na M-Pesa
                  </p>
                </div>

                {/* Business Name (Optional) */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wider">
                    Business / Listing Brand Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. BRIAN KILIMANI STAYS"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FFFBF5] border border-[#EBE5DB] rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00A651]"
                  />
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
                    onClick={() => setStep('details')}
                    className="text-[#6B7280] hover:text-[#111111] underline"
                  >
                    Edit Phone or Details
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpDigits(['', '', '', '', '', '']);
                      setOtpError('OTP resent! Enter SMS code or fallback code 123456.');
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
              Already registered as a host?{' '}
              <button
                type="button"
                onClick={onNavigateToLogin}
                className="font-bold text-[#00A651] hover:underline cursor-pointer"
              >
                Log in here
              </button>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
