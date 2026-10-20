import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  Building2, 
  X, 
  KeyRound, 
  Eye, 
  EyeOff, 
  ArrowRight
} from 'lucide-react';
import { UserRole } from '../../types/credence';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
  onLoginSuccess: (role: UserRole) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onLoginSuccess
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('owner');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess(selectedRole);
    }, 450);
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess(role);
    }, 350);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#051F20]/90 backdrop-blur-sm animate-fade-in transition-opacity"
        onClick={onClose}
      />

      {/* Institutional Security Terminal Dialog */}
      <div className="relative w-full max-w-lg bg-[#0B2B26] border border-[#235347] rounded-lg p-6 sm:p-8 text-[#DAF1DE] shadow-2xl z-10 my-8 overflow-hidden font-mono">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded text-[#8EB69B] hover:text-[#DAF1DE] hover:bg-[#163832] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Branding */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#163832]">
          <div className="w-8 h-8 rounded bg-[#163832] border border-[#235347] flex items-center justify-center text-[#5FD3A0]">
            <ShieldCheck className="w-5 h-5 text-[#5FD3A0]" />
          </div>
          <div>
            <h3 className="text-base font-bold font-heading text-white">
              CREDENCE // SECURITY ENCLAVE
            </h3>
            <p className="text-[11px] text-[#8EB69B]">
              Role-Based Financial Access Console
            </p>
          </div>
        </div>

        {/* Tab Toggle: Login vs Signup */}
        <div className="flex rounded bg-[#051F20] p-1 mb-5 border border-[#163832] text-xs">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-1.5 text-xs font-medium rounded transition-colors ${
              mode === 'login'
                ? 'bg-[#235347] text-white font-semibold'
                : 'text-[#8EB69B] hover:text-[#DAF1DE]'
            }`}
          >
            SIGN IN
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 py-1.5 text-xs font-medium rounded transition-colors ${
              mode === 'signup'
                ? 'bg-[#235347] text-white font-semibold'
                : 'text-[#8EB69B] hover:text-[#DAF1DE]'
            }`}
          >
            ENROL OPERATOR
          </button>
        </div>

        {/* 1-Click Persona Logins */}
        <div className="mb-5 p-3 rounded bg-[#051F20] border border-[#163832]">
          <div className="text-[10px] uppercase tracking-wider text-[#5FD3A0] mb-2 flex items-center justify-between">
            <span>OPERATOR PERSONAS (1-CLICK)</span>
            <span className="text-[9px] text-[#4B635C]">AUDITED PROFILES</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('owner')}
              className="p-2 text-left rounded bg-[#0B2B26] hover:bg-[#163832] border border-[#163832] text-[#DAF1DE] transition-colors cursor-pointer"
            >
              <div className="font-semibold text-[11px]">Devika Sharma</div>
              <div className="text-[10px] text-[#8EB69B]">VP Ops (Owner)</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('finance_manager')}
              className="p-2 text-left rounded bg-[#0B2B26] hover:bg-[#163832] border border-[#163832] text-[#DAF1DE] transition-colors cursor-pointer"
            >
              <div className="font-semibold text-[11px]">Karan Singhal</div>
              <div className="text-[10px] text-[#8EB69B]">CFO (Finance Mgr)</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('risk_analyst')}
              className="p-2 text-left rounded bg-[#0B2B26] hover:bg-[#163832] border border-[#163832] text-[#DAF1DE] transition-colors cursor-pointer"
            >
              <div className="font-semibold text-[11px]">Sanjay Mehta</div>
              <div className="text-[10px] text-[#8EB69B]">Senior Risk Analyst</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('bank_reviewer')}
              className="p-2 text-left rounded bg-[#0B2B26] hover:bg-[#163832] border border-[#163832] text-[#DAF1DE] transition-colors cursor-pointer"
            >
              <div className="font-semibold text-[11px]">Anoop Nair</div>
              <div className="text-[10px] text-[#5FD3A0]">Axis Bank SME Review</div>
            </button>
          </div>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-[11px] text-[#8EB69B] mb-1">
                  FULL NAME
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#8EB69B]" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Vikram Malhotra"
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded bg-[#051F20] border border-[#235347] text-[#DAF1DE] placeholder-[#4B635C] focus:outline-none focus:border-[#5FD3A0]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-[#8EB69B] mb-1">
                  BUSINESS ENTITY NAME
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#8EB69B]" />
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Nexus Enterprise Solutions"
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded bg-[#051F20] border border-[#235347] text-[#DAF1DE] placeholder-[#4B635C] focus:outline-none focus:border-[#5FD3A0]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-[#8EB69B] mb-1">
                  OPERATIONAL ROLE
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="w-full px-3 py-1.5 text-xs rounded bg-[#051F20] border border-[#235347] text-[#DAF1DE] focus:outline-none focus:border-[#5FD3A0]"
                >
                  <option value="owner">Business Owner / VP Operations</option>
                  <option value="finance_manager">Finance Manager / CFO</option>
                  <option value="risk_analyst">Risk &amp; Compliance Analyst</option>
                  <option value="bank_reviewer">Bank Credit / SME Reviewer</option>
                  <option value="admin">System Security Admin</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-[11px] text-[#8EB69B] mb-1">
              WORK EMAIL ADDRESS
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#8EB69B]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@company.in"
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded bg-[#051F20] border border-[#235347] text-[#DAF1DE] placeholder-[#4B635C] focus:outline-none focus:border-[#5FD3A0]"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] text-[#8EB69B]">PASSWORD</label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[10px] text-[#8EB69B] hover:text-[#DAF1DE] flex items-center gap-1"
              >
                {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{showPassword ? 'HIDE' : 'SHOW'}</span>
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#8EB69B]" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded bg-[#051F20] border border-[#235347] text-[#DAF1DE] placeholder-[#4B635C] focus:outline-none focus:border-[#5FD3A0]"
              />
            </div>
          </div>

          {/* Consent */}
          <div className="pt-1">
            <label className="flex items-start gap-2 text-[11px] text-[#8EB69B] cursor-pointer">
              <input
                type="checkbox"
                required
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-0.5 rounded border-[#235347] bg-[#051F20] text-[#5FD3A0] focus:ring-0"
              />
              <span>
                I accept the Behavioural Trust Governance Charter &amp; Access Controls.
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded bg-[#2F9E6E] text-[#051F20] font-semibold font-mono text-xs hover:bg-[#5FD3A0] transition-colors flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span className="font-mono text-xs">AUTHENTICATING...</span>
            ) : (
              <>
                <span>{mode === 'login' ? 'AUTHENTICATE SESSION' : 'SUBMIT ENROLMENT'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Security Trust Badges */}
        <div className="mt-5 pt-3 border-t border-[#163832] flex items-center justify-around text-[10px] font-mono text-[#8EB69B]">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-[#5FD3A0]" />
            <span>Argon2id Salted</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3 text-[#5FD3A0]" />
            <span>RBAC Enforced</span>
          </div>
          <div className="flex items-center gap-1.5">
            <KeyRound className="w-3 h-3 text-[#5FD3A0]" />
            <span>TOTP Enclave</span>
          </div>
        </div>
      </div>
    </div>
  );
};
