'use client';

import { useState, useEffect } from 'react';
import { useCMSStore } from '../../store/cmsStore';
import type { TipoProyecto } from '../../store/cmsStore';

interface WizardFormData {
  // Paso 1 — Identificación
  tipoProyecto: TipoProyecto;
  numeroCaso: string;
  numeroPRCC: string;
  expediente: string;
  titulo: string;
  prioridad: 'critica' | 'alta' | 'media' | 'baja';
  // Paso 2 — Consignante
  solicitante_nombre: string;
  solicitante_cedula: string;
  solicitante_telefono: string;
  solicitante_email: string;
  solicitante_direccion: string;
  // Paso 3 — Evidencia Digital
  dispositivo_marca: string;
  dispositivo_modelo: string;
  dispositivo_imei: string;
  dispositivo_serial: string;
  dispositivo_color: string;
  dispositivo_estado_fisico: string;
  dispositivo_accesorios: string;
  dispositivo_modo_aislamiento: string;
  // Paso 4 — Equipo Pericial
  peritoLider: string;
  perito_cedula: string;
  perito_civ: string;
  perito_inpre: string;
  perito_cargo: string;
  despachoFiscal: string;
  organismoOrdenante: string;
}

const INITIAL_FORM: WizardFormData = {
  tipoProyecto: 'forense_whatsapp',
  numeroCaso: '',
  numeroPRCC: '',
  expediente: '',
  titulo: '',
  prioridad: 'alta',
  solicitante_nombre: '',
  solicitante_cedula: '',
  solicitante_telefono: '',
  solicitante_email: '',
  solicitante_direccion: '',
  dispositivo_marca: '',
  dispositivo_modelo: '',
  dispositivo_imei: '',
  dispositivo_serial: '',
  dispositivo_color: '',
  dispositivo_estado_fisico: '',
  dispositivo_accesorios: '',
  dispositivo_modo_aislamiento: 'Modo Avión',
  peritoLider: '',
  perito_cedula: '',
  perito_civ: '',
  perito_inpre: '',
  perito_cargo: 'Perito Informático Forense',
  despachoFiscal: '',
  organismoOrdenante: '',
};

const STEPS = [
  { num: 1, label: 'Expediente', icon: '📁' },
  { num: 2, label: 'Consignante', icon: '👤' },
  { num: 3, label: 'Evidencia', icon: '📱' },
  { num: 4, label: 'Equipo Pericial', icon: '🔬' },
];

const TIPOS_INVESTIGACION: { value: TipoProyecto; label: string; desc: string }[] = [
  { value: 'forense_whatsapp', label: '📱 Forense WhatsApp', desc: 'Extracción y análisis de conversaciones WhatsApp (Android/iOS)' },
  { value: 'forense_email',    label: '📧 Forense Email',    desc: 'Análisis de correos electrónicos y metadatos de servidor' },
  { value: 'forense_discoduro',label: '💽 Forense Disco Duro', desc: 'Adquisición forense de HDD/SSD con FTK Imager' },
  { value: 'forense_imagen',   label: '🖼️ Imagen Forense',  desc: 'Verificación de integridad de imagen forense bit a bit (SHA-256)' },
];

interface NuevoCasoWizardProps {
  onClose: () => void;
}

export default function NuevoCasoWizard({ onClose }: NuevoCasoWizardProps) {
  const { addCaso } = useCMSStore();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<WizardFormData>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (field: keyof WizardFormData, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const validateStep = (): boolean => {
    if (step === 1) return !!(form.tipoProyecto && form.numeroCaso && form.titulo);
    if (step === 2) return !!(form.solicitante_nombre && form.solicitante_cedula);
    if (step === 3) return true; // dispositivo fields optional
    if (step === 4) return !!(form.peritoLider && form.perito_cedula);
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) { setError('Por favor completa los campos requeridos (*)'); return; }
    setError(null);
    setStep(prev => Math.min(prev + 1, 4));
  };

  const handleBack = () => { setError(null); setStep(prev => Math.max(prev - 1, 1)); };

  const handleSubmit = async () => {
    if (!validateStep()) { setError('Por favor completa los campos requeridos (*)'); return; }
    setIsSubmitting(true);
    setError(null);
    try {
      await addCaso({
        tipoProyecto: form.tipoProyecto,
        numeroCaso: form.numeroCaso,
        numeroPRCC: form.numeroPRCC || undefined,
        expediente: form.expediente || undefined,
        titulo: form.titulo,
        descripcion: '',
        estado: 'iniciado',
        prioridad: form.prioridad,
        peritoLider: form.peritoLider,
        fiscal: undefined,
        compliance: undefined,
        despachoFiscal: form.despachoFiscal || undefined,
        organismoOrdenante: form.organismoOrdenante || undefined,
        normativasAplicadas: [],
        fasesCompletadas: 0,
        totalFases: 4,
        porcentajeCompletado: 0,
        totalEvidencias: 0,
        nivelCumplimientoGeneral: 'no_conforme',
        etiquetas: [],
        notas: '',
        // Consignante
        solicitante_nombre: form.solicitante_nombre,
        solicitante_cedula: form.solicitante_cedula,
        solicitante_telefono: form.solicitante_telefono,
        solicitante_email: form.solicitante_email,
        solicitante_direccion: form.solicitante_direccion,
        // Dispositivo
        dispositivo_marca: form.dispositivo_marca,
        dispositivo_modelo: form.dispositivo_modelo,
        dispositivo_imei: form.dispositivo_imei,
        dispositivo_estado_fisico: form.dispositivo_estado_fisico,
        dispositivo_color: form.dispositivo_color,
        dispositivo_accesorios: form.dispositivo_accesorios,
        dispositivo_modo_aislamiento: form.dispositivo_modo_aislamiento,
        // Perito
        perito_cedula: form.perito_cedula,
        perito_civ: form.perito_civ,
        perito_inpre: form.perito_inpre,
        perito_cargo: form.perito_cargo,
        // Disco duro (para forense_discoduro)
        discoduro_serial: form.dispositivo_serial,
        discoduro_marca: form.dispositivo_marca,
        discoduro_modelo: form.dispositivo_modelo,
      });
      onClose();
    } catch (err) {
      setError('Error al crear el caso. Intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "form-control form-control-sm";
  const labelClass = "form-label";

  return (
    <div className="modal show d-block uswds-modal" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          {/* Header */}
          <div className="modal-header d-flex align-items-center gap-3" style={{ backgroundColor: '#112E51', color: '#FFFFFF' }}>
            <div>
              <h5 className="modal-title mb-0" style={{ color: '#FFFFFF', fontWeight: 800, fontSize: 15 }}>
                ⚖️ NUEVO EXPEDIENTE FORENSE
              </h5>
              <div style={{ fontSize: 11, color: '#E2E8F0', marginTop: 2 }}>
                CMS SHA256.US — Sistema de Gestión Forense Digital (USWDS DC3 Theme)
              </div>
            </div>
            <button
              type="button"
              className="btn-close ms-auto btn-close-white"
              onClick={onClose}
              aria-label="Cerrar"
            />
          </div>

          {/* USWDS Step Indicator */}
          <div className="px-4 pt-3 pb-0">
            <div className="d-flex gap-1 mb-1">
              {STEPS.map(s => (
                <div
                  key={s.num}
                  className="flex-fill"
                  style={{
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: step > s.num
                      ? 'var(--usa-green)'
                      : step === s.num
                        ? 'var(--usa-blue)'
                        : 'var(--usa-border)',
                    transition: 'background-color 0.3s ease',
                  }}
                />
              ))}
            </div>
            <div className="d-flex justify-content-between">
              {STEPS.map(s => (
                <div
                  key={s.num}
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    color: step === s.num
                      ? 'var(--usa-blue)'
                      : step > s.num
                        ? 'var(--usa-green)'
                        : 'var(--usa-text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    flex: 1,
                    textAlign: s.num === 1 ? 'left' : s.num === STEPS.length ? 'right' : 'center',
                  }}
                >
                  {s.icon} {s.label}
                </div>
              ))}
            </div>
          </div>


          {/* Body */}
          <div className="modal-body py-3">
            {error && (
              <div className="usa-alert usa-alert--error mb-3">
                <div className="usa-alert__heading">⚠️ Campo requerido</div>
                <div style={{ fontSize: 12 }}>{error}</div>
              </div>
            )}

            {/* PASO 1 — Identificación del Expediente */}
            {step === 1 && (
              <div className="animate-fade-in">
                <h6 className="mb-3" style={{ color: 'var(--usa-gold)', textTransform: 'uppercase', fontSize: 11, letterSpacing: '0.06em' }}>
                  📁 Identificación del Expediente
                </h6>

                {/* Tipo de Investigación */}
                <div className="mb-3">
                  <label className={labelClass}>Tipo de Investigación *</label>
                  <div className="row g-2">
                    {TIPOS_INVESTIGACION.map(tipo => (
                      <div key={tipo.value} className="col-6">
                        <div
                          onClick={() => set('tipoProyecto', tipo.value)}
                          style={{
                            border: `2px solid ${form.tipoProyecto === tipo.value ? 'var(--usa-gold)' : 'var(--usa-border)'}`,
                            borderRadius: 8,
                            padding: '10px 12px',
                            cursor: 'pointer',
                            backgroundColor: form.tipoProyecto === tipo.value ? 'rgba(254,207,6,0.08)' : 'transparent',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <div style={{ fontSize: 12, fontWeight: 700, color: form.tipoProyecto === tipo.value ? 'var(--usa-gold)' : 'var(--usa-text)' }}>
                            {tipo.label}
                          </div>
                          <div style={{ fontSize: 10, color: 'var(--usa-text-muted)', marginTop: 2, lineHeight: 1.3 }}>
                            {tipo.desc}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="row g-2">
                  <div className="col-6">
                    <label className={labelClass}>N° de Caso *</label>
                    <input className={inputClass} value={form.numeroCaso} onChange={e => set('numeroCaso', e.target.value)} placeholder="Ej: 2025-001" />
                  </div>
                  <div className="col-6">
                    <label className={labelClass}>N° PRCC</label>
                    <input className={inputClass} value={form.numeroPRCC} onChange={e => set('numeroPRCC', e.target.value)} placeholder="PRCC-2025-001" style={{ fontFamily: 'var(--usa-font-mono)' }} />
                  </div>
                  <div className="col-12">
                    <label className={labelClass}>N° Expediente</label>
                    <input className={inputClass} value={form.expediente} onChange={e => set('expediente', e.target.value)} placeholder="N° expediente judicial o administrativo" />
                  </div>
                  <div className="col-12">
                    <label className={labelClass}>Título del Caso *</label>
                    <input className={inputClass} value={form.titulo} onChange={e => set('titulo', e.target.value)} placeholder="Descripción breve del caso forense" />
                  </div>
                  <div className="col-6">
                    <label className={labelClass}>Prioridad</label>
                    <select className={inputClass} value={form.prioridad} onChange={e => set('prioridad', e.target.value as any)}>
                      <option value="critica">🔴 Crítica</option>
                      <option value="alta">🟠 Alta</option>
                      <option value="media">🟡 Media</option>
                      <option value="baja">🟢 Baja</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* PASO 2 — Consignante / Entrevistado */}
            {step === 2 && (
              <div className="animate-fade-in">
                <h6 className="mb-3" style={{ color: 'var(--usa-gold)', textTransform: 'uppercase', fontSize: 11, letterSpacing: '0.06em' }}>
                  👤 Datos del Consignante / Entrevistado
                </h6>
                <div className="usa-alert usa-alert--info mb-3">
                  <div className="usa-alert__heading">ℹ️ Auto-poblado</div>
                  <div style={{ fontSize: 11 }}>Estos datos se propagarán automáticamente al Acta de Obtención, Acta de Entrevista, PRCC y todas las planillas del expediente.</div>
                </div>
                <div className="row g-2">
                  <div className="col-8">
                    <label className={labelClass}>Nombre Completo *</label>
                    <input className={inputClass} value={form.solicitante_nombre} onChange={e => set('solicitante_nombre', e.target.value)} placeholder="Apellidos y Nombres" />
                  </div>
                  <div className="col-4">
                    <label className={labelClass}>C.I. N° *</label>
                    <input className={inputClass} value={form.solicitante_cedula} onChange={e => set('solicitante_cedula', e.target.value)} placeholder="V-12.345.678" style={{ fontFamily: 'var(--usa-font-mono)' }} />
                  </div>
                  <div className="col-6">
                    <label className={labelClass}>Teléfono</label>
                    <input className={inputClass} value={form.solicitante_telefono} onChange={e => set('solicitante_telefono', e.target.value)} placeholder="+58 412-000-0000" style={{ fontFamily: 'var(--usa-font-mono)' }} />
                  </div>
                  <div className="col-6">
                    <label className={labelClass}>Correo Electrónico</label>
                    <input className={inputClass} type="email" value={form.solicitante_email} onChange={e => set('solicitante_email', e.target.value)} placeholder="correo@ejemplo.com" />
                  </div>
                  <div className="col-12">
                    <label className={labelClass}>Dirección de Habitación</label>
                    <textarea className={inputClass} rows={2} value={form.solicitante_direccion} onChange={e => set('solicitante_direccion', e.target.value)} placeholder="Dirección completa de residencia del consignante" />
                  </div>
                </div>
              </div>
            )}

            {/* PASO 3 — Evidencia Digital */}
            {step === 3 && (
              <div className="animate-fade-in">
                <h6 className="mb-3" style={{ color: 'var(--usa-gold)', textTransform: 'uppercase', fontSize: 11, letterSpacing: '0.06em' }}>
                  📱 Datos de la Evidencia Digital
                </h6>
                <div className="usa-alert usa-alert--info mb-3">
                  <div className="usa-alert__heading">📦 Dispositivo / Soporte</div>
                  <div style={{ fontSize: 11 }}>
                    Tipo de investigación seleccionado: <strong style={{ color: 'var(--usa-gold)' }}>
                      {TIPOS_INVESTIGACION.find(t => t.value === form.tipoProyecto)?.label}
                    </strong>
                  </div>
                </div>
                <div className="row g-2">
                  <div className="col-6">
                    <label className={labelClass}>Marca</label>
                    <input className={inputClass} value={form.dispositivo_marca} onChange={e => set('dispositivo_marca', e.target.value)} placeholder="Samsung, Apple, Seagate..." />
                  </div>
                  <div className="col-6">
                    <label className={labelClass}>Modelo</label>
                    <input className={inputClass} value={form.dispositivo_modelo} onChange={e => set('dispositivo_modelo', e.target.value)} placeholder="Galaxy A54, iPhone 14..." />
                  </div>
                  <div className="col-6">
                    <label className={labelClass}>IMEI / Serial</label>
                    <input className={inputClass} value={form.dispositivo_imei} onChange={e => set('dispositivo_imei', e.target.value)} placeholder="IMEI o N° de serial" style={{ fontFamily: 'var(--usa-font-mono)' }} />
                  </div>
                  <div className="col-6">
                    <label className={labelClass}>Color</label>
                    <input className={inputClass} value={form.dispositivo_color} onChange={e => set('dispositivo_color', e.target.value)} placeholder="Negro, Blanco, Gris..." />
                  </div>
                  <div className="col-12">
                    <label className={labelClass}>Estado Físico</label>
                    <select className={inputClass} value={form.dispositivo_estado_fisico} onChange={e => set('dispositivo_estado_fisico', e.target.value)}>
                      <option value="">Seleccionar estado...</option>
                      <option value="Óptimas condiciones">✅ Óptimas condiciones</option>
                      <option value="Daños leves">⚠️ Daños leves (raspados, golpes menores)</option>
                      <option value="Daños moderados">🟠 Daños moderados (pantalla fisurada)</option>
                      <option value="Daños graves">🔴 Daños graves (dispositivo inutilizable)</option>
                    </select>
                  </div>
                  <div className="col-6">
                    <label className={labelClass}>Modo de Aislamiento RF</label>
                    <select className={inputClass} value={form.dispositivo_modo_aislamiento} onChange={e => set('dispositivo_modo_aislamiento', e.target.value)}>
                      <option value="Modo Avión">✈️ Modo Avión</option>
                      <option value="Bolsa Faraday">🛡️ Bolsa Faraday</option>
                      <option value="Sin conectividad">🚫 Sin conectividad</option>
                      <option value="No aplica">— No aplica</option>
                    </select>
                  </div>
                  <div className="col-6">
                    <label className={labelClass}>Accesorios Consignados</label>
                    <input className={inputClass} value={form.dispositivo_accesorios} onChange={e => set('dispositivo_accesorios', e.target.value)} placeholder="Cargador, funda, memoria SD..." />
                  </div>
                </div>
              </div>
            )}

            {/* PASO 4 — Equipo Pericial */}
            {step === 4 && (
              <div className="animate-fade-in">
                <h6 className="mb-3" style={{ color: 'var(--usa-gold)', textTransform: 'uppercase', fontSize: 11, letterSpacing: '0.06em' }}>
                  🔬 Equipo Pericial & Datos Institucionales
                </h6>
                <div className="usa-alert usa-alert--info mb-3">
                  <div className="usa-alert__heading">✍️ Perito Actuante</div>
                  <div style={{ fontSize: 11 }}>Datos que aparecerán en la sección de firmas de todas las planillas forenses del expediente.</div>
                </div>
                <div className="row g-2">
                  <div className="col-8">
                    <label className={labelClass}>Perito Líder * (Nombre Completo)</label>
                    <input className={inputClass} value={form.peritoLider} onChange={e => set('peritoLider', e.target.value)} placeholder="Apellidos y Nombres del Perito" />
                  </div>
                  <div className="col-4">
                    <label className={labelClass}>C.I. N° *</label>
                    <input className={inputClass} value={form.perito_cedula} onChange={e => set('perito_cedula', e.target.value)} placeholder="V-12.345.678" style={{ fontFamily: 'var(--usa-font-mono)' }} />
                  </div>
                  <div className="col-4">
                    <label className={labelClass}>CIV N°</label>
                    <input className={inputClass} value={form.perito_civ} onChange={e => set('perito_civ', e.target.value)} placeholder="CIV-12345" style={{ fontFamily: 'var(--usa-font-mono)' }} />
                  </div>
                  <div className="col-4">
                    <label className={labelClass}>INPREABOGADO N°</label>
                    <input className={inputClass} value={form.perito_inpre} onChange={e => set('perito_inpre', e.target.value)} placeholder="INPRE-12345" style={{ fontFamily: 'var(--usa-font-mono)' }} />
                  </div>
                  <div className="col-4">
                    <label className={labelClass}>Cargo</label>
                    <input className={inputClass} value={form.perito_cargo} onChange={e => set('perito_cargo', e.target.value)} placeholder="Perito Informático Forense" />
                  </div>
                  <div className="col-12 mt-2">
                    <div style={{ borderTop: '1px solid var(--usa-border)', marginBottom: 10, paddingTop: 10 }}>
                      <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--usa-text-muted)', fontWeight: 700 }}>
                        🏛️ Datos Institucionales
                      </span>
                    </div>
                  </div>
                  <div className="col-6">
                    <label className={labelClass}>Despacho Fiscal</label>
                    <input className={inputClass} value={form.despachoFiscal} onChange={e => set('despachoFiscal', e.target.value)} placeholder="Fiscalía N° X del Área Met..." />
                  </div>
                  <div className="col-6">
                    <label className={labelClass}>Organismo Ordenante</label>
                    <input className={inputClass} value={form.organismoOrdenante} onChange={e => set('organismoOrdenante', e.target.value)} placeholder="CICPC, SEBIN, Fiscalía..." />
                  </div>
                </div>

                {/* Summary preview */}
                <div className="usa-summary-box mt-3" style={{ fontSize: 11 }}>
                  <div style={{ fontWeight: 800, color: 'var(--usa-gold)', marginBottom: 6 }}>📋 Resumen del Expediente</div>
                  <div className="row g-1" style={{ color: 'var(--usa-text-muted)' }}>
                    <div className="col-6">
                      <strong style={{ color: 'var(--usa-text)' }}>N° Caso:</strong> {form.numeroCaso || '—'}
                    </div>
                    <div className="col-6">
                      <strong style={{ color: 'var(--usa-text)' }}>Tipo:</strong> {TIPOS_INVESTIGACION.find(t => t.value === form.tipoProyecto)?.label || '—'}
                    </div>
                    <div className="col-6">
                      <strong style={{ color: 'var(--usa-text)' }}>Consignante:</strong> {form.solicitante_nombre || '—'}
                    </div>
                    <div className="col-6">
                      <strong style={{ color: 'var(--usa-text)' }}>C.I.:</strong> {form.solicitante_cedula || '—'}
                    </div>
                    <div className="col-6">
                      <strong style={{ color: 'var(--usa-text)' }}>Dispositivo:</strong> {form.dispositivo_marca} {form.dispositivo_modelo || '—'}
                    </div>
                    <div className="col-6">
                      <strong style={{ color: 'var(--usa-text)' }}>Perito:</strong> {form.peritoLider || '—'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Navigation */}
          <div className="modal-footer justify-content-between">
            <div>
              {step > 1 && (
                <button className="btn btn-outline-secondary btn-sm" onClick={handleBack} disabled={isSubmitting}>
                  ← Anterior
                </button>
              )}
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-secondary btn-sm" onClick={onClose} disabled={isSubmitting}>
                Cancelar
              </button>
              {step < 4 ? (
                <button className="btn btn-warning btn-sm" onClick={handleNext}>
                  Siguiente →
                </button>
              ) : (
                <button
                  className="btn btn-warning btn-sm"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  style={{ minWidth: 140 }}
                >
                  {isSubmitting ? '⏳ Creando...' : '✅ Crear Expediente'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
