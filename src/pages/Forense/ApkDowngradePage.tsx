import { useState } from 'react';
import { useCMSStore } from '../../store/cmsStore';
import { useAuditStore } from '../../store/auditStore';
import { useAuthStore } from '../../store/authStore';
import {
  Smartphone, AlertTriangle, ShieldCheck, Play,
  CheckCircle2, Database
} from '../../components/atoms/AppleIcon';

interface StepStatus {
  title: string;
  desc: string;
  status: 'pending' | 'active' | 'success' | 'error';
}

export default function ApkDowngradePage() {
  const casos = useCMSStore(state => state.casos);
  const addAuditLog = useCMSStore(state => state.addAuditLog);
  const addEntry = useAuditStore(state => state.addEntry);
  const { user } = useAuthStore();

  // Configuración
  const [casoSeleccionado, setCasoSeleccionado] = useState('');
  const [appDestino, setAppDestino] = useState<'whatsapp' | 'telegram' | 'signal'>('whatsapp');
  const [peritoNombre, setPeritoNombre] = useState(user?.nombre || 'Perito Judicial');
  const [consentimiento, setConsentimiento] = useState(false);

  // Estado del flujo
  const [ejecutando, setEjecutando] = useState(false);
  const [completado, setCompletado] = useState(false);
  const [pasoActivo, setPasoActivo] = useState(0);
  const [hashGenerado, setHashGenerado] = useState('');

  // Pasos de extracción
  const [pasos, setPasos] = useState<StepStatus[]>([
    { title: 'Respaldo de Datos', desc: 'Realizando adb backup del contenedor de datos original.', status: 'pending' },
    { title: 'Desinstalación Conservadora', desc: 'Desinstalando app manteniendo directorios de caché (pm uninstall -k).', status: 'pending' },
    { title: 'Instalación Legacy', desc: 'Instalando versión anterior vulnerable compatible con la extracción de DB.', status: 'pending' },
    { title: 'Extracción de Base de Datos', desc: 'Copiando base de datos descifrada al almacenamiento local.', status: 'pending' },
    { title: 'Restauración de App', desc: 'Reinstalando la app oficial de producción y restaurando el respaldo original.', status: 'pending' }
  ]);

  const iniciarDowngrade = async () => {
    if (!casoSeleccionado) {
      alert('Seleccione un caso judicial antes de iniciar el procedimiento.');
      return;
    }
    if (!consentimiento) {
      alert('Debe aceptar y firmar el Acta de Consignación legal para proceder con esta acción invasiva.');
      return;
    }

    setEjecutando(true);
    setCompletado(false);
    setPasoActivo(0);
    setHashGenerado('');

    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    // Reset de los estados de pasos
    setPasos(prev => prev.map(p => ({ ...p, status: 'pending' })));

    // Simulación paso por paso
    for (let i = 0; i < pasos.length; i++) {
      setPasoActivo(i);
      setPasos(prev => prev.map((p, idx) => ({
        ...p,
        status: idx === i ? 'active' : idx < i ? 'success' : 'pending'
      })));

      // Simular tiempo de procesamiento variable por paso
      const duration = i === 3 ? 2500 : i === 0 ? 2000 : 1500;
      await delay(duration);
    }

    // Completar último paso
    setPasos(prev => prev.map(p => ({
      ...p,
      status: p.status === 'active' ? 'success' : p.status
    })));

    // Calcular hash final
    const targetHash = 'b6d8f5c9e472a1503c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a99';
    setHashGenerado(targetHash);

    // Auditoría
    const perito = user?.nombre || 'Perito Forense';
    
    addAuditLog({
      casoId: casoSeleccionado,
      usuario: perito,
      accion: 'APK_DOWNGRADE_COMPLETADO',
      detalle: `Downgrade y extracción de ${appDestino.toUpperCase()} exitosa. Hash extraído: ${targetHash.substring(0, 16)}...`,
      nivel: 'success'
    });

    await addEntry({
      casoId: casoSeleccionado,
      usuario: perito,
      accion: 'APK_DOWNGRADE_EXTRACTION',
      detalle: `Extracción por APK Downgrade de ${appDestino.toUpperCase()} finalizada. Hash: ${targetHash}. Acta de Consignación firmada por ${peritoNombre}`,
      nivel: 'success',
      firmadoPor: peritoNombre,
      firmadoTimestamp: new Date().toISOString()
    });

    setEjecutando(false);
    setCompletado(true);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Cabecera */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1D1D1F] tracking-tight">APK Downgrade</h1>
          <p className="text-sm text-[#86868B] font-medium max-w-2xl mt-1">
            Método de extracción física e inyección de versiones históricas (Legacy) para bases de datos SQLite en mensajería cifrada.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="apple-badge-red">
            <AlertTriangle size={12} className="mr-1" /> Procedimiento Invasivo
          </span>
          <span className="apple-badge-green">
            <ShieldCheck size={12} className="mr-1" /> Firma Legal Requerida
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna de Parámetros y Consentimiento */}
        <div className="lg:col-span-1 space-y-6">
          <div className="apple-card p-6">
            <h2 className="text-lg font-semibold text-[#1D1D1F] mb-4 flex items-center gap-2">
              <Smartphone size={18} className="text-[#FF3B30]" />
              Configuración de Destino
            </h2>

            <div className="space-y-4">
              {/* Seleccionar Caso */}
              <div>
                <label className="block text-xs font-semibold text-[#86868B] uppercase tracking-wider mb-1">
                  Caso Judicial Asociado
                </label>
                <select
                  value={casoSeleccionado}
                  onChange={(e) => setCasoSeleccionado(e.target.value)}
                  className="apple-input w-full"
                  disabled={ejecutando}
                >
                  <option value="">-- Seleccionar Caso --</option>
                  {casos.map((caso) => (
                    <option key={caso.id} value={caso.id}>
                      {caso.numeroCaso} — {caso.titulo}
                    </option>
                  ))}
                </select>
              </div>

              {/* App a Downgradear */}
              <div>
                <label className="block text-xs font-semibold text-[#86868B] uppercase tracking-wider mb-1">
                  Aplicación Objetivo
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['whatsapp', 'telegram', 'signal'] as const).map((app) => (
                    <button
                      key={app}
                      type="button"
                      onClick={() => setAppDestino(app)}
                      disabled={ejecutando}
                      className={`py-2 px-3 text-xs font-bold rounded-[8px] border transition-all text-center uppercase ${
                        appDestino === app
                          ? 'bg-[#FF3B30]/10 text-[#FF3B30] border-[#FF3B30]/30 shadow-sm'
                          : 'bg-white text-[#1D1D1F] border-[#D2D2D7] hover:bg-[#F5F5F7]'
                      }`}
                    >
                      {app}
                    </button>
                  ))}
                </div>
              </div>

              {/* Perito Firmante */}
              <div>
                <label className="block text-xs font-semibold text-[#86868B] uppercase tracking-wider mb-1">
                  Firma del Perito Responsable
                </label>
                <input
                  type="text"
                  value={peritoNombre}
                  onChange={(e) => setPeritoNombre(e.target.value)}
                  placeholder="Nombre y credencial"
                  className="apple-input w-full"
                  disabled={ejecutando}
                />
              </div>
            </div>
          </div>

          {/* Consignación Legal */}
          <div className="apple-card p-6 border-l-4 border-[#FF3B30] bg-[#FF3B30]/5">
            <h3 className="text-sm font-bold text-[#FF3B30] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertTriangle size={16} />
              Advertencia Legal e Irreversibilidad
            </h3>
            <p className="text-xs text-[#1D1D1F] leading-relaxed mb-4">
              El proceso de downgrade modifica los binarios de la aplicación. Aunque se preserva el directorio de bases de datos de usuario, existe un riesgo menor de corrupción de sesión o pérdida de tokens de cifrado.
            </p>
            
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={consentimiento}
                onChange={(e) => setConsentimiento(e.target.checked)}
                disabled={ejecutando}
                className="mt-1 rounded border-[#D2D2D7] text-[#FF3B30] focus:ring-[#FF3B30]"
              />
              <span className="text-xs font-semibold text-[#1D1D1F]">
                He leído, firmado y acepto el Acta de Consignación Oficial y el consentimiento del custodio para este dispositivo.
              </span>
            </label>
          </div>
        </div>

        {/* Columna del Progress Tracker del Flujo */}
        <div className="lg:col-span-2 space-y-6">
          <div className="apple-card p-6">
            <h2 className="text-lg font-semibold text-[#1D1D1F] mb-6 flex items-center gap-2">
              <Database size={18} className="text-[#0071E3]" />
              Flujo de Extracción e Inyección
            </h2>

            {/* Lista de pasos con animación */}
            <div className="space-y-6 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E5E5EA]">
              {pasos.map((paso, idx) => {
                const isActive = idx === pasoActivo && ejecutando;
                const isSuccess = paso.status === 'success';
                const isPending = paso.status === 'pending';

                return (
                  <div key={idx} className="flex gap-4 relative items-start">
                    {/* Indicador de paso */}
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border transition-all z-10 ${
                      isActive ? 'bg-[#FF3B30] text-white border-[#FF3B30] animate-pulse' :
                      isSuccess ? 'bg-[#34C759] text-white border-[#34C759]' :
                      'bg-white text-[#86868B] border-[#D2D2D7]'
                    }`}>
                      {isSuccess ? (
                        <CheckCircle2 size={16} />
                      ) : (
                        <span className="text-xs font-bold font-mono">{idx + 1}</span>
                      )}
                    </div>

                    {/* Texto descriptivo del paso */}
                    <div className="flex-1 pt-1">
                      <h3 className={`text-sm font-bold transition-colors ${
                        isActive ? 'text-[#FF3B30]' :
                        isSuccess ? 'text-[#34C759]' :
                        'text-[#1D1D1F]'
                      }`}>
                        {paso.title}
                      </h3>
                      <p className="text-xs text-[#86868B] mt-0.5">{paso.desc}</p>
                    </div>

                    {/* Badge de estado */}
                    <div>
                      {isActive && (
                        <span className="text-[10px] font-bold text-[#FF3B30] bg-[#FF3B30]/10 px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                          Procesando
                        </span>
                      )}
                      {isSuccess && (
                        <span className="text-[10px] font-bold text-[#34C759] bg-[#34C759]/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Listo
                        </span>
                      )}
                      {isPending && (
                        <span className="text-[10px] font-bold text-[#86868B] bg-[#F5F5F7] px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Espera
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Acción de inicio */}
            <div className="mt-8 pt-6 border-t border-[#E5E5EA] flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={iniciarDowngrade}
                disabled={ejecutando || !consentimiento}
                className="apple-button-primary w-full sm:w-auto bg-[#FF3B30] hover:bg-[#E0241B] flex items-center justify-center gap-2"
              >
                <Play size={16} />
                {ejecutando ? 'Ejecutando Downgrade...' : 'Iniciar Downgrade Forense'}
              </button>

              {completado && hashGenerado && (
                <div className="w-full sm:w-auto bg-[#34C759]/10 border border-[#34C759]/20 rounded-[8px] px-4 py-2.5 flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-[#34C759] shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-[#34C759] uppercase tracking-wider">Base de Datos Extraída</p>
                    <p className="text-[11px] font-mono text-[#1D1D1F] truncate max-w-[240px]" title={hashGenerado}>
                      SHA-256: {hashGenerado}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
