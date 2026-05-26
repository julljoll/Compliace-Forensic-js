import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { ShieldCheck } from '../../components/atoms/AppleIcon';

export default function VercelCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { vercelLogin } = useAuthStore();
  const [status, setStatus] = useState<'verificando' | 'error'>('verificando');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const code = searchParams.get('code');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      setStatus('error');
      setErrorMsg('Autorización cancelada o denegada.');
      return;
    }

    if (!code) {
      setStatus('error');
      setErrorMsg('No se recibió el código de autorización.');
      return;
    }

    const apiUrl = import.meta.env.VITE_API_URL || '/api/oauth/vercel';

    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setStatus('error');
          setErrorMsg(data.error);
          return;
        }
        vercelLogin(data.user);
        navigate('/', { replace: true });
      })
      .catch(() => {
        setStatus('error');
        setErrorMsg('Error de conexión con el servidor de autenticación.');
      });
  }, [searchParams, navigate, vercelLogin]);

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-[380px] flex flex-col items-center apple-fade-in">
        <div className="w-20 h-20 rounded-full bg-white border border-[rgba(0,0,0,0.06)] flex items-center justify-center mb-6 shadow-sm">
          <ShieldCheck size={32} className="text-[#0071E3]" />
        </div>

        {status === 'verificando' ? (
          <>
            <div className="w-8 h-8 border-2 border-[#0071E3]/30 border-t-[#0071E3] rounded-full animate-spin mb-4" />
            <p className="text-[15px] font-semibold text-[#1D1D1F]">Verificando acceso con Vercel...</p>
            <p className="text-[13px] text-[#86868B] mt-1">Estableciendo sesión segura</p>
          </>
        ) : (
          <div className="text-center">
            <p className="text-[15px] font-semibold text-[#FF3B30] mb-2">Error de autenticación</p>
            <p className="text-[13px] text-[#86868B] mb-6">{errorMsg}</p>
            <button
              onClick={() => navigate('/login', { replace: true })}
              className="apple-btn apple-btn-primary text-[14px]"
            >
              Volver al inicio de sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
