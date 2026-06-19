import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { ShieldCheck, Eye, EyeOff, AlertCircle } from '../components/atoms/AppleIcon';
import Button from '../components/atoms/Button';
import Input from '../components/atoms/Input';

export default function LoginPage() {
  const { login, isFirstLogin, changePassword, logout, isLoading, error, clearError } = useAuthStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  // Estados para cambio obligatorio de contraseña (BUG-021)
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changeError, setChangeError] = useState<string | null>(null);
  const [changeSuccess, setChangeSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (!username.trim() || !password.trim()) return;
    await login(username.trim(), password);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangeError(null);
    if (newPassword.length < 4) {
      setChangeError('La contraseña debe tener al menos 4 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setChangeError('Las contraseñas no coinciden.');
      return;
    }
    const res = await changePassword(newPassword);
    if (res.success) {
      setChangeSuccess(true);
      setTimeout(() => {
        // Forzar recarga o redirección tras guardar la clave
        window.location.reload();
      }, 1500);
    } else {
      setChangeError(res.error || 'Error al cambiar la contraseña.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans overflow-hidden selection:bg-[rgba(0,113,227,0.25)] relative bg-[var(--apple-bg)]">
      {/* macOS Lock Screen subtle radial gradient backdrop (adaptive theme) */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{
          background: 'var(--login-bg)'
        }}
      />

      <div className="relative w-full max-w-[380px] flex flex-col items-center apple-fade-in z-10">
        {/* Apple Style Floating Logo Container */}
        <div className="w-20 h-20 rounded-full bg-white/70 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center mb-6 shadow-[var(--co-shadow-2)] backdrop-blur-[10px] transition-all duration-300">
          <img src="https://ik.imagekit.io/lvxdbpx6l/APP%20FORENSICS/favicon.svg" alt="SHA256.US" className="w-11 h-11" />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-[28px] font-bold text-[var(--apple-text)] tracking-[-0.03em] mb-0.5">SHA256.US</h1>
          <p className="text-[13px] text-[var(--co-gray-1)] font-medium tracking-[-0.01em]">Sistema de Peritaje Forense Digital</p>
        </div>

        {/* Translucent Glass Card */}
        <div className="w-full bg-white/70 dark:bg-white/5 rounded-[20px] border border-[var(--co-separator)] dark:border-white/10 p-7 shadow-[var(--co-shadow-modal)] backdrop-blur-[30px] transition-all duration-300">
          {isFirstLogin ? (
            <form onSubmit={handleChangePassword} className="space-y-5">
              <div className="text-center mb-4">
                <p className="text-[14px] text-[var(--co-orange)] font-semibold uppercase tracking-wider">Cambio de Clave Obligatorio</p>
                <p className="text-[11px] text-[var(--co-gray-1)] mt-1.5 leading-relaxed">
                  Por motivos de seguridad forense, debe reemplazar las credenciales por defecto (admin/admin) para continuar.
                </p>
              </div>

              {changeError && (
                <div className="flex items-center gap-2.5 p-3 rounded-[10px] bg-[#FF453A]/[0.08] border border-[#FF453A]/15 animate-apple-fadeIn">
                  <AlertCircle size={15} className="shrink-0 text-[var(--co-red)]" />
                  <span className="text-[13px] text-[var(--co-red)] font-medium">{changeError}</span>
                </div>
              )}

              {changeSuccess && (
                <div className="flex items-center gap-2.5 p-3 rounded-[10px] bg-[#30D158]/[0.08] border border-[#30D158]/15 animate-apple-fadeIn">
                  <span className="text-[13px] text-[var(--co-green)] font-medium">Contraseña actualizada. Redirigiendo...</span>
                </div>
              )}

              <Input
                id="new-password"
                type="password"
                label="Nueva Contraseña"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Mínimo 4 caracteres"
                className="bg-white/60 dark:bg-white/5 border-[var(--co-separator)] dark:border-white/10 text-[var(--apple-text)] focus:border-[var(--co-accent)]"
              />

              <Input
                id="confirm-password"
                type="password"
                label="Confirmar Contraseña"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirme la contraseña"
                className="bg-white/60 dark:bg-white/5 border-[var(--co-separator)] dark:border-white/10 text-[var(--apple-text)] focus:border-[var(--co-accent)]"
              />

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={logout}
                  className="w-1/3 text-[var(--apple-text)]/70 dark:text-white/70"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="w-2/3"
                  disabled={isLoading || !newPassword || !confirmPassword || changeSuccess}
                >
                  Guardar
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="flex items-center gap-2.5 p-3 rounded-[10px] bg-[#FF453A]/[0.08] border border-[#FF453A]/15 animate-apple-fadeIn">
                  <AlertCircle size={15} className="shrink-0 text-[var(--co-red)]" />
                  <span className="text-[13px] text-[var(--co-red)] font-medium">{error}</span>
                </div>
              )}

              <Input
                id="login-username"
                label="Usuario"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Nombre de usuario"
                autoComplete="username"
                autoFocus
                className="bg-white/60 dark:bg-white/5 border-[var(--co-separator)] dark:border-white/10 focus:border-[var(--co-accent)] text-[var(--apple-text)] focus:ring-[var(--co-accent)]/20"
              />

              <div className="space-y-1.5 flex flex-col items-start w-full">
                <label htmlFor="login-password" className="block text-[11px] font-bold text-[var(--co-gray-1)] uppercase tracking-[0.05em] select-none">
                  Contraseña
                </label>
                <div className="relative w-full">
                  <input
                    id="login-password"
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Contraseña"
                    className="w-full text-[15px] bg-white/60 dark:bg-white/5 border border-[var(--co-separator)] dark:border-white/10 rounded-[10px] px-3.5 py-2.5 pr-10 outline-none transition-all duration-200 placeholder-[var(--co-gray-2)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] focus:border-[var(--co-accent)] focus:ring-[3px] focus:ring-[var(--co-accent)]/20 text-[var(--apple-text)]"
                    autoComplete="current-password"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--co-gray-1)] hover:text-[var(--apple-text)] dark:hover:text-white p-1 rounded-[6px] hover:bg-black/5 dark:hover:bg-white/10 transition-all"
                    title={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <Button
                id="login-submit"
                type="submit"
                variant="primary"
                size="lg"
                disabled={isLoading || !username.trim() || !password.trim()}
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
          )}

          {/* Clean Flex Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-[var(--co-separator)] dark:border-white/10" />
            <span className="px-3 text-[10px] font-bold text-[var(--co-gray-1)] tracking-wider uppercase">O</span>
            <div className="flex-1 border-t border-[var(--co-separator)] dark:border-white/10" />
          </div>

          <button
            onClick={() => {
              const apiUrl = import.meta.env.VITE_API_URL || '/api/oauth/vercel';
              window.location.href = apiUrl;
            }}
            type="button"
            className="apple-btn w-full py-2.5 text-[13px] font-semibold bg-white/60 dark:bg-white/5 border border-[var(--co-separator)] dark:border-white/10 text-[var(--apple-text)] hover:bg-white/90 dark:hover:bg-white/10 transition-all active:scale-[0.98]"
          >
            <svg viewBox="0 0 24 24" width={15} height={15} fill="currentColor" className="shrink-0 text-[var(--apple-text)] dark:text-white mr-2">
              <path d="M12 2L22 21H2L12 2Z" />
            </svg>
            Iniciar sesión con Vercel
          </button>
        </div>

        <div className="mt-8 w-full text-center space-y-4">
          {/* Legal Warning Badge/Card */}
          <div className="p-3.5 rounded-[12px] bg-[var(--co-orange)]/5 border border-[var(--co-orange)]/15 text-left flex items-start gap-2.5 max-w-[340px] mx-auto transition-all">
            <span className="text-[9px] font-bold text-[var(--co-orange)] bg-[var(--co-orange)]/10 px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 mt-0.5">
              AVISO LEGAL
            </span>
            <p className="text-[10px] text-[var(--co-gray-1)] leading-relaxed font-normal">
              El acceso no autorizado será registrado y procesado penalmente conforme al <strong>Art. 187 del COPP</strong> y la <strong>Ley sobre Mensajes de Datos y Firmas Electrónicas</strong>.
            </p>
          </div>

          <div className="pt-2 flex flex-col items-center space-y-2">
            {/* Dots divider */}
            <div className="flex items-center justify-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-black/20 dark:bg-white/20" />
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--co-accent)]" />
              <div className="w-1 h-1 rounded-full bg-black/20 dark:bg-white/20" />
            </div>

            {/* Brand and Laboratorio */}
            <p className="text-[11px] font-semibold text-[var(--apple-text)]/90 dark:text-white/90 tracking-tight">
              SHA256.US v2.0 <span className="text-[var(--apple-text)]/45 dark:text-white/45 font-light">·</span> Laboratorio de Informática Forense
            </p>

            {/* Address */}
            <p className="text-[9.5px] text-[var(--co-gray-1)] leading-relaxed max-w-[290px] font-medium opacity-80">
              Av. 6 con calle 7, Edif. Mercantil La Ceiba, Piso 1, Ofc. Nº 8.<br />
              Quíbor, Municipio Jiménez, Estado Lara.
            </p>

            {/* Powered by */}
            <p className="text-[8.5px] text-[var(--apple-text)]/30 dark:text-white/30 font-semibold uppercase tracking-[0.15em] pt-1">
              powered by <span className="text-[var(--apple-text)] dark:text-white font-bold">jull</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
