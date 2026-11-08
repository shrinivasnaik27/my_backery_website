import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Lock, KeyRound, AlertCircle } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { loginAdmin } = useStore();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(password.trim());
    if (success) {
      setError(false);
      setPassword('');
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-login-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative bg-[#FAF7F2] rounded-2xl max-w-sm w-full border border-[#E6DBCE] shadow-2xl p-6 sm:p-8 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 bg-white/80 hover:bg-white text-[#2C1810] p-2 rounded-full shadow-md transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1">
          <div className="w-12 h-12 bg-[#2C1810] text-[#DFB75A] rounded-full flex items-center justify-center mx-auto mb-2">
            <Lock className="w-6 h-6" />
          </div>
          <h3 id="admin-login-title" className="font-serif text-xl font-bold text-[#2C1810]">
            Owner Portal Login
          </h3>
          <p className="text-xs text-[#7A4B34]">
            Access live product pricing, orders, and business verification settings.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-[#2C1810] block mb-1">
              Owner Passcode
            </label>
            <div className="relative">
              <input
                type="password"
                required
                autoFocus
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder="Enter passcode..."
                className="w-full bg-white border border-[#E6DBCE] rounded-lg px-3 py-2 text-xs text-[#2C1810] focus:ring-1 focus:ring-[#C89D3C]"
              />
              <KeyRound className="w-4 h-4 text-[#7A4B34] absolute right-3 top-1/2 -translate-y-1/2 opacity-50" />
            </div>
          </div>

          {error && (
            <p className="text-xs text-rose-700 bg-rose-50 p-2 rounded border border-rose-200 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Incorrect passcode. Try "shabari123" or "bhatkal".</span>
            </p>
          )}

          <div className="p-2.5 bg-[#F3ECE2] rounded-lg text-[11px] text-[#7A4B34] border border-[#E6DBCE]">
            <strong>Proprietor Note:</strong> Default testing passcodes are: <code className="font-bold text-[#2C1810]">shabari123</code> or <code className="font-bold text-[#2C1810]">bhatkal</code>.
          </div>

          <button
            type="submit"
            className="w-full bg-[#2C1810] hover:bg-[#422518] text-[#FAF7F2] py-2.5 rounded-lg text-xs font-bold transition-all shadow-md active:scale-98"
          >
            Authenticate &amp; Open Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};
