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
        </div>

        <div className="mt-7 text-center space-y-2.5">
          <p className="text-[11px] text-[#86868B] leading-relaxed max-w-xs mx-auto font-normal">
            El acceso no autorizado será registrado conforme al Art. 187 COPP y la Ley de Mensajes de Datos y Firmas Electrónicas.
          </p>
          <div className="flex items-center justify-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#0071E3]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[rgba(0,0,0,0.1)]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[rgba(0,0,0,0.1)]" />
          </div>
          <p className="text-[11px] text-[#86868B] font-medium tracking-[-0.01em] opacity-50">
            SHA256.US v2.0 · Laboratorio de Informática Forense
          </p>
        </div>
      </div>
    </div>
  );
}
