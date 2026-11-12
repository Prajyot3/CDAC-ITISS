import React from 'react';
import { ArrowLeft, Lock, ShieldAlert } from 'lucide-react';
import { ACCESS_LABELS, type AccessLevel } from '../../lib/access';

export const AccessBlocked: React.FC = () => (
  <div className="mx-auto max-w-lg space-y-4 rounded-2xl border border-red-500/30 bg-[#141C24] p-6 text-center">
    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10">
      <ShieldAlert className="h-5 w-5 text-red-400" />
    </div>
    <div className="space-y-1">
      <h2 className="text-base font-bold text-white">Portal access suspended</h2>
      <p className="text-xs leading-relaxed text-[#9CA3AF]">
        An administrator has blocked this account from the preparation platform. Contact the
        academy administrator to restore access.
      </p>
    </div>
    <div className="rounded-lg border border-[#1F2933] bg-[#0C1014] p-3 text-[11px] font-mono text-[#718092]">
      Access level · <span className="text-red-300">blocked</span>
    </div>
  </div>
);

interface AccessRestrictedProps {
  level: AccessLevel;
  isAdmin: boolean;
  onBack: () => void;
}

export const AccessRestricted: React.FC<AccessRestrictedProps> = ({ level, isAdmin, onBack }) => (
  <div className="mx-auto max-w-lg space-y-4 rounded-2xl border border-amber-500/30 bg-[#141C24] p-6 text-center">
    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10">
      <Lock className="h-5 w-5 text-amber-400" />
    </div>
    <div className="space-y-1">
      <h2 className="text-base font-bold text-white">Not included in your access</h2>
      <p className="text-xs leading-relaxed text-[#9CA3AF]">
        Your account is on <span className="font-semibold text-white">{ACCESS_LABELS[level]}</span>,
        which does not include this section.
      </p>
    </div>
    <div className="rounded-lg border border-[#1F2933] bg-[#0C1014] p-3 text-[11px] font-mono text-[#718092]">
      {isAdmin
        ? 'Change it in Admin · Users → Access.'
        : 'Ask the academy administrator to upgrade your access.'}
    </div>
    <button
      type="button"
      onClick={onBack}
      className="mx-auto flex items-center justify-center gap-1.5 rounded-lg border border-[#2A3848] px-3 py-2 text-[11px] font-semibold text-[#C4CDD6] transition-colors hover:border-[#76B900] hover:text-white"
    >
      <ArrowLeft className="h-3.5 w-3.5" />
      Back to dashboard
    </button>
  </div>
);
