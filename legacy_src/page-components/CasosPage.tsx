'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useCMSStore, EstadoCaso, PrioridadCaso, TipoProyecto } from '../store/cmsStore';
import {
  FolderOpen, Smartphone, Mail, HardDrive, BookOpen,
  ChevronRight, Trash2, Search, ArrowLeft, User, Plus, X
} from '../components/atoms/AppleIcon';
import Button from '../components/atoms/Button';
import { getTiposProyecto, getTipoProyectoConfig } from '../data/tiposProyecto';

const ESTADOS: { value: EstadoCaso | 'todos'; label: string }[] = [
  { value: 'todos', label: 'Todos los Estados' },
  { value: 'iniciado', label: 'Iniciado' },
  { value: 'en_proceso', label: 'En Proceso' },
  { value: 'analisis', label: 'Análisis' },
  { value: 'informe', label: 'Informe' },
  { value: 'cerrado', label: 'Cerrado' },
  { value: 'archivado', label: 'Archivado' },
];

const ESTADO_LABEL: Record<EstadoCaso, { label: string; tagClass: string }> = {
  iniciado:    { label: 'Iniciado',    tagClass: 'usa-tag--info' },
  en_proceso:  { label: 'En Proceso',  tagClass: 'usa-tag--info' },
  analisis:    { label: 'Análisis',    tagClass: 'usa-tag--info' },
  informe:     { label: 'Informe',     tagClass: 'usa-tag--info' },
  cerrado:     { label: 'Cerrado',     tagClass: 'usa-tag--success' },
  archivado:   { label: 'Archivado',   tagClass: 'usa-tag--muted' },
};

export default function CasosPage() {
  const router = useRouter();
  const { casos, addCaso, deleteCaso } = useCMSStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState<string>('todos');
  const [filterTipo, setFilterTipo] = useState<string>('todos');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitulo, setNewTitulo] = useState('');
  const [newTipo, setNewTipo] = useState<TipoProyecto>('forense_whatsapp');
  const [newPrioridad, setNewPrioridad] = useState<PrioridadCaso>('alta');
  const [newPerito, setNewPerito] = useState('Ing. Perito Forense Digital');
  const [newFiscal, setNewFiscal] = useState('Fiscalía Superior MP');
  const [newDispositivo, setNewDispositivo] = useState('');

  const casosFiltrados = casos.filter(c => {
    const matchSearch = c.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        c.numeroCaso.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (c.peritoLider && c.peritoLider.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchEstado = filterEstado === 'todos' || c.estado === filterEstado;
    const matchTipo = filterTipo === 'todos' || c.tipoProyecto === filterTipo;
    return matchSearch && matchEstado && matchTipo;
  });

  const handleCreateCaso = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitulo.trim()) return;

    const numCorrelativo = String(casos.length + 1).padStart(4, '0');
    const nuevoCodigo = `EXP-2026-${numCorrelativo}`;
    const config = getTipoProyectoConfig(newTipo);
    const initialSteps: Record<string, any> = {};
    config.pasos.forEach((p) => {
      initialSteps[p.id] = { pasoId: p.id, estado: p.num === 1 ? 'en_proceso' : 'pendiente' };
    });

    const casoId = await addCaso({
      numeroCaso: nuevoCodigo,
      titulo: newTitulo,
      descripcion: newDispositivo || 'Investigación Forense Digital y Control de Cadena de Custodia',
      tipoProyecto: newTipo,
      prioridad: newPrioridad,
      estado: 'iniciado',
      peritoLider: newPerito,
      fiscal: newFiscal,
      steps: initialSteps,
      normativasAplicadas: ['ISO/IEC 27037:2012', 'MUCC-2017'],
      fasesCompletadas: 1,
      totalFases: config.fases.length || 3,
      porcentajeCompletado: 10,
      totalEvidencias: 1,
      nivelCumplimientoGeneral: 'conforme',
      etiquetas: ['Forense', newTipo],
      notas: newDispositivo || 'Evidencia Primaria',
    });

    setIsModalOpen(false);
    setNewTitulo('');
    if (casoId) router.push(`/control/seguimiento-compliance?casoId=${casoId}`);
  };

  return (
    <div className="container-fluid max-w-1280 px-0 pb-5">
      {/* Header Institucional */}
      <div className="d-flex justify-content-between align-items-center pb-3 mb-4 border-bottom border-2" style={{ borderColor: '#CBD5E1' }}>
        <div>
          <h1 className="h3 fw-bold text-navy mb-1" style={{ color: '#112E51' }}>
            Directorio de Casos Forenses
          </h1>
          <p className="text-muted small mb-0">
            Gestión integral de expedientes periciales y trazabilidad inmutable de cadena de custodia.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary btn-sm fw-bold d-flex align-items-center gap-1"
        >
          <Plus size={16} /> Crear Expediente
        </button>
      </div>

      {/* Toolbar & Filters */}
      <div className="card p-3 border bg-white rounded-3 shadow-sm mb-4">
        <div className="row g-2">
          <div className="col-12 col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por expediente, título o perito..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-6 col-md-3">
            <select
              className="form-select"
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
            >
              {ESTADOS.map((e) => (
                <option key={e.value} value={e.value}>{e.label}</option>
              ))}
            </select>
          </div>
          <div className="col-6 col-md-3">
            <select
              className="form-select"
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
            >
              <option value="todos">Todas las Tipologías</option>
              <option value="forense_whatsapp">Forense WhatsApp</option>
              <option value="forense_email">Forense Email</option>
              <option value="forense_discoduro">Forense Disco Duro</option>
              <option value="forense_imagen">Imagen Forense</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid de Casos */}
      <div className="row g-3">
        {casosFiltrados.map((caso) => {
          const meta = ESTADO_LABEL[caso.estado] || ESTADO_LABEL.iniciado;
          return (
            <div key={caso.id} className="col-12 col-sm-6 col-md-4">
              <div
                onClick={() => router.push(`/control/seguimiento-compliance?casoId=${caso.id}`)}
                className="card p-3 border rounded-3 bg-white hover-border-primary cursor-pointer transition-all h-100 d-flex flex-column justify-content-between"
                style={{ cursor: 'pointer' }}
              >
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className={`usa-tag ${meta.tagClass}`}>{meta.label}</span>
                    <span className="font-monospace fw-bold text-primary" style={{ fontSize: '11px' }}>
                      {caso.numeroCaso}
                    </span>
                  </div>
                  <h3 className="h6 fw-bold text-navy mb-1" style={{ color: '#112E51' }}>
                    {caso.titulo}
                  </h3>
                  <p className="text-muted small mb-3 text-truncate">
                    {caso.descripcion}
                  </p>
                </div>

                <div className="pt-2 border-top">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="small text-muted" style={{ fontSize: '11px' }}>Progreso Forense</span>
                    <span className="fw-bold text-success font-monospace" style={{ fontSize: '11px' }}>
                      {caso.porcentajeCompletado || 0}%
                    </span>
                  </div>
                  <div className="progress" style={{ height: '6px' }}>
                    <div className="progress-bar bg-success" style={{ width: `${caso.porcentajeCompletado || 0}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Nuevo Caso Bootstrap */}
      {isModalOpen && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-primary">
              <div className="modal-header bg-navy text-white" style={{ backgroundColor: '#112E51' }}>
                <h5 className="modal-title fw-bold">Nuevo Expediente Pericial Forense</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setIsModalOpen(false)}></button>
              </div>
              <form onSubmit={handleCreateCaso}>
                <div className="modal-body d-flex flex-column gap-3">
                  <div>
                    <label className="form-label small fw-bold">Título del Expediente *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newTitulo}
                      onChange={(e) => setNewTitulo(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label small fw-bold">Tipo de Investigación</label>
                    <select
                      className="form-select"
                      value={newTipo}
                      onChange={(e) => setNewTipo(e.target.value as TipoProyecto)}
                    >
                      <option value="forense_whatsapp">Forense WhatsApp (Móvil Android)</option>
                      <option value="forense_email">Forense Email (Cabeceras SMTP)</option>
                      <option value="forense_discoduro">Forense Disco Duro (Clonado Bit-a-Bit)</option>
                      <option value="forense_imagen">Adquisición de Imagen Forense (ISO 27037)</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label small fw-bold">Dispositivo / Evidencia Primaria</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newDispositivo}
                      onChange={(e) => setNewDispositivo(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="form-label small fw-bold">Perito Asignado</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newPerito}
                      onChange={(e) => setNewPerito(e.target.value)}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setIsModalOpen(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm fw-bold">
                    Crear Expediente
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
