import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { ShieldCheck, Eye, EyeOff, AlertCircle, Lock, User } from 'lucide-react';

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
    <div className="min-h-screen bg-cms-bg flex items-center justify-center p-4 font-sans">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cms-accent/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cms-accent2/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative w-full max-w-md animate-fade-in">
        {/* Logo / Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-cms-accent to-cms-accent2 shadow-lg shadow-cms-accent/20 mb-4">
            <ShieldCheck size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-wider">SHA256.US</h1>
          <p className="text-xs text-cms-textMuted mt-1 uppercase tracking-widest">Peritaje Digital · WhatsApp</p>
          <p className="text-[10px] text-cms-textMuted/60 mt-1">
            Civil · Mercantil · Contratos Digitales
          </p>
        </div>

        {/* Login Card */}
        <div className="cms-card p-8">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white">Iniciar Sesión</h2>
            <p className="text-xs text-cms-textMuted mt-1">Acceda al sistema de peritaje forense</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Username */}
            <div>
              <label className="cms-label">Usuario</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-cms-textMuted" />
                <input
                  id="login-username"
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="admin"
                  className="cms-input pl-10"
                  autoFocus
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="cms-label">Contraseña</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-cms-textMuted" />
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="cms-input pl-10 pr-10"
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cms-textMuted hover:text-white transition-colors">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={isLoading || !username.trim() || !password.trim()}
              className="cms-btn cms-btn-primary w-full py-3 text-base font-bold flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Lock size={16} />
                  Acceder
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-5 border-t border-cms-border text-center">
            <p className="text-[10px] text-cms-textMuted">
              Sistema de Peritaje Digital Privado · Ley de Mensajes de Datos y Firmas Electrónicas
            </p>
            <p className="text-[9px] text-cms-textMuted/50 mt-1">
              ISO 27037 · ISO 27042 · MUCC-2017 · NIST 800-101
            </p>
          </div>
        </div>

        {/* Version */}
        <p className="text-center text-[9px] text-cms-textMuted/40 mt-4">v1.0.0 · SQLite Local</p>
      </div>
    </div>
  );
}
