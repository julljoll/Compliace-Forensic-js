import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { ShieldCheck, Eye, EyeOff, AlertCircle, User } from 'lucide-react';

export default function LoginPage() {
  const { login, isLoading, error, clearError } = useAuthStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (!username.trim() || !password.trim()) return;
    await login(username.trim(), password);
  };

  return (
    <div className="min-h-screen bg-fluent-bg flex items-center justify-center p-4 font-sans selection:bg-fluent-accent/30 overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-fluent-accent/5 rounded-full blur-[140px] animate-pulse-slow" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/5 rounded-full blur-[120px] animate-pulse-slow" />
      </div>

      <div className="relative w-full max-w-[400px] flex flex-col items-center animate-fade-in">
        {/* Windows 11 User Avatar Circle */}
        <div className="w-24 h-24 rounded-full bg-fluent-surface border border-white/10 flex items-center justify-center mb-8 shadow-2xl overflow-hidden group">
          <div className="w-full h-full bg-gradient-to-br from-fluent-accent/20 to-fluent-accent-light/20 flex items-center justify-center transition-transform group-hover:scale-110">
            <User size={48} className="text-fluent-text opacity-80" strokeWidth={1.5} />
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white tracking-tight mb-1">SHA256.US CMS</h1>
          <p className="text-xs text-fluent-text-muted font-medium uppercase tracking-[0.2em]">Compliance Officer Login</p>
        </div>

        {/* Login Container (Fluent Acrylic) */}
        <div className="w-full fluent-mica p-8 rounded-xl border border-white/5 shadow-[0_32px_64px_rgba(0,0,0,0.4)] relative">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center gap-3 p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-200 text-xs animate-shake">
                <AlertCircle size={16} className="shrink-0" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="fluent-label ml-1">Account</label>
              <div className="relative group">
                <input
                  id="login-username"
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Username"
                  className="fluent-input bg-white/[0.03] focus:bg-white/[0.05]"
                  autoFocus
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="fluent-label ml-1">Security Key</label>
              <div className="relative group">
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Password"
                  className="fluent-input bg-white/[0.03] focus:bg-white/[0.05] pr-10"
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-fluent-text-muted hover:text-white p-1.5 rounded-md hover:bg-white/5 transition-colors">
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                id="login-submit"
                type="submit"
                disabled={isLoading || !username.trim() || !password.trim()}
                className="fluent-btn fluent-btn-primary w-full py-2.5 font-bold tracking-tight shadow-lg hover:translate-y-[-1px] active:translate-y-[0] transition-all"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <ShieldCheck size={16} strokeWidth={2.5} />
                    Sign In
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 flex items-center justify-between gap-4">
             <button type="button" className="text-[11px] text-fluent-accent hover:underline font-semibold transition-all">I forgot my password</button>
             <button type="button" className="text-[11px] text-fluent-text-muted hover:text-white font-medium transition-all">Sign-in options</button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
           <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-fluent-accent" />
              <div className="w-1.5 h-1.5 rounded-full bg-fluent-text-muted/30" />
              <div className="w-1.5 h-1.5 rounded-full bg-fluent-text-muted/30" />
           </div>
           <p className="text-[10px] text-fluent-text-muted font-bold tracking-[0.2em] uppercase opacity-40">
              Microsoft Azure AD · Secured by Avilla
           </p>
        </div>
      </div>
    </div>
  );
}
