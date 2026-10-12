import React from 'react';
import {
  CheckCircle,
  Smartphone,
  MessageCircle,
  Percent,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Layers,
  Palette,
  Type,
  Coins
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { BRAND } from '../../constants/theme';

export const DesignSystemShowcase: React.FC = () => {
  const steps = [
    { num: 'Step 1', title: 'Project Setup & Design System', status: 'Completed', current: true },
    { num: 'Step 2', title: 'Landing Page Hero + Commission Comparison', status: 'Next', current: false },
    { num: 'Step 3', title: 'Live Listings Feed with Mock Nairobi Data', status: 'Queued', current: false },
    { num: 'Step 4', title: 'Property Detail + WhatsApp Direct Flow', status: 'Queued', current: false },
    { num: 'Step 5', title: 'M-Pesa STK Push Mock + Verification', status: 'Queued', current: false },
    { num: 'Step 6', title: 'Host Lead Capture Form (Collect Hosts Today)', status: 'Queued', current: false },
    { num: 'Step 7', title: 'Host Dashboard', status: 'Queued', current: false },
    { num: 'Step 8', title: 'Polish & Deploy to Firebase', status: 'Queued', current: false },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Step Status Hero Banner */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#EBE5DB] shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00A651]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#00A651] bg-[#EAF8F0] px-2.5 py-1 rounded-md border border-[#00A651]/20">
                Phase 1 of 8 Active
              </span>
              <span className="text-xs text-[#6B7280]">·</span>
              <span className="text-xs font-medium text-[#111111]">LipaStay.co.ke Core Initialized</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111111]">
              Step 1: Project Setup & Design System
            </h1>
            <p className="text-sm sm:text-base text-[#4B5563] max-w-2xl">
              Brand tokens, Inter typography, mobile-first component primitives, and Kenyan trust
              standards are verified and configured.
            </p>
          </div>
          <div className="bg-[#FFFBF5] border border-[#EBE5DB] rounded-xl p-4 shrink-0 flex flex-col justify-center">
            <div className="text-xs text-[#6B7280] font-medium">Ready for next command</div>
            <div className="text-lg font-bold text-[#00A651] flex items-center gap-1.5 mt-0.5">
              <CheckCircle className="w-5 h-5 text-[#00A651]" />
              <span>Step 1 Complete</span>
            </div>
            <div className="text-[11px] text-[#4B5563] mt-1 font-mono">
              Ready for: Step 2 Hero & Commission Tool
            </div>
          </div>
        </div>
      </section>

      {/* Brand & Design System Foundations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 1. Palette */}
        <div className="bg-white rounded-2xl p-6 border border-[#EBE5DB] shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-[#111111]">
            <Palette className="w-4 h-4 text-[#00A651]" />
            <h3>Kenyan Color Architecture</h3>
          </div>
          <p className="text-xs text-[#6B7280]">
            Recognizable trust signals rooted in Safaricom M-Pesa green, deep charcoal, and warm earth.
          </p>
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#00A651] text-white">
              <div>
                <div className="text-xs font-semibold">M-Pesa Green</div>
                <div className="text-[11px] opacity-90 font-mono">#00A651</div>
              </div>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded font-medium">Primary CTA</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#111111] text-white">
              <div>
                <div className="text-xs font-semibold">Deep Kenyan Charcoal</div>
                <div className="text-[11px] opacity-90 font-mono">#111111</div>
              </div>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded font-medium">Base Text / Nav</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#FF6B35] text-white">
              <div>
                <div className="text-xs font-semibold">Warm Sunset Coral</div>
                <div className="text-[11px] opacity-90 font-mono">#FF6B35</div>
              </div>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded font-medium">Host / Highlights</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#FFFBF5] text-[#111111] border border-[#EBE5DB]">
              <div>
                <div className="text-xs font-semibold">Warm Ivory Canvas</div>
                <div className="text-[11px] text-[#6B7280] font-mono">#FFFBF5</div>
              </div>
              <span className="text-xs bg-black/5 px-2 py-0.5 rounded font-medium">App Background</span>
            </div>
          </div>
        </div>

        {/* 2. Interactive UI Primitives */}
        <div className="bg-white rounded-2xl p-6 border border-[#EBE5DB] shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-[#111111]">
            <Layers className="w-4 h-4 text-[#00A651]" />
            <h3>Component Primitives (Buttons & Tags)</h3>
          </div>
          <p className="text-xs text-[#6B7280]">
            Accessible touch targets (&gt;44px), tactile feedback, and crisp anti-slop typography.
          </p>

          <div className="space-y-4 pt-1">
            <div className="space-y-2">
              <div className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">
                Action Buttons
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="mpesa" size="sm" leftIcon={<Smartphone className="w-3.5 h-3.5" />}>
                  Pay with M-Pesa
                </Button>
                <Button variant="dark" size="sm" leftIcon={<MessageCircle className="w-3.5 h-3.5" />}>
                  WhatsApp Host
                </Button>
                <Button variant="warm" size="sm" leftIcon={<Sparkles className="w-3.5 h-3.5" />}>
                  Host 0%
                </Button>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">
                Trust Indicators
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="mpesa" icon={<ShieldCheck className="w-3.5 h-3.5 text-[#00A651]" />}>
                  Verified Host Till
                </Badge>
                <Badge variant="warm" icon={<Percent className="w-3.5 h-3.5 text-[#FF6B35]" />}>
                  0% Commission
                </Badge>
                <Badge variant="neutral" icon={<CheckCircle className="w-3.5 h-3.5 text-[#00A651]" />}>
                  Instant WhatsApp
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Typography & Brand Value */}
        <div className="bg-white rounded-2xl p-6 border border-[#EBE5DB] shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-[#111111]">
            <Type className="w-4 h-4 text-[#00A651]" />
            <h3>Inter Typography & Kenyan Value</h3>
          </div>
          <p className="text-xs text-[#6B7280]">
            Clean legibility optimized for mobile viewports across Kenya.
          </p>
          <div className="p-4 rounded-xl bg-[#FFFBF5] border border-[#EBE5DB] space-y-3">
            <div className="space-y-1">
              <div className="text-[11px] text-[#6B7280] uppercase tracking-wider font-semibold">
                Core Positioning
              </div>
              <div className="text-xl font-extrabold text-[#111111] tracking-tight">
                Lipa Direct. Stay Free.
              </div>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                Why pay 15-25% to Booking.com or Airbnb? LipaStay connects Kenyan hosts and guests
                directly via Safaricom M-Pesa.
              </p>
            </div>
            <div className="pt-2 border-t border-[#EBE5DB] flex items-center justify-between text-xs text-[#6B7280]">
              <span className="font-mono">Font: Inter 400/500/600/700/800</span>
              <span className="text-[#00A651] font-semibold">Mobile-First</span>
            </div>
          </div>
        </div>
      </div>

      {/* 8-Step Product Roadmap Tracker */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#EBE5DB] shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#111111]">LipaStay.co.ke Build Roadmap</h2>
            <p className="text-xs text-[#6B7280]">
              Step-by-step modular development protocol as commanded by the Lead Engineer workflow.
            </p>
          </div>
          <span className="text-xs font-semibold text-[#00A651] bg-[#EAF8F0] px-3 py-1 rounded-full border border-[#00A651]/20">
            Step 1 Finished
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {steps.map((s, idx) => (
            <div
              key={s.num}
              className={`p-4 rounded-xl border transition-all ${
                s.current
                  ? 'bg-[#EAF8F0]/40 border-[#00A651] shadow-sm'
                  : idx === 1
                  ? 'bg-amber-50/30 border-amber-300'
                  : 'bg-[#FFFBF5] border-[#EBE5DB] opacity-75'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#111111]">{s.num}</span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    s.status === 'Completed'
                      ? 'bg-[#00A651] text-white'
                      : s.status === 'Next'
                      ? 'bg-[#FF6B35] text-white'
                      : 'bg-neutral-200 text-neutral-600'
                  }`}
                >
                  {s.status}
                </span>
              </div>
              <h4 className="text-xs font-semibold text-[#111111] line-clamp-2 leading-snug">
                {s.title}
              </h4>
            </div>
          ))}
        </div>
      </section>

      {/* Next Step Callout */}
      <section className="p-6 bg-gradient-to-r from-[#111111] to-[#1f2937] text-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs text-[#00A651] font-semibold">
            <Coins className="w-4 h-4" /> Ready for Step 2
          </div>
          <h3 className="text-base sm:text-lg font-bold">
            Landing Page Hero + Commission Comparison Calculator
          </h3>
          <p className="text-xs text-neutral-300 max-w-xl">
            Next prompt will build the high-conversion Hero section and the dynamic savings
            calculator contrasting Airbnb (15.5%) and Booking.com (18-20%) against LipaStay (0%).
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <div className="text-xs text-neutral-400 font-mono hidden md:block">
            Awaiting Step 2 prompt...
          </div>
        </div>
      </section>
    </div>
  );
};
