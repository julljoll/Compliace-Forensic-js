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
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#151517] flex items-center justify-center p-4 font-sans overflow-hidden selection:bg-[rgba(0,113,227,0.25)] relative transition-colors duration-500">
      {/* Sonoma/Sequoia style organic gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-gradient-to-br from-[#0A84FF]/20 to-[#5E5CE6]/10 rounded-full blur-[130px] opacity-70 dark:opacity-45 animate-pulse-slow" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-gradient-to-tr from-[#BF5AF2]/15 to-[#FF9F0A]/10 rounded-full blur-[130px] opacity-70 dark:opacity-35" />
        <div className="absolute top-[30%] left-[25%] w-[35%] h-[35%] bg-[#0A84FF]/4 dark:bg-[#0A84FF]/2 rounded-full blur-[100px]" />
      </div>

      <div className="relative w-full max-w-[380px] flex flex-col items-center apple-fade-in">
        {/* Apple Style Floating Logo Container */}
        <div className="w-20 h-20 rounded-full bg-white/85 dark:bg-[#2C2C2E]/85 border border-black/[0.06] dark:border-white/[0.08] flex items-center justify-center mb-6 shadow-apple backdrop-blur-[10px] transition-all duration-300">
          <img src="https://ik.imagekit.io/lvxdbpx6l/APP%20FORENSICS/favicon.svg" alt="SHA256.US" className="w-11 h-11" />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-[28px] font-bold text-[#1D1D1F] dark:text-white tracking-[-0.03em] mb-0.5 transition-colors">SHA256.US</h1>
          <p className="text-[13px] text-[#6E6E73] dark:text-[#AEAEB2] font-medium tracking-[-0.01em] transition-colors">Sistema de Peritaje Forense Digital</p>
        </div>

        {/* Translucent Glass Card */}
        <div className="w-full bg-white/80 dark:bg-[#2C2C2E]/80 rounded-[20px] border border-black/[0.06] dark:border-white/[0.08] p-7 shadow-apple-elevated dark:shadow-apple-modal backdrop-blur-[30px] transition-all duration-300">

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2.5 p-3 rounded-[10px] bg-[#FF3B30]/[0.08] dark:bg-[#FF453A]/[0.08] border border-[#FF3B30]/15 dark:border-[#FF453A]/15 animate-apple-fadeIn">
                <AlertCircle size={15} className="shrink-0 text-[#FF3B30] dark:text-[#FF453A]" />
                <span className="text-[13px] text-[#BF2D24] dark:text-[#FF453A] font-medium">{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="login-username" className="block text-[11px] font-bold text-[#6E6E73] dark:text-[#AEAEB2] uppercase tracking-[0.05em]">Usuario</label>
              <input
                id="login-username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Nombre de usuario"
                className="apple-input transition-all placeholder:text-[#86868B]/40 dark:placeholder:text-[#AEAEB2]/30"
                autoFocus
                autoComplete="username"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="login-password" className="block text-[11px] font-bold text-[#6E6E73] dark:text-[#AEAEB2] uppercase tracking-[0.05em]">Contraseña</label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Contraseña"
                  className="apple-input pr-10 transition-all placeholder:text-[#86868B]/40 dark:placeholder:text-[#AEAEB2]/30"
                  autoComplete="current-password"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#86868B] dark:text-[#AEAEB2] hover:text-[#1D1D1F] dark:hover:text-white p-1 rounded-[6px] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-all"
                  title={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={isLoading || !username.trim() || !password.trim()}
              className="apple-btn apple-btn-primary w-full py-2.5 text-[14px] font-semibold disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_1px_2px_rgba(0,0,0,0.12)] transition-all active:scale-[0.98]"
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

          {/* Clean Flex Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-black/[0.08] dark:border-white/[0.08]" />
            <span className="px-3 text-[10px] font-bold text-[#86868B] dark:text-[#AEAEB2] tracking-wider uppercase">O</span>
            <div className="flex-1 border-t border-black/[0.08] dark:border-white/[0.08]" />
          </div>

          <button
            onClick={() => {
              const apiUrl = import.meta.env.VITE_API_URL || '/api/oauth/vercel';
              window.location.href = apiUrl;
            }}
            type="button"
            className="apple-btn w-full py-2.5 text-[13px] font-semibold bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] text-[#1D1D1F] dark:text-white hover:bg-black/[0.06] dark:hover:bg-white/[0.08] transition-all active:scale-[0.98]"
          >
            <svg viewBox="0 0 24 24" width={15} height={15} fill="currentColor" className="shrink-0 text-[#1D1D1F] dark:text-white">
              <path d="M12 2L22 21H2L12 2Z" />
            </svg>
            Iniciar sesión con Vercel
          </button>
        </div>

        <div className="mt-8 w-full text-center space-y-4">
          {/* Legal Warning Badge/Card */}
          <div className="p-3.5 rounded-[12px] bg-[#FF9500]/[0.03] dark:bg-[#FF9F0A]/[0.04] border border-[#FF9500]/12 dark:border-[#FF9F0A]/12 text-left flex items-start gap-2.5 max-w-[340px] mx-auto transition-all">
            <span className="text-[9px] font-bold text-[#FF9500] dark:text-[#FF9F0A] bg-[#FF9500]/10 dark:bg-[#FF9F0A]/10 px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 mt-0.5">
              AVISO LEGAL
            </span>
            <p className="text-[10px] text-[#6E6E73] dark:text-[#AEAEB2] leading-relaxed font-normal transition-colors">
              El acceso no autorizado será registrado y procesado penalmente conforme al <strong>Art. 187 del COPP</strong> y la <strong>Ley sobre Mensajes de Datos y Firmas Electrónicas</strong>.
            </p>
          </div>

          <div className="pt-2 flex flex-col items-center space-y-2">
            {/* Dots divider */}
            <div className="flex items-center justify-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-[#86868B]/40" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#0071E3]/70 dark:bg-[#0A84FF]/70" />
              <div className="w-1 h-1 rounded-full bg-[#86868B]/40" />
            </div>

            {/* Brand and Laboratorio */}
            <p className="text-[11px] font-semibold text-[#1D1D1F] dark:text-white tracking-tight transition-colors">
              SHA256.US v2.0 <span className="text-[#86868B] font-light">·</span> Laboratorio de Informática Forense
            </p>

            {/* Address */}
            <p className="text-[9.5px] text-[#86868B] dark:text-[#AEAEB2]/70 leading-relaxed max-w-[290px] font-medium opacity-80 transition-colors">
              Av. 6 con calle 7, Edif. Mercantil La Ceiba, Piso 1, Ofc. Nº 8.<br />
              Quíbor, Municipio Jiménez, Estado Lara.
            </p>

            {/* Powered by */}
            <p className="text-[8.5px] text-[#86868B] dark:text-[#AEAEB2]/50 font-semibold uppercase tracking-[0.15em] opacity-40 pt-1 transition-colors">
              powered by <span className="text-[#1D1D1F] dark:text-white font-bold transition-colors">jull</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
