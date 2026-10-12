import React, { useState } from 'react';
import { Smartphone, ShieldCheck, ArrowRight, Lock, CheckCircle2, X } from 'lucide-react';
import { Button } from '../ui/Button';

export interface HostAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: (phone: string, hostName: string) => void;
}

export const HostAuthModal: React.FC<HostAuthModalProps> = ({
  isOpen,
  onClose,
  onAuthenticated,
}) => {
  const [phone, setPhone] = useState('0712345001');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || phone.trim().length < 9) {
      setError('Please enter a valid Safaricom phone number.');
      return;
    }
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
    }, 700);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim() || (otp.trim() !== '1234' && otp.trim().length !== 4)) {
      setError('Invalid OTP code. For this demo, use code: 1234');
      return;
    }
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onAuthenticated(phone.trim(), 'Brian Mwangi');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl border border-[#EBE5DB] p-6 sm:p-7 z-10 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-[#EBE5DB]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#00A651] text-white flex items-center justify-center font-bold text-xs">
              M
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#111111]">Host Portal Login</h3>
              <p className="text-[10px] text-[#6B7280]">Safaricom Phone OTP Verification</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#6B7280] hover:text-[#111111]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'phone' ? (
          <form onSubmit={handleSendOtp} className="space-y-4 pt-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider">
                Host Safaricom Number
              </label>
              <div className="relative">
                <Smartphone className="w-4 h-4 text-[#00A651] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0712 345 678"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FFFBF5] border border-[#EBE5DB] rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#00A651]"
                />
              </div>
              <p className="text-[10px] text-[#6B7280]">
                We will send a one-time SMS verification code to log into your host dashboard.
              </p>
            </div>

            {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}

            <Button
              type="submit"
              variant="mpesa"
              fullWidth
              size="md"
              disabled={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {isLoading ? 'Sending SMS OTP...' : 'Send Login OTP'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4 pt-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider">
                  Enter 4-Digit OTP Code
                </label>
                <span className="text-[10px] text-[#008440] font-mono font-bold bg-[#EAF8F0] px-2 py-0.5 rounded">
                  Demo Code: 1234
                </span>
              </div>
              <input
                type="text"
                maxLength={4}
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="1 2 3 4"
                className="w-full text-center tracking-[0.5em] font-mono text-xl py-3 bg-[#FFFBF5] border border-[#EBE5DB] rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-[#00A651]"
              />
              <p className="text-[10px] text-[#6B7280] text-center">
                SMS sent to {phone}. Enter <strong className="text-[#111111]">1234</strong> to proceed.
              </p>
            </div>

            {error && <p className="text-xs text-rose-600 font-medium text-center">{error}</p>}

            <Button
              type="submit"
              variant="mpesa"
              fullWidth
              size="md"
              disabled={isLoading}
              leftIcon={<Lock className="w-4 h-4" />}
            >
              {isLoading ? 'Verifying...' : 'Verify & Open Dashboard'}
            </Button>

            <button
              type="button"
              onClick={() => setStep('phone')}
              className="w-full text-center text-xs text-[#6B7280] hover:text-[#111111] underline"
            >
              Change Phone Number
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
