import React, { useState, useEffect } from 'react';
import { ListingItem } from '../listings/ListingCard';
import {
  X,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Info,
  Clock,
  Sparkles,
  MessageCircle,
  Copy,
  Check
} from 'lucide-react';
import { Button } from '../ui/Button';
import { MpesaTillVerifiedBadge } from '../ui/MpesaTillVerifiedBadge';
import { generateMpesaCode, savePaidBooking, PaidBooking } from '../../utils/mpesa';
import { getSavedGuestPhone, saveGuestPhone } from '../../utils/tracking';

export interface MpesaPaymentModalProps {
  listing: ListingItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccessVerified?: (booking: PaidBooking) => void;
}

type PaymentStep = 'initial' | 'sending_stk' | 'awaiting_pin' | 'success';

export const MpesaPaymentModal: React.FC<MpesaPaymentModalProps> = ({
  listing,
  isOpen,
  onClose,
  onSuccessVerified,
}) => {
  const [step, setStep] = useState<PaymentStep>('initial');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [amount, setAmount] = useState<number>(2000);
  const [pinInput, setPinInput] = useState('');
  const [verifiedBooking, setVerifiedBooking] = useState<PaidBooking | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Initialize data on modal open
  useEffect(() => {
    if (isOpen && listing) {
      setStep('initial');
      setPhoneError('');
      setPinInput('');
      setVerifiedBooking(null);
      setCopiedCode(false);

      const savedPhone = getSavedGuestPhone();
      if (savedPhone) {
        setPhone(savedPhone);
      } else {
        setPhone('');
      }

      // Default deposit to KES 2,000 or half price
      const depositCalc = Math.min(2000, listing.price_per_night);
      setAmount(depositCalc);
    }
  }, [isOpen, listing]);

  if (!isOpen || !listing) return null;

  const tillNumber = listing.mpesa_till_number || '5849201';
  const businessName = `${listing.host_name.toUpperCase()} HOMES`;
  const purposeText = `Deposit for ${listing.title}`;

  // Step 1: Submit Form -> Sending STK
  const handleInitiateSTK = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanPhone = phone.trim().replace(/\s+/g, '');
    if (!cleanPhone || cleanPhone.length < 9) {
      setPhoneError('Please enter a valid Safaricom phone number (e.g. 0712345678)');
      return;
    }
    setPhoneError('');
    saveGuestPhone(cleanPhone);

    // Transition to sending STK
    setStep('sending_stk');

    // After 1.2s transition to awaiting PIN mockup
    setTimeout(() => {
      setStep('awaiting_pin');
    }, 1200);
  };

  // Step 3 -> 4: Awaiting PIN 3s delay simulator
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'awaiting_pin') {
      // Simulate Safaricom SIM Toolkit processing (3 seconds delay)
      timer = setTimeout(() => {
        const transCode = generateMpesaCode();
        const saved = savePaidBooking({
          transactionCode: transCode,
          propertyId: listing.id,
          propertyTitle: listing.title,
          hostName: listing.host_name,
          hostTillNumber: tillNumber,
          hostBusinessName: businessName,
          guestPhone: phone,
          amountKES: amount,
          purpose: purposeText,
        });

        setVerifiedBooking(saved);
        setStep('success');
        if (onSuccessVerified) {
          onSuccessVerified(saved);
        }
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [step]);

  const handleCopyCode = () => {
    if (verifiedBooking) {
      navigator.clipboard.writeText(verifiedBooking.transactionCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleNotifyHostWhatsApp = () => {
    if (!verifiedBooking) return;
    const text = encodeURIComponent(
      `Habari ${listing.host_name}! I have paid a deposit of KES ${verifiedBooking.amountKES.toLocaleString()} to your M-Pesa Till ${verifiedBooking.hostTillNumber} for "${listing.title}".\n\nTransaction Code: ${verifiedBooking.transactionCode}\nVerified via LipaStay.co.ke`
    );
    window.open(`https://wa.me/${listing.whatsapp_number}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={() => {
          if (step !== 'sending_stk' && step !== 'awaiting_pin') {
            onClose();
          }
        }}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white w-full max-w-xl rounded-[32px] shadow-2xl border border-[#EBE5DB] overflow-hidden z-10 my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Bar */}
        <div className="px-5 py-4 border-b border-[#EBE5DB] flex items-center justify-between bg-[#FFFBF5]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#00A651] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              M
            </div>
            <div>
              <div className="text-sm font-bold text-[#111111] flex items-center gap-1.5">
                <span>Lipa na M-Pesa</span>
                <MpesaTillVerifiedBadge size="sm" />
              </div>
              <p className="text-[10px] text-[#6B7280]">
                Instant STK Push to Host Buy Goods Till
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-[#6B7280] hover:text-[#111111] hover:bg-black/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: State Machine */}
        <div className="p-5 sm:p-7">
          {/* STATE 1: INITIAL INPUT FORM */}
          {step === 'initial' && (
            <form onSubmit={handleInitiateSTK} className="space-y-5">
              {/* Critical Direct Payment Disclaimer */}
              <div className="bg-[#EAF8F0] border border-[#00A651]/30 rounded-2xl p-3.5 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#00A651] shrink-0 mt-0.5" />
                <div className="text-xs text-[#008440] leading-relaxed">
                  <span className="font-bold">Zero-Commission Direct Settlement:</span> Money goes{' '}
                  <strong className="underline decoration-[#00A651]">DIRECT</strong> to host&apos;s
                  M-Pesa Till. LipaStay does NOT hold your money. We only verify the transaction.
                </div>
              </div>

              {/* Property & Till Summary Card */}
              <div className="bg-[#FFFBF5] rounded-2xl p-4 border border-[#EBE5DB] space-y-2 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#6B7280]">
                      Property
                    </span>
                    <h4 className="font-bold text-sm text-[#111111] line-clamp-1">
                      {listing.title}
                    </h4>
                    <span className="text-[#6B7280]">{listing.location}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-[#6B7280]">
                      Host Till
                    </span>
                    <div className="font-mono font-bold text-[#008440] text-sm">
                      {tillNumber}
                    </div>
                    <div className="text-[10px] text-[#111111] font-semibold">{businessName}</div>
                  </div>
                </div>
              </div>

              {/* Input: Safaricom Number */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider">
                  Safaricom Phone Number (STK Push)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Smartphone className="w-4 h-4 text-[#00A651]" />
                  </div>
                  <input
                    type="tel"
                    required
                    placeholder="0712 345 678 or 2547..."
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (phoneError) setPhoneError('');
                    }}
                    className={`w-full pl-10 pr-4 py-3 bg-[#FFFBF5] border rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#00A651] ${
                      phoneError ? 'border-rose-500' : 'border-[#EBE5DB]'
                    }`}
                  />
                </div>
                {phoneError && (
                  <p className="text-[11px] text-rose-600 font-medium">{phoneError}</p>
                )}
                <p className="text-[11px] text-[#6B7280]">
                  You will receive an instant PIN prompt on this Safaricom line.
                </p>
              </div>

              {/* Input: Deposit Amount */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider">
                    Deposit Amount (KES)
                  </label>
                  <span className="text-[11px] text-[#008440] font-semibold">
                    100% credited to host
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none font-bold text-xs text-[#6B7280]">
                    KES
                  </div>
                  <input
                    type="number"
                    min="500"
                    step="500"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full pl-14 pr-4 py-3 bg-[#FFFBF5] border border-[#EBE5DB] rounded-xl text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#00A651]"
                  />
                </div>

                {/* Preset Chips */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] text-[#6B7280]">Quick:</span>
                  {[1000, 2000, 3000, listing.price_per_night].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAmount(val)}
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border transition-colors ${
                        amount === val
                          ? 'bg-[#00A651] text-white border-[#00A651]'
                          : 'bg-white text-[#4B5563] border-[#EBE5DB] hover:border-black'
                      }`}
                    >
                      KES {val.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Purpose Readonly */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">
                  Payment Purpose
                </label>
                <div className="p-2.5 bg-neutral-100 rounded-xl text-xs font-medium text-[#4B5563] truncate border border-neutral-200">
                  {purposeText}
                </div>
              </div>

              {/* Submit CTA */}
              <Button
                type="submit"
                variant="mpesa"
                size="lg"
                fullWidth
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="font-bold py-3.5 shadow-md shadow-[#00A651]/25 text-base"
              >
                Lipa na M-Pesa · KES {amount.toLocaleString()}
              </Button>
            </form>
          )}

          {/* STATE 2: SENDING STK PUSH (CONNECTING TO SAFARICOM DARAJA) */}
          {step === 'sending_stk' && (
            <div className="py-10 text-center space-y-5 animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-[#EAF8F0] border-2 border-[#00A651] flex items-center justify-center mx-auto relative">
                <div className="w-8 h-8 rounded-full border-3 border-[#00A651] border-t-transparent animate-spin" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#111111]">
                  Sending M-Pesa STK Push...
                </h3>
                <p className="text-xs text-[#6B7280]">
                  Connecting to Safaricom Daraja Gateway for Till {tillNumber}
                </p>
                <p className="text-xs font-mono font-semibold text-[#00A651] pt-1">
                  Target: {phone}
                </p>
              </div>
            </div>
          )}

          {/* STATE 3: AWAITING PIN (SIMULATED SAFARICOM PHONE SIM TOOLKIT) */}
          {step === 'awaiting_pin' && (
            <div className="space-y-5 animate-in fade-in duration-300">
              {/* Top Alert */}
              <div className="text-center space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#008440] bg-[#EAF8F0] px-3 py-1 rounded-full border border-[#00A651]/20">
                  <Clock className="w-3.5 h-3.5 animate-spin" />
                  <span>STK Push Sent to {phone.slice(0, 4)}***{phone.slice(-3)}</span>
                </div>
                <h3 className="text-base font-bold text-[#111111]">
                  Check Your Safaricom Phone
                </h3>
                <p className="text-xs text-[#6B7280]">
                  Enter your 4-digit M-Pesa PIN on your phone screen to complete direct payment.
                </p>
              </div>

              {/* Realistic Safaricom SIM Toolkit Phone Dialog Mockup */}
              <div className="max-w-[320px] mx-auto bg-neutral-900 text-white rounded-3xl p-4 shadow-xl border-2 border-neutral-700 relative">
                <div className="text-center text-[10px] text-neutral-400 border-b border-neutral-800 pb-2 mb-3 font-semibold uppercase tracking-wider">
                  SIM TOOLKIT · M-PESA
                </div>

                <div className="bg-neutral-800 rounded-2xl p-4 space-y-3 border border-neutral-700 text-xs">
                  <p className="leading-snug text-neutral-100 font-medium">
                    Do you want to pay <strong className="text-emerald-400">Ksh {amount.toLocaleString()}</strong> to{' '}
                    <strong>{businessName}</strong> Till <strong>{tillNumber}</strong>?
                  </p>

                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] text-neutral-400 uppercase font-mono tracking-wider">
                      Enter M-Pesa PIN:
                    </span>
                    <div className="bg-neutral-900 border border-emerald-500/50 rounded-xl py-2 px-3 text-center tracking-[0.4em] font-mono text-emerald-400 text-base font-bold shadow-inner flex items-center justify-center">
                      <span className="animate-pulse">● ● ● ●</span>
                    </div>
                  </div>

                  <div className="flex justify-between pt-2 border-t border-neutral-700 text-[11px] text-neutral-300">
                    <span className="text-neutral-500">Cancel</span>
                    <span className="text-emerald-400 font-bold">Sending...</span>
                  </div>
                </div>

                <div className="text-center text-[10px] text-neutral-400 pt-3 flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3 text-[#00A651]" />
                  <span>Simulating 3-second network clearance...</span>
                </div>
              </div>
            </div>
          )}

          {/* STATE 4: SUCCESS VERIFIED RECEIPT */}
          {step === 'success' && verifiedBooking && (
            <div className="space-y-5 animate-in zoom-in-95 duration-300">
              {/* Success Stamp */}
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-[#EAF8F0] border-2 border-[#00A651] text-[#00A651] flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#111111]">
                    Payment Verified!
                  </h3>
                  <div className="mt-1 flex items-center justify-center gap-1.5">
                    <MpesaTillVerifiedBadge size="md" />
                  </div>
                </div>
              </div>

              {/* Digital Receipt Card */}
              <div className="bg-[#FFFBF5] rounded-2xl p-5 border border-[#00A651]/30 shadow-xs space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#EBE5DB]">
                  <span className="text-[#6B7280]">Transaction Code:</span>
                  <div className="flex items-center gap-1.5 font-mono font-black text-sm text-[#008440]">
                    <span>{verifiedBooking.transactionCode}</span>
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="p-1 text-[#6B7280] hover:text-[#111111] transition-colors"
                      title="Copy code"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-[#00A651]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Amount Paid:</span>
                  <span className="font-mono font-bold text-[#111111]">
                    KES {verifiedBooking.amountKES.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Recipient Till:</span>
                  <span className="font-mono font-bold text-[#111111]">
                    {verifiedBooking.hostTillNumber} ({verifiedBooking.hostBusinessName})
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Payer Phone:</span>
                  <span className="font-mono text-[#111111]">{verifiedBooking.guestPhone}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Verified By:</span>
                  <span className="font-bold text-[#008440]">LipaStay.co.ke Trust Engine</span>
                </div>

                <div className="pt-2 border-t border-[#EBE5DB] text-[11px] text-[#4B5563] text-center italic">
                  &quot;Money went DIRECT to host&apos;s M-Pesa Till. LipaStay holds KES 0 escrow.&quot;
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-1">
                <Button
                  variant="mpesa"
                  size="md"
                  fullWidth
                  onClick={handleNotifyHostWhatsApp}
                  leftIcon={<MessageCircle className="w-4 h-4 fill-current" />}
                  className="font-bold"
                >
                  Send Confirmation to Host on WhatsApp
                </Button>

                <Button
                  variant="outline"
                  size="md"
                  fullWidth
                  onClick={onClose}
                >
                  Close Receipt
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
