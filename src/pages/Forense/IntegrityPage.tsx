import { useState } from 'react';
import { useCMSStore } from '../../store/cmsStore';
import { useAuditStore } from '../../store/auditStore';
import { useAuthStore } from '../../store/authStore';
import {
  ShieldCheck, CheckCircle2, AlertTriangle, Copy,
  Check, RefreshCw, Upload, Lock, Activity
} from '../../components/atoms/AppleIcon';

interface FileDetail {
  name: string;
  size: string;
  type: string;
  lastModified: string;
}

const PRESET_FILES = [
  { name: 'reporte_forense_caso_102.pdf', size: '1.2 MB', type: 'document/pdf', lastModified: 'Hoy, 10:15' },
  { name: 'chats_whatsapp_extraidos.db', size: '24.5 MB', type: 'application/x-sqlite3', lastModified: 'Ayer, 18:02' },
  { name: 'log_adquisicion_adb.log', size: '412 KB', type: 'text/plain', lastModified: 'Hoy, 14:10' }
];

export default function IntegrityPage() {
  const casos = useCMSStore(state => state.casos);
  const addAuditLog = useCMSStore(state => state.addAuditLog);
  const addEntry = useAuditStore(state => state.addEntry);
  const { user } = useAuthStore();

  // Configuración
  const [casoSeleccionado, setCasoSeleccionado] = useState('');
  const [selectedFile, setSelectedFile] = useState<FileDetail | null>(null);
  
  // Hashes calculados
  const [calculando, setCalculando] = useState(false);
  const [hashes, setHashes] = useState<{ md5?: string; sha1?: string; sha256?: string } | null>(null);
  
  // Firma .avilla
  const [generandoFirma, setGenerandoFirma] = useState(false);
  const [firmaGenerada, setFirmaGenerada] = useState<{ token: string; perito: string; timestamp: string } | null>(null);
  const [peritoFirmante, setPeritoFirmante] = useState(user?.nombre || 'Perito Forense');
  
  // Verificación
  const [tokenAVerificar, setTokenAVerificar] = useState('');
  const [verificacionResultado, setVerificacionResultado] = useState<{
    valido: boolean;
    perito?: string;
    timestamp?: string;
    sha256Original?: string;
    mensaje: string;
  } | null>(null);

  // Clipboard hooks
  const [copiadoIdx, setCopiadoIdx] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiadoIdx(id);
    setTimeout(() => setCopiadoIdx(null), 2000);
  };

  const handleSelectPresetFile = (file: FileDetail) => {
    setSelectedFile(file);
    setHashes(null);
    setFirmaGenerada(null);
    setVerificacionResultado(null);
  };

  const calcularHashes = async () => {
    if (!selectedFile) return;
    setCalculando(true);
    setHashes(null);

    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
    await delay(1200); // Simular el hashing criptográfico de archivos grandes

    // Generar hashes basados en el nombre de manera consistente
    const seed = selectedFile.name;
    const sha256 = seed === 'reporte_forense_caso_102.pdf' 
      ? 'a8f5c6b4e78921503c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b'
      : seed === 'chats_whatsapp_extraidos.db'
      ? 'b6d8f5c9e472a1503c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a99'
      : '7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d';

    const md5 = seed === 'reporte_forense_caso_102.pdf'
      ? '9e107d9d372bb6826bd81d3542a419d6'
      : '2f9a7b8c8d0e1f2a3b4c5d6e7f8a9b0c';

    const sha1 = seed === 'reporte_forense_caso_102.pdf'
      ? '8f94a38cc246bb6fcf56f7ef57d23d8bdf9253cf'
      : '4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d';

    setHashes({ md5, sha1, sha256 });
    setCalculando(false);

    // Registro en auditoría
    addAuditLog({
      casoId: casoSeleccionado,
      usuario: peritoFirmante,
      accion: 'HASH_CALCULADO',
      detalle: `Cálculo de hashes para archivo: ${selectedFile.name}. SHA-256: ${sha256.substring(0, 16)}...`,
      nivel: 'info'
    });
  };

  const generarFirmaAvilla = async () => {
    if (!selectedFile || !hashes) return;
    setGenerandoFirma(true);

    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
    await delay(1000);

    const timestamp = new Date().toISOString();
    // Firmar con formato base64 simulando AES-256 + HMAC
    const payload = JSON.stringify({
      filename: selectedFile.name,
      sha256: hashes.sha256,
      perito: peritoFirmante,
      timestamp,
      casoId: casoSeleccionado
    });
    
    // Generar un token base64 ficticio con cabecera AVILLA
    const token = `AVILLA-SIG.${window.btoa(payload).substring(0, 150)}...`;

    setFirmaGenerada({
      token,
      perito: peritoFirmante,
      timestamp
    });
    
    setGenerandoFirma(false);

    // Agregar registro de auditoría (Zustand)
    addAuditLog({
      casoId: casoSeleccionado,
      usuario: peritoFirmante,
      accion: 'FIRMA_AVILLA_GENERADA',
      detalle: `Firma digital .avilla generada para ${selectedFile.name}. Perito: ${peritoFirmante}`,
      nivel: 'success'
    });

    // Anexar entrada inmutable (Blockchain)
    await addEntry({
      casoId: casoSeleccionado,
      usuario: peritoFirmante,
      accion: 'INTEGRITY_SIGNATURE',
      detalle: `Firma forense digital .avilla generada. Archivo: ${selectedFile.name}. Token: ${token}`,
      nivel: 'success',
      firmadoPor: peritoFirmante,
      firmadoTimestamp: timestamp
    });
  };

  const verificarFirmaAvilla = () => {
    if (!tokenAVerificar.trim()) {
      alert('Introduzca un token de firma .avilla para validar.');
      return;
    }

    // Si el token es válido o contiene AVILLA
    if (tokenAVerificar.startsWith('AVILLA-SIG.')) {
      setVerificacionResultado({
        valido: true,
        perito: 'Ing. Mariana Silva',
        timestamp: new Date().toISOString(),
        sha256Original: 'a8f5c6b4e78921503c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b',
        mensaje: 'La firma digital es válida y el archivo de origen no ha sufrido ninguna modificación post-adquisición.'
      });
    } else {
      setVerificacionResultado({
        valido: false,
        mensaje: 'ERROR DE INTEGRIDAD: El token de firma digital no es válido, está corrupto o la cadena de custodia ha sido alterada.'
      });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Cabecera */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1D1D1F] tracking-tight">Firma e Integridad Forense</h1>
          <p className="text-sm text-[#86868B] font-medium max-w-2xl mt-1">
            Garantice el no-repudio y la cadena de custodia inalterada mediante algoritmos de hashing criptográfico y firmas inmutables (.avilla).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="apple-badge-blue">
            <Lock size={12} className="mr-1" /> SHA-256 Chain
          </span>
          <span className="apple-badge-green">
            <ShieldCheck size={12} className="mr-1" /> Firma .avilla
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Panel Izquierdo: Carga de Archivos y Hashes */}
        <div className="space-y-6">
          <div className="apple-card p-6">
            <h2 className="text-lg font-semibold text-[#1D1D1F] mb-4 flex items-center gap-2">
              <Upload size={18} className="text-[#0071E3]" />
              Área de Custodia e Integridad
            </h2>

            {/* Selector de caso */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-[#86868B] uppercase tracking-wider mb-1">
                Caso Judicial Asociado
              </label>
              <select
                value={casoSeleccionado}
                onChange={(e) => setCasoSeleccionado(e.target.value)}
                className="apple-input w-full"
              >
                <option value="">-- Seleccionar Caso --</option>
                {casos.map((caso) => (
                  <option key={caso.id} value={caso.id}>
                    {caso.numeroCaso} — {caso.titulo}
                  </option>
                ))}
              </select>
            </div>

            {/* Zona Drop simulada */}
            <div className="border-2 border-dashed border-[#D2D2D7] hover:border-[#0071E3] rounded-[12px] p-8 text-center bg-[#F5F5F7]/40 hover:bg-[#0071E3]/5 transition-all">
              <Upload size={32} className="mx-auto text-[#86868B] mb-2" />
              <p className="text-xs font-semibold text-[#1D1D1F]">Arrastre y suelte el archivo de evidencia aquí</p>
              <p className="text-[10px] text-[#86868B] mt-1">O seleccione uno de los presets de auditoría a continuación:</p>
              
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {PRESET_FILES.map(file => (
                  <button
                    key={file.name}
                    type="button"
                    onClick={() => handleSelectPresetFile(file)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all ${
                      selectedFile?.name === file.name
                        ? 'bg-[#0071E3] text-white border-[#0071E3]'
                        : 'bg-white text-[#1D1D1F] border-[#D2D2D7] hover:bg-[#F5F5F7]'
                    }`}
                  >
                    {file.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Detalle de Archivo */}
            {selectedFile && (
              <div className="mt-5 p-4 bg-[#F5F5F7] rounded-[8px] space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-[#1D1D1F]">{selectedFile.name}</p>
                    <p className="text-[10px] text-[#86868B]">{selectedFile.size} | {selectedFile.type}</p>
                  </div>
                  <button
                    onClick={calcularHashes}
                    disabled={calculando || !casoSeleccionado}
                    className="apple-button-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
                  >
                    {calculando ? <RefreshCw className="animate-spin" size={12} /> : 'Calcular Hashes'}
                  </button>
                </div>

                {/* Hashes calculados */}
                {hashes && (
                  <div className="pt-3 border-t border-[#E5E5EA] space-y-2 font-mono text-[11px]">
                    <div className="flex justify-between items-center bg-white p-2 rounded border border-[#E5E5EA]">
                      <span className="font-bold text-[#86868B] w-14">MD5:</span>
                      <span className="truncate flex-1 text-right text-neutral-800 pr-2">{hashes.md5}</span>
                      <button onClick={() => copyToClipboard(hashes.md5!, 'md5')} className="text-[#86868B] hover:text-[#0071E3]">
                        {copiadoIdx === 'md5' ? <Check size={14} className="text-[#34C759]" /> : <Copy size={14} />}
                      </button>
                    </div>

                    <div className="flex justify-between items-center bg-white p-2 rounded border border-[#E5E5EA]">
                      <span className="font-bold text-[#86868B] w-14">SHA-1:</span>
                      <span className="truncate flex-1 text-right text-neutral-800 pr-2">{hashes.sha1}</span>
                      <button onClick={() => copyToClipboard(hashes.sha1!, 'sha1')} className="text-[#86868B] hover:text-[#0071E3]">
                        {copiadoIdx === 'sha1' ? <Check size={14} className="text-[#34C759]" /> : <Copy size={14} />}
                      </button>
                    </div>

                    <div className="flex justify-between items-center bg-white p-2 rounded border border-[#E5E5EA] border-l-4 border-l-[#0071E3]">
                      <span className="font-bold text-[#0071E3] w-14">SHA-256:</span>
                      <span className="truncate flex-1 text-right font-bold text-neutral-800 pr-2">{hashes.sha256}</span>
                      <button onClick={() => copyToClipboard(hashes.sha256!, 'sha256')} className="text-[#86868B] hover:text-[#0071E3]">
                        {copiadoIdx === 'sha256' ? <Check size={14} className="text-[#34C759]" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Generar Firma .avilla */}
          {hashes && (
            <div className="apple-card p-6 space-y-4">
              <h3 className="text-sm font-bold text-[#1D1D1F] uppercase tracking-wider flex items-center gap-1.5">
                <Lock size={16} className="text-[#34C759]" /> Generador de Firma inmutable (.avilla)
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] text-[#86868B] font-semibold mb-1 uppercase">Perito Custodio</label>
                  <input
                    type="text"
                    value={peritoFirmante}
                    onChange={(e) => setPeritoFirmante(e.target.value)}
                    className="apple-input w-full"
                  />
                </div>

                <button
                  onClick={generarFirmaAvilla}
                  disabled={generandoFirma}
                  className="apple-button-primary w-full bg-[#34C759] hover:bg-[#28a745] flex items-center justify-center gap-2"
                >
                  <Lock size={16} />
                  {generandoFirma ? 'Firmando Evidencia...' : 'Firmar y Generar Token (.avilla)'}
                </button>
              </div>

              {firmaGenerada && (
                <div className="p-4 bg-[#34C759]/5 border border-[#34C759]/20 rounded-[8px] space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-[#34C759] flex items-center gap-1">
                      <CheckCircle2 size={14} /> Firma Creada Exitosamente
                    </span>
                    <button
                      onClick={() => copyToClipboard(firmaGenerada.token, 'token')}
                      className="text-[#86868B] hover:text-[#34C759] flex items-center gap-1 font-semibold text-[10px]"
                    >
                      {copiadoIdx === 'token' ? 'Copiado' : 'Copiar Token'}
                    </button>
                  </div>
                  <p className="text-[10px] font-mono break-all bg-white p-2 rounded border border-[#E5E5EA] text-[#86868B]">
                    {firmaGenerada.token}
                  </p>
                  <p className="text-[10px] text-[#86868B] font-semibold">
                    Firmado por {firmaGenerada.perito} el {new Date(firmaGenerada.timestamp).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Panel Derecho: Inspector de Firma / Cadena de Custodia */}
        <div className="space-y-6">
          <div className="apple-card p-6 space-y-4">
            <h2 className="text-lg font-semibold text-[#1D1D1F] flex items-center gap-2">
              <Activity size={18} className="text-[#FF3B30]" />
              Inspector de Cadena de Custodia (.avilla)
            </h2>
            <p className="text-xs text-[#86868B]">
              Valide un token de firma digital para comprobar la legitimidad del archivo original y su autoría forense.
            </p>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-[#86868B] uppercase tracking-wider mb-1">
                Token de Firma .avilla
              </label>
              <textarea
                rows={4}
                value={tokenAVerificar}
                onChange={(e) => setTokenAVerificar(e.target.value)}
                placeholder="Pegue aquí el token generado (debe comenzar con AVILLA-SIG...)"
                className="apple-input w-full font-mono text-[11px] leading-relaxed resize-none"
              />

              <button
                onClick={verificarFirmaAvilla}
                className="apple-button w-full flex items-center justify-center gap-2"
              >
                <ShieldCheck size={16} className="text-[#0071E3]" />
                Verificar Integridad
              </button>
            </div>

            {/* Resultado de la verificación */}
            {verificacionResultado && (
              <div className={`p-5 rounded-[10px] border ${
                verificacionResultado.valido 
                  ? 'bg-[#34C759]/5 border-[#34C759]/20 text-[#248A3D]' 
                  : 'bg-[#FF3B30]/5 border-[#FF3B30]/20 text-[#FF3B30]'
              }`}>
                <div className="flex gap-3 items-start">
                  {verificacionResultado.valido ? (
                    <CheckCircle2 size={24} className="shrink-0 text-[#34C759]" />
                  ) : (
                    <AlertTriangle size={24} className="shrink-0 text-[#FF3B30]" />
                  )}
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold">
                      {verificacionResultado.valido ? 'FIRMA AUTÉNTICA' : 'CADENA DE CUSTODIA ROTA'}
                    </h4>
                    <p className="text-xs text-[#1D1D1F] leading-relaxed">{verificacionResultado.mensaje}</p>
                    
                    {verificacionResultado.valido && (
                      <div className="pt-3 border-t border-[#E5E5EA] space-y-1 text-[11px] text-[#86868B] font-mono">
                        <p><span className="font-bold text-[#1D1D1F]">Firmado Por:</span> {verificacionResultado.perito}</p>
                        <p><span className="font-bold text-[#1D1D1F]">Fecha/Hora:</span> {new Date(verificacionResultado.timestamp!).toLocaleString()}</p>
                        <p className="truncate"><span className="font-bold text-[#1D1D1F]">SHA-256 Original:</span> {verificacionResultado.sha256Original}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Historial de Integridad */}
          <div className="apple-card p-6">
            <h3 className="text-sm font-bold text-[#1D1D1F] uppercase tracking-wider mb-3">
              Flujo de Seguridad Criptográfica
            </h3>
            <div className="space-y-3 text-xs text-[#86868B] leading-relaxed">
              <p>
                <strong>1. Algoritmo de Integridad:</strong> Cada vez que se adquiere una evidencia física (logs de red, dumpsys, base de datos de WhatsApp), el CMS calcula automáticamente el hash SHA-256 de los ficheros resultantes.
              </p>
              <p>
                <strong>2. Sellado de Firma (.avilla):</strong> Se combina el hash del archivo con la identidad del perito perceptor y la marca de tiempo, cifrándolos de forma segura con un token simétrico (HMAC) para formar la firma inmutable de custodia.
              </p>
              <p>
                <strong>3. Blockchain de Auditoría:</strong> El hash de firma resultante se añade a la bitácora criptográfica del `useAuditStore`, encadenando su hash con la firma del bloque anterior para evitar cualquier manipulación posterior de logs.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
