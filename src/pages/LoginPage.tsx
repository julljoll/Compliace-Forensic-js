import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { ShieldCheck, Eye, EyeOff, AlertCircle } from '../components/atoms/AppleIcon';

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
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-4 font-sans overflow-hidden selection:bg-[rgba(0,113,227,0.2)]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-15%] left-[-5%] w-[50%] h-[60%] bg-[rgba(0,113,227,0.03)] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-15%] right-[-5%] w-[50%] h-[60%] bg-[rgba(0,122,255,0.02)] rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-[380px] flex flex-col items-center apple-fade-in">
        <div className="w-20 h-20 rounded-full bg-white border border-[rgba(0,0,0,0.06)] flex items-center justify-center mb-6 shadow-[0_0_1px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.04)]">
          <img src="https://ik.imagekit.io/lvxdbpx6l/APP%20FORENSICS/favicon.svg" alt="SHA256.US" className="w-11 h-11" />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-[28px] font-bold text-[#1D1D1F] tracking-[-0.03em] mb-0.5">SHA256.US</h1>
          <p className="text-[13px] text-[#86868B] font-medium tracking-[-0.01em]">Sistema de Peritaje Forense Digital</p>
        </div>

        <div className="w-full bg-white rounded-[20px] border border-[rgba(0,0,0,0.06)] p-7 shadow-[0_0_1px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.04)]">

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2.5 p-3 rounded-[10px] bg-[rgba(255,59,48,0.08)] border border-[rgba(255,59,48,0.15)]">
                <AlertCircle size={15} className="shrink-0 text-[#FF3B30]" />
                <span className="text-[13px] text-[#BF2D24] font-medium">{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="login-username" className="block text-[13px] font-semibold text-[#6E6E73] tracking-[-0.01em]">Usuario</label>
              <input
                id="login-username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Nombre de usuario"
                className="apple-input"
                autoFocus
                autoComplete="username"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="login-password" className="block text-[13px] font-semibold text-[#6E6E73] tracking-[-0.01em]">Contraseña</label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Contraseña"
                  className="apple-input pr-10"
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#86868B] hover:text-[#1D1D1F] p-1 rounded-[6px] hover:bg-[rgba(0,0,0,0.05)] transition-all">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={isLoading || !username.trim() || !password.trim()}
              className="apple-btn apple-btn-primary w-full py-2.5 text-[14px] font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck size={16} strokeWidth={2.5} />
                  Iniciar Sesión
                </>
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[rgba(0,0,0,0.06)]" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 text-[11px] font-medium text-[#86868B] bg-white">O</span>
            </div>
          </div>

          <button
            onClick={() => {
              const apiUrl = import.meta.env.VITE_API_URL || '/api/oauth/vercel';
              window.location.href = apiUrl;
            }}
            type="button"
            className="apple-btn w-full py-2.5 text-[13px] font-semibold bg-[rgba(0,0,0,0.04)] border border-[rgba(0,0,0,0.12)] text-[#1D1D1F] hover:bg-[rgba(0,0,0,0.08)] transition-all"
          >
            <svg viewBox="0 0 24 24" width={15} height={15} fill="#000000" className="shrink-0">
              <path d="M12 2L22 21H2L12 2Z" />
            </svg>
            Iniciar sesión con Vercel
          </button>
        </div>

        <div className="mt-8 w-full text-center space-y-4">
          {/* Legal Warning Badge/Card */}
          <div className="p-3.5 rounded-[12px] bg-[rgba(255,149,0,0.03)] border border-[rgba(255,149,0,0.12)] text-left flex items-start gap-2.5 max-w-[340px] mx-auto">
            <span className="text-[9px] font-bold text-[#FF9500] bg-[#FF9500]/10 px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 mt-0.5">
              AVISO LEGAL
            </span>
            <p className="text-[10px] text-[#6E6E73] leading-relaxed font-normal">
              El acceso no autorizado será registrado y procesado penalmente conforme al <strong>Art. 187 del COPP</strong> y la <strong>Ley sobre Mensajes de Datos y Firmas Electrónicas</strong>.
            </p>
          </div>

          <div className="pt-2 flex flex-col items-center space-y-2">
            {/* Dots divider */}
            <div className="flex items-center justify-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-[#86868B]/40" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#0071E3]/70" />
              <div className="w-1 h-1 rounded-full bg-[#86868B]/40" />
            </div>

            {/* Brand and Laboratorio */}
            <p className="text-[11px] font-semibold text-[#1D1D1F] tracking-tight">
              SHA256.US v2.0 <span className="text-[#86868B] font-light">·</span> Laboratorio de Informática Forense
            </p>

            {/* Address */}
            <p className="text-[9.5px] text-[#86868B] leading-relaxed max-w-[290px] font-medium opacity-80">
              Av. 6 con calle 7, Edif. Mercantil La Ceiba, Piso 1, Ofc. Nº 8.<br />
              Quíbor, Municipio Jiménez, Estado Lara.
            </p>

            {/* Powered by */}
            <p className="text-[8.5px] text-[#86868B] font-semibold uppercase tracking-[0.15em] opacity-40 pt-1">
              powered by <span className="text-[#1D1D1F] font-bold">jull</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
