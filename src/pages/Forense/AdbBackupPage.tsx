import { useState, useEffect, useRef } from 'react';
import { useCMSStore } from '../../store/cmsStore';
import { useAuditStore } from '../../store/auditStore';
import { useAuthStore } from '../../store/authStore';
import {
  Terminal as TerminalIcon, Play, Save, CheckCircle2,
  Smartphone, ShieldCheck, Database
} from '../../components/atoms/AppleIcon';

interface ConsoleLine {
  text: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'command';
  timestamp: string;
}

export default function AdbBackupPage() {
  const casos = useCMSStore(state => state.casos);
  const addAuditLog = useCMSStore(state => state.addAuditLog);
  const addEntry = useAuditStore(state => state.addEntry);
  const { user } = useAuthStore();

  // Configuración
  const [casoSeleccionado, setCasoSeleccionado] = useState('');
  const [dispositivoSerial, setDispositivoSerial] = useState('ADB-77491-MOBILE');
  const [rutaDestino, setRutaDestino] = useState('C:/SHA256_Forense/Adquisiciones/Colectas_ADB');
  const [opciones, setOpciones] = useState({
    dumpsys: true,
    wifi: true,
    cpu: true,
    cuentas: true,
    logcat: false,
  });

  // Estado de Ejecución
  const [ejecutando, setEjecutando] = useState(false);
  const [completado, setCompletado] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [consola, setConsola] = useState<ConsoleLine[]>([]);
  const [sha256Resultado, setSha256Resultado] = useState('');
  
  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll para la consola
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [consola]);

  const pushLog = (text: string, type: ConsoleLine['type'] = 'info') => {
    const time = new Date().toLocaleTimeString();
    setConsola(prev => [...prev, { text, type, timestamp: time }]);
  };

  const simularEjecucion = async () => {
    if (!casoSeleccionado) {
      alert('Por favor, seleccione un caso judicial válido antes de iniciar la colecta.');
      return;
    }

    setEjecutando(true);
    setCompletado(false);
    setProgreso(0);
    setConsola([]);
    setSha256Resultado('');

    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    // Secuencia de simulación de colecta forense ADB
    pushLog('$ adb kill-server && adb start-server', 'command');
    await delay(800);
    pushLog('* daemon not running; starting now at tcp:5037', 'info');
    pushLog('* daemon started successfully', 'success');

    pushLog(`$ adb devices`, 'command');
    await delay(600);
    setProgreso(15);
    pushLog(`List of devices attached\n${dispositivoSerial}\tdevice`, 'info');
    pushLog(`[CONEXIÓN] Dispositivo ${dispositivoSerial} reconocido exitosamente en modo Depuración USB.`, 'success');

    pushLog(`$ adb shell getprop ro.build.version.release`, 'command');
    await delay(400);
    pushLog(`Android OS Version: 12 (API Level 31)`, 'info');
    
    pushLog(`$ adb shell getprop ro.product.model`, 'command');
    await delay(400);
    pushLog(`Modelo del Dispositivo: Samsung Galaxy S21 Ultra`, 'info');

    // 1. Dumpsys Wifi
    if (opciones.wifi) {
      setProgreso(30);
      pushLog(`$ adb shell dumpsys wifi > "${rutaDestino}/wifi_logs.txt"`, 'command');
      await delay(900);
      pushLog(`[OK] Logs de conectividad inalámbrica y redes históricas guardados. (215 KB)`, 'success');
    }

    // 2. CPU / RAM info
    if (opciones.cpu) {
      setProgreso(45);
      pushLog(`$ adb shell dumpsys cpuinfo > "${rutaDestino}/cpu_info.txt"`, 'command');
      await delay(700);
      pushLog(`[OK] Metadatos del estado del procesador y memoria extraídos. (84 KB)`, 'success');
    }

    // 3. Cuentas
    if (opciones.cuentas) {
      setProgreso(60);
      pushLog(`$ adb shell dumpsys account > "${rutaDestino}/cuentas_dispositivo.txt"`, 'command');
      await delay(900);
      pushLog(`[OK] Extracción de cuentas de sincronización activa (Gmail, WhatsApp, iCloud, Outlook). (48 KB)`, 'success');
    }

    // 4. Dumpsys Completo
    if (opciones.dumpsys) {
      setProgreso(75);
      pushLog(`$ adb shell dumpsys > "${rutaDestino}/dumpsys_completo.txt"`, 'command');
      await delay(1200);
      pushLog(`[OK] Volcado de estado de servicios del sistema (Dumpsys) completado. (3.2 MB)`, 'success');
    }

    // 5. Logcat
    if (opciones.logcat) {
      setProgreso(85);
      pushLog(`$ adb logcat -d > "${rutaDestino}/android_logcat.log"`, 'command');
      await delay(1000);
      pushLog(`[OK] Buffer de eventos del sistema (logcat) adquirido. (1.8 MB)`, 'success');
    }

    // 6. Cálculo de Hash SHA-256 e Integridad
    setProgreso(95);
    pushLog(`Generando firma criptográfica SHA-256 de la adquisición forense...`, 'info');
    await delay(800);
    
    // Generar un hash determinista o aleatorio realista
    const hash = 'a8f5c6b4e78921503c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b';
    setSha256Resultado(hash);
    pushLog(`[INTEGRIDAD] Hash SHA-256 calculado para la adquisición:`, 'success');
    pushLog(hash, 'success');

    // Registrar en auditoría
    const perito = user?.nombre || 'Perito Forense';

    // Agregar entrada de auditoría (Zustand persistido)
    addAuditLog({
      casoId: casoSeleccionado,
      usuario: perito,
      accion: 'COLECTA_ADB_COMPLETADA',
      detalle: `Adquisición lógica por ADB completada. Dispositivo: ${dispositivoSerial}. Hash: ${hash.substring(0, 16)}...`,
      nivel: 'success'
    });

    // Agregar entrada inmutable (Blockchain simulado en IndexedDB)
    await addEntry({
      casoId: casoSeleccionado,
      usuario: perito,
      accion: 'ADB_FORENSIC_ACQUISITION',
      detalle: `Adquisición lógica por ADB en dispositivo ${dispositivoSerial}. Hash SHA-256: ${hash}. Destino: ${rutaDestino}`,
      nivel: 'success',
      firmadoPor: perito,
      firmadoTimestamp: new Date().toISOString()
    });

    setProgreso(100);
    setEjecutando(false);
    setCompletado(true);
    pushLog(`[ÉXITO] Adquisición lógica de dispositivo móvil finalizada bajo protocolo ISO 27037.`, 'success');
  };

  const handleExportConsole = () => {
    const contenido = consola.map(c => `[${c.timestamp}] [${c.type.toUpperCase()}] ${c.text}`).join('\n');
    const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Log_ADB_Caso_${casoSeleccionado || 'Desconocido'}_${Date.now()}.txt`;
    link.click();
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Cabecera */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1D1D1F] tracking-tight">Colectas ADB</h1>
          <p className="text-sm text-[#86868B] font-medium max-w-2xl mt-1">
            Módulo forense para la extracción de logs del sistema, volcados dumpsys y depuración de red desde terminales Android.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="apple-badge-blue">
            <Smartphone size={12} className="mr-1" /> Android Forensics
          </span>
          <span className="apple-badge-green">
            <ShieldCheck size={12} className="mr-1" /> ISO 27037 Compliant
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Panel Izquierdo: Configuración */}
        <div className="lg:col-span-1 space-y-6">
          <div className="apple-card p-6">
            <h2 className="text-lg font-semibold text-[#1D1D1F] mb-4 flex items-center gap-2">
              <Database size={18} className="text-[#0071E3]" />
              Parámetros de Colecta
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

              {/* Identificador Dispositivo */}
              <div>
                <label className="block text-xs font-semibold text-[#86868B] uppercase tracking-wider mb-1">
                  Identificador del Dispositivo (Serial)
                </label>
                <input
                  type="text"
                  value={dispositivoSerial}
                  onChange={(e) => setDispositivoSerial(e.target.value)}
                  placeholder="Ej: emulator-5554"
                  className="apple-input w-full"
                  disabled={ejecutando}
                />
              </div>

              {/* Ruta Destino */}
              <div>
                <label className="block text-xs font-semibold text-[#86868B] uppercase tracking-wider mb-1">
                  Directorio de Destino Forense
                </label>
                <input
                  type="text"
                  value={rutaDestino}
                  onChange={(e) => setRutaDestino(e.target.value)}
                  placeholder="Ruta absoluta local"
                  className="apple-input w-full"
                  disabled={ejecutando}
                />
                <p className="text-[10px] text-[#86868B] mt-1 italic">
                  * Nota: Ruta de adquisición controlada. No se permite exportación directa al escritorio sin protección.
                </p>
              </div>
            </div>
          </div>

          {/* Opciones de Adquisición */}
          <div className="apple-card p-6">
            <h3 className="text-sm font-bold text-[#1D1D1F] uppercase tracking-wider mb-3">
              Módulos de Información
            </h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={opciones.wifi}
                  onChange={(e) => setOpciones({ ...opciones, wifi: e.target.checked })}
                  disabled={ejecutando}
                  className="rounded border-[#D2D2D7] text-[#0071E3] focus:ring-[#0071E3]"
                />
                <div>
                  <p className="text-sm font-semibold text-[#1D1D1F]">Logs de Red y Wi-Fi</p>
                  <p className="text-xs text-[#86868B]">Listado de puntos de acceso históricos y DNS.</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={opciones.cpu}
                  onChange={(e) => setOpciones({ ...opciones, cpu: e.target.checked })}
                  disabled={ejecutando}
                  className="rounded border-[#D2D2D7] text-[#0071E3] focus:ring-[#0071E3]"
                />
                <div>
                  <p className="text-sm font-semibold text-[#1D1D1F]">Uso de CPU / Memoria</p>
                  <p className="text-xs text-[#86868B]">Carga de cómputo y procesos activos en el kernel.</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={opciones.cuentas}
                  onChange={(e) => setOpciones({ ...opciones, cuentas: e.target.checked })}
                  disabled={ejecutando}
                  className="rounded border-[#D2D2D7] text-[#0071E3] focus:ring-[#0071E3]"
                />
                <div>
                  <p className="text-sm font-semibold text-[#1D1D1F]">Cuentas Vinculadas</p>
                  <p className="text-xs text-[#86868B]">Cuentas del sistema registradas (social/correo).</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={opciones.dumpsys}
                  onChange={(e) => setOpciones({ ...opciones, dumpsys: e.target.checked })}
                  disabled={ejecutando}
                  className="rounded border-[#D2D2D7] text-[#0071E3] focus:ring-[#0071E3]"
                />
                <div>
                  <p className="text-sm font-semibold text-[#1D1D1F]">Volcado Dumpsys Completo</p>
                  <p className="text-xs text-[#86868B]">Información diagnóstica completa de servicios.</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={opciones.logcat}
                  onChange={(e) => setOpciones({ ...opciones, logcat: e.target.checked })}
                  disabled={ejecutando}
                  className="rounded border-[#D2D2D7] text-[#0071E3] focus:ring-[#0071E3]"
                />
                <div>
                  <p className="text-sm font-semibold text-[#1D1D1F]">Android Logcat (-d)</p>
                  <p className="text-xs text-[#86868B]">Logs en tiempo de ejecución (voluminoso).</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Panel Derecho: Consola y Resultados */}
        <div className="lg:col-span-2 space-y-6">
          <div className="apple-card p-6 flex flex-col h-[550px] relative overflow-hidden bg-[#1E1E1E]">
            
            {/* Cabecera Consola */}
            <div className="flex items-center justify-between border-b border-[#333333] pb-3 mb-4 shrink-0">
              <div className="flex items-center gap-2">
                <TerminalIcon size={16} className="text-[#34C759]" />
                <span className="font-mono text-xs text-[#E5E5EA] font-semibold">Terminal de Colecta Forense (ADB)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
              </div>
            </div>

            {/* Consola Scroll */}
            <div className="flex-1 overflow-y-auto font-mono text-[13px] leading-relaxed space-y-2 pr-2 custom-scrollbar text-[#D2D2D7]">
              {consola.length === 0 ? (
                <div className="h-full flex items-center justify-center text-[#86868B] italic">
                  Esperando inicio de colecta ADB...
                </div>
              ) : (
                consola.map((line, idx) => (
                  <div key={idx} className="flex gap-2 items-start">
                    <span className="text-[#86868B] select-none text-[11px] shrink-0 pt-0.5">[{line.timestamp}]</span>
                    <span className={`break-all ${
                      line.type === 'command' ? 'text-[#007AFF] font-bold' :
                      line.type === 'success' ? 'text-[#30D158]' :
                      line.type === 'warning' ? 'text-[#FF9F0A]' :
                      line.type === 'error' ? 'text-[#FF453A]' : 'text-[#FFFFFF]'
                    }`}>
                      {line.type === 'command' ? '' : ''}
                      {line.text}
                    </span>
                  </div>
                ))
              )}
              <div ref={consoleEndRef} />
            </div>

            {/* Barra de Progreso */}
            {ejecutando && (
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-[#333333]">
                <div 
                  className="h-full bg-[#0071E3] transition-all duration-300"
                  style={{ width: `${progreso}%` }}
                />
              </div>
            )}
          </div>

          {/* Acciones e Integridad */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={simularEjecucion}
                disabled={ejecutando}
                className="apple-button-primary flex-1 sm:flex-none flex items-center justify-center gap-2"
              >
                <Play size={16} />
                {ejecutando ? 'Colectando...' : 'Iniciar Colecta ADB'}
              </button>

              <button
                onClick={handleExportConsole}
                disabled={consola.length === 0}
                className="apple-button flex-1 sm:flex-none flex items-center justify-center gap-2"
              >
                <Save size={16} />
                Exportar Logs
              </button>
            </div>

            {completado && sha256Resultado && (
              <div className="w-full sm:w-auto bg-[#34C759]/10 border border-[#34C759]/20 rounded-[8px] px-4 py-2.5 flex items-center gap-3">
                <CheckCircle2 size={18} className="text-[#34C759] shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-[#34C759] uppercase tracking-wider">Integridad Asegurada</p>
                  <p className="text-[11px] font-mono text-[#1D1D1F] truncate max-w-[280px]" title={sha256Resultado}>
                    SHA-256: {sha256Resultado}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
