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
    <div className="min-h-screen bg-cms-bg dark:bg-[#080b12] flex items-center justify-center p-4 font-sans selection:bg-cms-accent/30 selection:text-white">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cms-accent/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cms-accent2/10 rounded-full blur-[120px] animate-pulse-slow" />
      </div>

      <div className="relative w-full max-w-md animate-fade-in">
        {/* Logo / Branding */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cms-accent via-cms-accent to-cms-accent2 shadow-2xl shadow-cms-accent/30 mb-6 transform hover:rotate-3 transition-transform duration-500">
            <ShieldCheck size={40} className="text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">SHA256.US</h1>
          <div className="flex items-center justify-center gap-3">
             <div className="h-[1px] w-8 bg-cms-accent/50" />
             <p className="text-[10px] text-cms-accent font-black uppercase tracking-[0.3em]">Compliance Forense</p>
             <div className="h-[1px] w-8 bg-cms-accent/50" />
          </div>
          <p className="text-[10px] text-cms-textMuted/60 mt-2 font-medium">
            SISTEMA DE GESTIÓN TÉCNICO-LEGAL PARA PERITURÍAS DIGITALES
          </p>
        </div>

        {/* Login Card */}
        <div className="cms-card p-8 bg-cms-sidebar/40 dark:bg-cms-sidebar/60 backdrop-blur-xl border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cms-accent to-transparent opacity-50" />
          
          <div className="mb-8 text-center sm:text-left">
            <h2 className="text-xl font-bold text-white tracking-tight">Acceso Restringido</h2>
            <p className="text-xs text-cms-textMuted mt-1 font-medium">Identifíquese para acceder a la base de datos de casos</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error */}
            {error && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm animate-shake">
                <AlertCircle size={18} className="shrink-0" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* Username */}
            <div className="space-y-2">
              <label className="cms-label ml-1">Identificador de Usuario</label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-cms-textMuted group-focus-within:text-cms-accent transition-colors">
                  <User size={18} />
                </div>
                <input
                  id="login-username"
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="ID de Perito"
                  className="cms-input pl-11 bg-cms-bg/50 border-cms-border hover:border-cms-accent/30 focus:border-cms-accent focus:ring-cms-accent/10 transition-all"
                  autoFocus
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="cms-label ml-1">Clave de Seguridad</label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-cms-textMuted group-focus-within:text-cms-accent transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="cms-input pl-11 pr-11 bg-cms-bg/50 border-cms-border hover:border-cms-accent/30 focus:border-cms-accent focus:ring-cms-accent/10 transition-all"
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cms-textMuted hover:text-white transition-colors p-1 rounded-md hover:bg-white/5">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={isLoading || !username.trim() || !password.trim()}
              className="cms-btn cms-btn-primary w-full py-4 text-sm font-black flex items-center justify-center gap-3 shadow-xl shadow-cms-accent/20 hover:shadow-cms-accent/40 active:scale-95 transition-all uppercase tracking-widest"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck size={18} />
                  Validar Credenciales
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-10 pt-6 border-t border-cms-border/30 text-center">
            <p className="text-[9px] text-cms-textMuted font-bold uppercase tracking-widest leading-relaxed">
              Sistema Certificado ISO 27037 / NIST SP 800-101
            </p>
            <p className="text-[8px] text-cms-textMuted/40 mt-2 font-mono">
              IP TRACEABLE · AUDIT LOG ACTIVE · END-TO-END ENCRYPTION
            </p>
          </div>
        </div>

        {/* Version */}
        <div className="mt-8 flex items-center justify-center gap-4 text-[9px] font-black text-cms-textMuted/30 tracking-widest uppercase">
           <span>v2.0.4.STABLE</span>
           <div className="w-1 h-1 rounded-full bg-cms-textMuted/20" />
           <span>NEON POSTGRES SQL</span>
           <div className="w-1 h-1 rounded-full bg-cms-textMuted/20" />
           <span>AVILLA FORENSICS</span>
        </div>
      </div>
    </div>
  );
}
