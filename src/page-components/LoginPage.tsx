import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { ShieldCheck, AlertCircle, Mail, Lock } from '../components/atoms/AppleIcon';
import Button from '../components/atoms/Button';

export default function LoginPage() {
  const { login, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (!email.trim() || !password.trim()) return;
    await login(email.trim(), password.trim());
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans overflow-hidden selection:bg-[rgba(0,113,227,0.25)] relative bg-[var(--apple-bg)]">
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{ background: 'var(--login-bg)' }}
      />

      <div className="relative w-full max-w-[380px] flex flex-col items-center apple-fade-in z-10">
        <div className="w-20 h-20 rounded-full bg-white/70 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center mb-6 shadow-[var(--co-shadow-2)] backdrop-blur-[10px] transition-all duration-300">
          <img src="https://ik.imagekit.io/lvxdbpx6l/APP%20FORENSICS/favicon.svg" alt="SHA256.US" className="w-11 h-11" />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-[28px] font-bold text-[var(--apple-text)] tracking-[-0.03em] mb-0.5">SHA256.US</h1>
          <p className="text-[13px] text-[var(--co-gray-1)] font-medium tracking-[-0.01em]">Sistema de Peritaje Forense Digital</p>
        </div>

        <div className="w-full bg-white/70 dark:bg-white/5 rounded-[20px] border border-[var(--co-separator)] dark:border-white/10 p-7 shadow-[var(--co-shadow-modal)] backdrop-blur-[30px] transition-all duration-300">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2.5 p-3 rounded-[10px] bg-[#FF453A]/[0.08] border border-[#FF453A]/15 animate-apple-fadeIn">
                <AlertCircle size={15} className="shrink-0 text-[var(--co-red)]" />
                <span className="text-[13px] text-[var(--co-red)] font-medium">{error}</span>
              </div>
            )}

            <div className="space-y-1.5 flex flex-col items-start w-full">
              <label htmlFor="login-email" className="block text-[11px] font-bold text-[var(--co-gray-1)] uppercase tracking-[0.05em] select-none">
                Correo Electrónico
              </label>
              <div className="relative w-full">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--co-gray-2)] pointer-events-none" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  autoComplete="email"
                  autoFocus
                  className="w-full text-[15px] bg-white/60 dark:bg-white/5 border border-[var(--co-separator)] dark:border-white/10 rounded-[10px] pl-10 pr-3.5 py-2.5 outline-none transition-all duration-200 placeholder-[var(--co-gray-2)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] focus:border-[var(--co-accent)] focus:ring-[3px] focus:ring-[var(--co-accent)]/20 text-[var(--apple-text)]"
                />
              </div>
            </div>

            <div className="space-y-1.5 flex flex-col items-start w-full">
              <label htmlFor="login-password" className="block text-[11px] font-bold text-[var(--co-gray-1)] uppercase tracking-[0.05em] select-none">
                Contraseña
              </label>
              <div className="relative w-full">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--co-gray-2)] pointer-events-none" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full text-[15px] bg-white/60 dark:bg-white/5 border border-[var(--co-separator)] dark:border-white/10 rounded-[10px] pl-10 pr-10 py-2.5 outline-none transition-all duration-200 placeholder-[var(--co-gray-2)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] focus:border-[var(--co-accent)] focus:ring-[3px] focus:ring-[var(--co-accent)]/20 text-[var(--apple-text)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--co-gray-2)] hover:text-[var(--co-gray-1)] transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <Button
              id="login-submit"
              type="submit"
              variant="primary"
              size="lg"
              disabled={isLoading || !email.trim() || !password.trim()}
              className="w-full"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck size={16} strokeWidth={2.5} />
                  <span>Iniciar Sesión</span>
                </>
              )}
            </Button>
          </form>
        </div>

        <div className="mt-8 w-full text-center space-y-4">
          <div className="p-3.5 rounded-[12px] bg-[var(--co-orange)]/5 border border-[var(--co-orange)]/15 text-left flex items-start gap-2.5 max-w-[340px] mx-auto transition-all">
            <span className="text-[9px] font-bold text-[var(--co-orange)] bg-[var(--co-orange)]/10 px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 mt-0.5">
              AVISO LEGAL
            </span>
            <p className="text-[10px] text-[var(--co-gray-1)] leading-relaxed font-normal">
              El acceso no autorizado será registrado y procesado penalmente conforme al <strong>Art. 187 del COPP</strong> y la <strong>Ley sobre Mensajes de Datos y Firmas Electrónicas</strong>.
            </p>
          </div>

          <div className="pt-2 flex flex-col items-center space-y-2">
            <div className="flex items-center justify-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-black/20 dark:bg-white/20" />
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--co-accent)]" />
              <div className="w-1 h-1 rounded-full bg-black/20 dark:bg-white/20" />
            </div>

            <p className="text-[11px] font-semibold text-[var(--apple-text)]/90 dark:text-white/90 tracking-tight">
              SHA256.US v2.0 <span className="text-[var(--apple-text)]/45 dark:text-white/45 font-light">·</span> Laboratorio de Informática Forense
            </p>

            <p className="text-[9.5px] text-[var(--co-gray-1)] leading-relaxed max-w-[290px] font-medium opacity-80">
              Av. 6 con calle 7, Edif. Mercantil La Ceiba, Piso 1, Ofc. Nº 8.<br />
              Quíbor, Municipio Jiménez, Estado Lara.
            </p>

            <p className="text-[8.5px] text-[var(--apple-text)]/30 dark:text-white/30 font-semibold uppercase tracking-[0.15em] pt-1">
              powered by <span className="text-[var(--apple-text)] dark:text-white font-bold">jull</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
