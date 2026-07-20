import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/authStore';
import { ShieldCheck, AlertCircle, Mail, Lock } from '../components/atoms/AppleIcon';
import Button from '../components/atoms/Button';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (!email.trim() || !password.trim()) return;
    const success = await login(email.trim(), password.trim());
    if (success) {
      router.replace('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans overflow-hidden selection:bg-[rgba(0,113,227,0.25)] relative bg-[var(--apple-bg)]">
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{ background: 'var(--login-bg)' }}
      />

      <div className="relative w-full max-w-[380px] flex flex-col items-center apple-fade-in z-10">
        <div className="w-20 h-20 rounded-md bg-black/30 border border-[var(--co-separator)] flex items-center justify-center mb-6 shadow-md transition-all duration-300">
          <img src="/logo.png" alt="SHA256.US" className="w-12 h-12 object-contain" />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-[28px] font-bold text-[#00FF41] tracking-[-0.03em] mb-0.5 font-mono">SHA256.US</h1>
          <p className="text-[13px] text-white/60 font-medium tracking-[-0.01em]">Sistema de Peritaje Forense Digital</p>
        </div>

        <div className="w-full bg-black/40 backdrop-blur-md rounded-md border border-[var(--co-separator)] p-7 shadow-2xl transition-all duration-300">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2.5 p-3 rounded-md bg-[#FF453A]/[0.08] border border-[#FF453A]/15 animate-apple-fadeIn">
                <AlertCircle size={15} className="shrink-0 text-[var(--co-red)]" />
                <span className="text-[13px] text-[var(--co-red)] font-medium">{error}</span>
              </div>
            )}

            <div className="space-y-1.5 flex flex-col items-start w-full">
              <label htmlFor="login-email" className="block text-[11px] font-bold text-[#FECF06] font-mono uppercase tracking-[0.05em] select-none">
                Correo Electrónico
              </label>
              <div className="relative w-full">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  autoComplete="email"
                  autoFocus
                  className="w-full text-[15px] bg-black/20 border border-[var(--co-separator)] rounded-md pl-10 pr-3.5 py-2.5 outline-none transition-all duration-200 placeholder-white/30 focus:border-[#FECF06] focus:ring-4 focus:ring-[#FECF06]/20 text-white"
                />
              </div>
            </div>

            <div className="space-y-1.5 flex flex-col items-start w-full">
              <label htmlFor="login-password" className="block text-[11px] font-bold text-[#FECF06] font-mono uppercase tracking-[0.05em] select-none">
                Contraseña
              </label>
              <div className="relative w-full">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full text-[15px] bg-black/20 border border-[var(--co-separator)] rounded-md pl-10 pr-10 py-2.5 outline-none transition-all duration-200 placeholder-white/30 focus:border-[#FECF06] focus:ring-4 focus:ring-[#FECF06]/20 text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
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
              className="w-full text-black rounded-md"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck size={16} strokeWidth={2.5} />
                  <span>Iniciar Sesión</span>
                </>
              )}
            </Button>
            
            <div className="mt-4 p-2.5 rounded-md bg-black/20 border border-[var(--co-separator)] text-center">
              <p className="text-[11px] text-white/50 font-medium">
                Acceso Administrador por Defecto:<br />
                <span className="text-[#00FF41] select-all font-mono font-bold">julljoll@gmail.com</span> | <span className="text-[#00FF41] select-all font-mono font-bold">admin</span>
              </p>
            </div>
          </form>
        </div>

        <div className="mt-8 w-full text-center space-y-4">
          <div className="p-3.5 rounded-md bg-black/20 border border-[var(--co-separator)] text-left flex items-start gap-2.5 max-w-[340px] mx-auto transition-all">
            <span className="text-[9px] font-bold text-[#FECF06] font-mono bg-[#FECF06]/10 px-1.5 py-0.5 rounded border border-[#FECF06]/20 uppercase tracking-wider shrink-0 mt-0.5">
              AVISO LEGAL
            </span>
            <p className="text-[10px] text-white/70 leading-relaxed font-normal">
              El acceso no autorizado será registrado y procesado penalmente conforme al <strong>Art. 187 del COPP</strong> y la <strong>Ley sobre Mensajes de Datos y Firmas Electrónicas</strong>.
            </p>
          </div>

          <div className="pt-2 flex flex-col items-center space-y-2">
            <div className="flex items-center justify-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-black/20" />
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--co-accent)]" />
              <div className="w-1 h-1 rounded-full bg-black/20" />
            </div>

            <p className="text-[11px] font-semibold text-[var(--apple-text)]/90 tracking-tight">
              SHA256.US v2.0 <span className="text-[var(--apple-text)]/45 font-light">·</span> Laboratorio de Informática Forense
            </p>

            <p className="text-[9.5px] text-[var(--co-gray-1)] leading-relaxed max-w-[290px] font-medium opacity-80">
              Av. 6 con calle 7, Edif. Mercantil La Ceiba, Piso 1, Ofc. Nº 8.<br />
              Quíbor, Municipio Jiménez, Estado Lara.
            </p>

            <p className="text-[8.5px] text-[var(--apple-text)]/30 font-semibold uppercase tracking-[0.15em] pt-1">
              powered by <span className="text-[var(--apple-text)] font-bold">jull</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
