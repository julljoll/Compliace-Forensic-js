'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import {
  useCMSStore,
  type EstadoCaso,
  type PrioridadCaso,
  type TipoProyecto,
  type CasoCMS
} from '../store/cmsStore';
import {
  FolderOpen, ShieldCheck, AlertTriangle, Plus, BookOpen,
  ClipboardList, Smartphone, Mail, HardDrive, Search, Filter,
  ChevronRight, CheckCircle2, Lock, Activity, Database,
  FileText, ExternalLink, Printer, Key, ShieldAlert, User, X,
  ArrowRight, ArrowLeft, Hash, Shield
} from '../components/atoms/AppleIcon';
import Button from '../components/atoms/Button';
import StatusDot from '../components/atoms/StatusDot';
import USWDSStepIndicator from '../components/organisms/Planillas/USWDSStepIndicator';
import NuevoCasoWizard from '../components/organisms/NuevoCasoWizard';
import { getTipoProyectoConfig } from '../data/tiposProyecto';

const ESTADO_LABEL: Record<EstadoCaso, { label: string; tagClass: string }> = {
  iniciado:    { label: 'Iniciado',    tagClass: 'usa-tag--info' },
  en_proceso:  { label: 'En Proceso',  tagClass: 'usa-tag--info' },
  analisis:    { label: 'Análisis',    tagClass: 'usa-tag--info' },
  informe:     { label: 'Informe',     tagClass: 'usa-tag--info' },
  cerrado:     { label: 'Cerrado',     tagClass: 'usa-tag--success' },
  archivado:   { label: 'Archivado',   tagClass: 'usa-tag--muted' },
};

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { casos, addCaso, fetchCasos, getEstadisticas, auditLogs } = useCMSStore();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'casos'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState<string>('todos');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [preselectedTipo, setPreselectedTipo] = useState<TipoProyecto>('forense_whatsapp');

  useEffect(() => { fetchCasos(); }, [fetchCasos]);

  const stats = getEstadisticas();

  const casosFiltrados = useMemo(() => {
    return casos.filter(c => {
      const matchSearch = c.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.numeroCaso.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (c.peritoLider && c.peritoLider.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchEstado = filterEstado === 'todos' || c.estado === filterEstado;
      return matchSearch && matchEstado;
    });
  }, [casos, searchTerm, filterEstado]);

  const handleOpenWizard = (tipo?: TipoProyecto) => {
    if (tipo) setPreselectedTipo(tipo);
    setIsModalOpen(true);
  };

  const TIPOS_INFO = [
    { type: 'forense_whatsapp', title: 'WhatsApp Mobile', desc: '9 Pasos MUCC-2017 · msgstore.db · Parseo SQLite y extracción física', icon: <Smartphone size={20} />, color: '#005EA2', normativas: ['ISO 27037', 'MUCC-2017'] },
    { type: 'forense_email', title: 'Cabecera SMTP', desc: '7 Pasos RFC 3227 · Cabeceras SPF/DKIM/DMARC e IP Origen', icon: <Mail size={20} />, color: '#D9A700', normativas: ['RFC 3227', 'ISO 27042'] },
    { type: 'forense_discoduro', title: 'Disco Duro E01/DD', desc: '8 Pasos NIST SP 800-86 · Clonado Bit-a-Bit · Hash Génesis', icon: <HardDrive size={20} />, color: '#112E51', normativas: ['NIST 800-86', 'COPP 187'] },
    { type: 'forense_imagen', title: 'Imagen Forense', desc: '8 Pasos ISO/IEC 27037 · Hash SHA-256 · Verificación bit-a-bit', icon: <HardDrive size={20} />, color: '#008837', normativas: ['ISO 27037', 'ISO 27042', 'MUCC-2017'] },
  ];

  return (
    <div className="container-fluid max-w-1280 px-0 pb-5">
      {/* Header Institucional */}
      <div className="pb-3 mb-4 border-bottom border-2" style={{ borderColor: '#CBD5E1' }}>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div className="d-flex align-items-center gap-3">
            <img
              src="/logo.png"
              alt="SHA256.US"
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '8px',
                objectFit: 'contain',
                backgroundColor: '#FFFFFF',
                padding: '6px',
                border: '2px solid #112E51',
                flexShrink: 0,
              }}
            />
            <div>
              <h1 className="h4 fw-black text-navy text-uppercase mb-1" style={{ color: '#112E51' }}>
                CENTRO DE MANDO COMPLIANCE FORENSE
              </h1>
              <h2 className="h6 fw-bold text-primary mb-2" style={{ color: '#005EA2' }}>
                SHA256.US — Laboratorio de Informática Forense Digital (DC3 USWDS Theme)
              </h2>
              <div className="d-flex flex-wrap gap-1">
                {['ISO/IEC 27037:2012', 'NIST SP 800-86', 'MUCC-2017 (MP-CICPC)', 'COPP Art. 187/225'].map(n => (
                  <span key={n} className="usa-tag usa-tag--info" style={{ fontSize: '9.5px' }}>
                    {n}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-primary fw-bold d-flex align-items-center gap-1"
            onClick={() => handleOpenWizard()}
          >
            <Plus size={16} /> Nuevo Expediente Forense
          </button>
        </div>
      </div>

      {/* Tabs de Navegación */}
      <ul className="nav nav-tabs mb-4 border-bottom border-2" style={{ borderColor: '#CBD5E1' }}>
        <li className="nav-item">
          <button
            className={`nav-link fw-bold ${activeTab === 'dashboard' ? 'active text-navy border-bottom border-3 border-primary' : 'text-muted'}`}
            onClick={() => setActiveTab('dashboard')}
          >
            1. Centro de Mando &amp; KPIs
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link fw-bold ${activeTab === 'casos' ? 'active text-navy border-bottom border-3 border-primary' : 'text-muted'}`}
            onClick={() => setActiveTab('casos')}
          >
            2. Directorio de Casos ({casos.length})
          </button>
        </li>
      </ul>

      {/* ── Tab 1: Dashboard & KPIs ── */}
      {activeTab === 'dashboard' && (
        <div className="d-flex flex-column gap-4">
          {/* Grid de KPIs USWDS */}
          <div className="row g-3">
            <div className="col-12 col-sm-6 col-md-3">
              <div className="usa-card usa-card--gold">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <div className="usa-card__label">Casos en Custodia</div>
                  <FolderOpen size={18} className="text-navy" />
                </div>
                <div className="usa-card__stat mt-1">{stats.casosActivos}</div>
                <div className="small text-success fw-bold mt-1 d-flex align-items-center gap-1">
                  <StatusDot status="online" size={6} /> Hash Chain Inmutable Activo
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-md-3">
              <div className="usa-card usa-card--green">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <div className="usa-card__label">Índice Compliance</div>
                  <ShieldCheck size={18} className="text-success" />
                </div>
                <div className="usa-card__stat mt-1">{stats.cumplimientoGeneral}%</div>
                <div className="progress mt-2" style={{ height: '6px' }}>
                  <div className="progress-bar bg-success" style={{ width: `${stats.cumplimientoGeneral}%` }}></div>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-md-3">
              <div className="usa-card usa-card--red">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <div className="usa-card__label">Alertas Gating</div>
                  <AlertTriangle size={18} className="text-danger" />
                </div>
                <div className="usa-card__stat mt-1">{stats.tareasPendientes}</div>
                <div className="small text-danger fw-bold mt-1">Pasos con revisión pendiente</div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-md-3">
              <div className="usa-card usa-card--muted">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <div className="usa-card__label">Dictámenes Periciales</div>
                  <ClipboardList size={18} className="text-muted" />
                </div>
                <div className="usa-card__stat mt-1">{stats.casosCerrados}</div>
                <div className="small text-muted mt-1">Firmados y listos para PDF / Word</div>
              </div>
            </div>
          </div>

          {/* Apertura Rápida de Expedientes por Tipología */}
          <div className="card p-4 border bg-white rounded-3 shadow-sm">
            <h3 className="h6 fw-bold text-navy text-uppercase mb-3 d-flex align-items-center gap-2">
              <Key size={16} /> Apertura Rápida por Tipología Pericial
            </h3>
            <div className="row g-3">
              {TIPOS_INFO.map((item) => (
                <div className="col-12 col-md-3" key={item.type}>
                  <div
                    onClick={() => handleOpenWizard(item.type as TipoProyecto)}
                    className="p-3 bg-light border rounded-3 cursor-pointer hover-border-primary transition-all h-100 d-flex gap-2"
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="p-2 bg-white rounded border flex-shrink-0" style={{ color: item.color }}>
                      {item.icon}
                    </div>
                    <div>
                      <div className="fw-bold text-navy mb-1" style={{ fontSize: '13px' }}>{item.title}</div>
                      <div className="text-muted small mb-2" style={{ fontSize: '11px', lineHeight: 1.3 }}>{item.desc}</div>
                      <div className="d-flex flex-wrap gap-1">
                        {item.normativas.map(n => (
                          <span key={n} className="usa-tag usa-tag--info" style={{ fontSize: '8.5px' }}>{n}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Últimos registros de auditoría SHA-256 */}
          {auditLogs.length > 0 && (
            <div className="card p-4 border bg-white rounded-3 shadow-sm">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="h6 fw-bold text-navy text-uppercase mb-0 d-flex align-items-center gap-2">
                  <Activity size={16} /> Trazabilidad de Auditoría Reciente (SHA-256 Chain)
                </h3>
                <Link href="/auditoria" className="text-decoration-none fw-bold small text-primary">
                  Ver todo →
                </Link>
              </div>

              <div className="d-flex flex-column gap-2">
                {auditLogs.slice(0, 4).map((log) => (
                  <div
                    key={log.id}
                    className="p-2 rounded-2 bg-light border d-flex align-items-center justify-content-between gap-2"
                  >
                    <div>
                      <div className="fw-bold text-navy" style={{ fontSize: '12px' }}>{log.accion}</div>
                      <div className="text-muted font-monospace" style={{ fontSize: '10px' }}>
                        {log.usuario} · {log.timestamp ? new Date(log.timestamp).toLocaleString() : ''}
                      </div>
                    </div>
                    <span className="usa-tag usa-tag--success font-monospace" style={{ fontSize: '9px' }}>
                      {((log as any).hashActual || (log as any).hashSHA256 || 'SHA-256 OK').substring(0, 16)}...
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Tab 2: Directorio de Casos ── */}
      {activeTab === 'casos' && (
        <div className="card p-4 border bg-white rounded-3 shadow-sm">
          <div className="row g-2 mb-3">
            <div className="col-12 col-md-8">
              <input
                type="text"
                className="form-control"
                placeholder="Buscar por expediente, código, título o perito..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-4">
              <select
                className="form-select"
                value={filterEstado}
                onChange={(e) => setFilterEstado(e.target.value)}
              >
                <option value="todos">Todos los Estados</option>
                <option value="iniciado">Iniciado</option>
                <option value="en_proceso">En Proceso</option>
                <option value="analisis">Análisis</option>
                <option value="cerrado">Cerrado</option>
              </select>
            </div>
          </div>

          <div className="row g-3">
            {casosFiltrados.map((caso) => {
              const meta = ESTADO_LABEL[caso.estado] || ESTADO_LABEL.iniciado;
              return (
                <div key={caso.id} className="col-12 col-sm-6 col-md-4">
                  <div
                    onClick={() => router.push(`/control/seguimiento-compliance?casoId=${caso.id}`)}
                    className="card p-3 border rounded-3 bg-white hover-border-primary cursor-pointer transition-all h-100"
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className={`usa-tag ${meta.tagClass}`}>{meta.label}</span>
                      <span className="font-monospace fw-bold text-primary" style={{ fontSize: '11px' }}>
                        {caso.numeroCaso}
                      </span>
                    </div>
                    <div className="fw-bold text-navy mb-1" style={{ fontSize: '14px' }}>
                      {caso.titulo}
                    </div>
                    <div className="text-muted small mb-2 text-truncate">
                      {caso.descripcion}
                    </div>
                    <div className="progress" style={{ height: '5px' }}>
                      <div className="progress-bar bg-success" style={{ width: `${caso.porcentajeCompletado || 10}%` }}></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Wizard Modal (Bootstrap 5.3+) */}
      {isModalOpen && (
        <NuevoCasoWizard onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}
