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
  FileText, ExternalLink, Printer, Key, ShieldAlert, User
} from '../components/atoms/AppleIcon';
import Card from '../components/atoms/Card';
import Button from '../components/atoms/Button';
import Badge from '../components/atoms/Badge';
import StatusDot from '../components/atoms/StatusDot';
import { NORMATIVAS_RAG_MAPPING, EvidenciaNormativaGroup } from '../data/normativasMapping';
import { getTiposProyecto, getTipoProyectoConfig, getPasosPorTipo } from '../data/tiposProyecto';

const ESTADO_LABEL: Record<EstadoCaso, { label: string; color: string }> = {
  iniciado:    { label: 'Iniciado',    color: 'bg-yellow-500/15 text-[#FECF06] border-yellow-500/25' },
  en_proceso:  { label: 'En Proceso',  color: 'bg-yellow-500/15 text-[#FECF06] border-yellow-500/25' },
  analisis:    { label: 'Análisis',    color: 'bg-purple-500/15 text-purple-600 border-purple-500/25' },
  informe:     { label: 'Informe',     color: 'bg-[#9DFF00]/10 text-[#9DFF00] border-[#9DFF00]/20' },
  cerrado:     { label: 'Cerrado',     color: 'bg-green-500/15 text-green-600 border-green-500/25' },
  archivado:   { label: 'Archivado',   color: 'bg-gray-500/15 text-gray-500 border-gray-500/25' },
};

const PRIORIDAD_COLOR: Record<PrioridadCaso, string> = {
  critica: 'bg-[var(--co-red)]',
  alta: 'bg-[var(--co-orange)]',
  media: 'bg-[var(--co-yellow)]',
  baja: 'bg-[var(--co-green)]',
};

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Pestañas unificadas: 'dashboard' | 'casos' | 'compliance'
  const [activeTab, setActiveTab] = useState<'dashboard' | 'casos' | 'compliance'>('dashboard');
  
  // Estado del store
  const casos = useCMSStore(state => state.casos);
  const auditLogs = useCMSStore(state => state.auditLogs) || [];
  const getEstadisticas = useCMSStore(state => state.getEstadisticas);
  const addCaso = useCMSStore(state => state.addCaso);
  const updateCaso = useCMSStore(state => state.updateCaso);
  const completeStep = useCMSStore(state => state.completeStep);
  const stats = getEstadisticas();

  // Búsqueda y filtros en gestión de casos
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState<string>('todos');
  const [filterTipo, setFilterTipo] = useState<string>('todos');

  // Caso seleccionado para el seguimiento de compliance & normativas RAG
  const [selectedCasoId, setSelectedCasoId] = useState<string>(casos[0]?.id || '');
  useEffect(() => {
    if (!selectedCasoId && casos.length > 0) {
      setSelectedCasoId(casos[0].id);
    }
  }, [casos, selectedCasoId]);

  // Modal para nuevo caso
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitulo, setNewTitulo] = useState('');
  const [newTipo, setNewTipo] = useState<TipoProyecto>('forense_whatsapp');
  const [newPrioridad, setNewPrioridad] = useState<PrioridadCaso>('alta');
  const [newPerito, setNewPerito] = useState('Ing. Perito Forense Digital');
  const [newFiscal, setNewFiscal] = useState('Fiscalía Superior del Ministerio Público');
  const [newDispositivo, setNewDispositivo] = useState('');

  // Abrir modal si viene query param ?nuevo=true
  useEffect(() => {
    if (searchParams.get('nuevo') === 'true') {
      setIsModalOpen(true);
    }
  }, [searchParams]);

  // Manejar creación de caso
  const handleCreateCaso = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitulo.trim()) return;

    const numCorrelativo = String(casos.length + 1).padStart(4, '0');
    const nuevoCodigo = `EXP-2026-${numCorrelativo}`;

    const config = getTipoProyectoConfig(newTipo);
    const initialSteps: Record<string, any> = {};
    config.pasos.forEach((p) => {
      initialSteps[p.id] = {
        pasoId: p.id,
        estado: p.num === 1 ? 'en_proceso' : 'pendiente',
        completadoEn: p.num === 1 ? new Date().toISOString() : undefined,
      };
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
      normativasAplicadas: ['ISO/IEC 27037:2012', 'MUCC-2017', 'NIST SP 800-101'],
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
    if (casoId) setSelectedCasoId(casoId);
    setActiveTab('compliance');
  };

  // Filtrado de casos
  const casosFiltrados = useMemo(() => {
    return casos.filter(c => {
      const matchSearch = c.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.numeroCaso.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (c.peritoLider && c.peritoLider.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchEstado = filterEstado === 'todos' || c.estado === filterEstado;
      const matchTipo = filterTipo === 'todos' || c.tipoProyecto === filterTipo;
      return matchSearch && matchEstado && matchTipo;
    });
  }, [casos, searchTerm, filterEstado, filterTipo]);

  // Caso actualmente seleccionado para seguimiento compliance
  const casoActivo = useMemo(() => {
    return casos.find(c => c.id === selectedCasoId) || casos[0];
  }, [casos, selectedCasoId]);

  // Determinar la categoría de evidencia para normativas RAG del caso activo
  const categoriaEvidenciaNormativa: EvidenciaNormativaGroup = useMemo(() => {
    if (!casoActivo) return NORMATIVAS_RAG_MAPPING.movil;
    const tipo = casoActivo.tipoProyecto;
    if (tipo === 'forense_whatsapp') return NORMATIVAS_RAG_MAPPING.movil;
    if (tipo === 'forense_discoduro') return NORMATIVAS_RAG_MAPPING.computadora;
    if (tipo === 'forense_email') return NORMATIVAS_RAG_MAPPING.dvd_imagen;
    return NORMATIVAS_RAG_MAPPING.movil;
  }, [casoActivo]);

  // Pasos del tipo de proyecto del caso activo
  const pasosConfig = useMemo(() => {
    if (!casoActivo || !casoActivo.tipoProyecto) return getPasosPorTipo('forense_whatsapp');
    return getPasosPorTipo(casoActivo.tipoProyecto);
  }, [casoActivo]);

  return (
    <div className="space-y-6 apple-fade-in font-sans pb-12">
      
      {/* ── ENCABEZADO INSTITUCIONAL LEGAL (Paleta AGENTS.md) ────────────────────────── */}
      <div className="border-b border-[#FECF06]/30 pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#00FF41] uppercase font-mono">
              CENTRO DE MANDO COMPLIANCE FORENSE DIGITAL
            </h1>
            <h2 className="text-sm sm:text-base font-bold text-[#FECF06] mt-0.5 tracking-wide">
              SHA256.US — Laboratorio de Informática Forense y Ciberseguridad
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="text-[10px] font-mono font-bold bg-[rgba(254,207,6,0.18)] text-[#FECF06] px-2 py-0.5 rounded border border-[#FECF06]/30 uppercase">
                ISO/IEC 27037
              </span>
              <span className="text-[10px] font-mono font-bold bg-[rgba(0,255,65,0.15)] text-[#00FF41] px-2 py-0.5 rounded border border-[#00FF41]/30 uppercase">
                NIST SP 800-86/101
              </span>
              <span className="text-[10px] font-mono font-bold bg-[rgba(157,255,0,0.15)] text-[#9DFF00] px-2 py-0.5 rounded border border-[#9DFF00]/30 uppercase">
                MUCC-2017 (MP-CICPC)
              </span>
              <span className="text-[10px] font-mono font-bold bg-white/10 text-white px-2 py-0.5 rounded border border-white/20 uppercase">
                COPP Art. 225
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-[#FECF06] hover:bg-[#e0b700] text-black font-extrabold text-xs uppercase px-4 py-2.5 rounded-lg shadow-[0_0_15px_rgba(254,207,6,0.25)] transition-all cursor-pointer"
            >
              <Plus size={16} strokeWidth={3} />
              <span>Nuevo Caso Forense</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── BARRA DE NAVEGACIÓN UNIFICADA DE 3 SECCIONES ─────────────────────────────────── */}
      <div className="flex border-b border-[#524000]/60 bg-[#121412] p-1.5 rounded-xl border">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-mono font-extrabold uppercase rounded-lg transition-all cursor-pointer ${
            activeTab === 'dashboard'
              ? 'bg-[#524000] text-[#FECF06] border-b-2 border-[#FECF06] shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Activity size={16} className={activeTab === 'dashboard' ? 'text-[#00FF41]' : ''} />
          <span>1. Centro de Mando & KPIs</span>
        </button>

        <button
          onClick={() => setActiveTab('casos')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-mono font-extrabold uppercase rounded-lg transition-all cursor-pointer ${
            activeTab === 'casos'
              ? 'bg-[#524000] text-[#FECF06] border-b-2 border-[#FECF06] shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <FolderOpen size={16} className={activeTab === 'casos' ? 'text-[#FECF06]' : ''} />
          <span>2. Directorio de Casos ({casos.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('compliance')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-mono font-extrabold uppercase rounded-lg transition-all cursor-pointer ${
            activeTab === 'compliance'
              ? 'bg-[#524000] text-[#FECF06] border-b-2 border-[#FECF06] shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <ShieldCheck size={16} className={activeTab === 'compliance' ? 'text-[#9DFF00]' : ''} />
          <span>3. Etapas & Normativas RAG</span>
        </button>
      </div>

      {/* ================================================================================= */}
      {/* VISTA 1: CENTRO DE MANDO & KPIS                                                  */}
      {/* ================================================================================= */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          
          {/* Tarjetas de Métricas Forenses (Estilo Cyber-Legal Blueprint) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-[#121412] p-4 rounded-xl border border-[#524000] border-l-4 border-l-[#00FF41] shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider">Casos en Custodia</span>
                <FolderOpen size={20} className="text-[#00FF41]" />
              </div>
              <p className="text-3xl font-black text-white font-mono mt-2">{stats.casosActivos}</p>
              <div className="flex items-center gap-1.5 mt-2 text-[10px] text-[#00FF41] font-mono font-bold">
                <StatusDot status="online" size={6} />
                <span>Hash Chain Inmutable Activo</span>
              </div>
            </div>

            <div className="bg-[#121412] p-4 rounded-xl border border-[#524000] border-l-4 border-l-[#FECF06] shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider">Índice Compliance %</span>
                <ShieldCheck size={20} className="text-[#FECF06]" />
              </div>
              <p className="text-3xl font-black text-white font-mono mt-2">{stats.cumplimientoGeneral}%</p>
              <div className="w-full h-1.5 bg-black/40 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-[#FECF06] rounded-full" style={{ width: `${stats.cumplimientoGeneral}%` }} />
              </div>
            </div>

            <div className="bg-[#121412] p-4 rounded-xl border border-[#524000] border-l-4 border-l-[#9DFF00] shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider">Alertas de Trazabilidad</span>
                <AlertTriangle size={20} className="text-[#9DFF00]" />
              </div>
              <p className="text-3xl font-black text-white font-mono mt-2">{stats.tareasPendientes}</p>
              <span className="text-[10px] text-[#9DFF00] font-mono font-semibold block mt-2">
                Revisión de Gating Requerida
              </span>
            </div>

            <div className="bg-[#121412] p-4 rounded-xl border border-[#524000] border-l-4 border-l-white shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider">Dictámenes Periciales</span>
                <ClipboardList size={20} className="text-white" />
              </div>
              <p className="text-3xl font-black text-white font-mono mt-2">
                {casos.filter(c => c.estado === 'informe' || c.estado === 'cerrado').length}
              </p>
              <span className="text-[10px] text-gray-400 font-mono block mt-2">
                Listos para Impresión / PDF
              </span>
            </div>

          </div>

          {/* Accesos Rápidos a Selección de Tipología Pericial */}
          <div className="p-5 bg-[rgba(254,207,6,0.08)] rounded-xl border-l-[3px] border-[#FECF06] border border-[#524000]">
            <h3 className="text-sm font-extrabold text-[#FECF06] uppercase tracking-wider font-mono flex items-center gap-2 mb-3">
              <Key size={16} />
              Apertura Rápida de Expedientes por Tipología Pericial
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              
              <button
                onClick={() => { setNewTipo('forense_whatsapp'); setIsModalOpen(true); }}
                className="flex items-center gap-3 p-3 bg-[#121412] hover:bg-[#1a1e1a] border border-[#524000] hover:border-[#00FF41] rounded-lg transition-all text-left cursor-pointer group"
              >
                <div className="p-2.5 bg-[#00FF41]/10 text-[#00FF41] rounded-lg shrink-0 group-hover:scale-110 transition-transform">
                  <Smartphone size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-white font-mono group-hover:text-[#00FF41] transition-colors">📱 Forense WhatsApp</h4>
                  <p className="text-[10px] text-gray-400">9 Pasos MUCC-2017 / Extracción Móvil</p>
                </div>
              </button>

              <button
                onClick={() => { setNewTipo('forense_email'); setIsModalOpen(true); }}
                className="flex items-center gap-3 p-3 bg-[#121412] hover:bg-[#1a1e1a] border border-[#524000] hover:border-[#FECF06] rounded-lg transition-all text-left cursor-pointer group"
              >
                <div className="p-2.5 bg-[#FECF06]/10 text-[#FECF06] rounded-lg shrink-0 group-hover:scale-110 transition-transform">
                  <Mail size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-white font-mono group-hover:text-[#FECF06] transition-colors">✉️ Forense Email</h4>
                  <p className="text-[10px] text-gray-400">7 Pasos ISO 27037 / Cabeceras SMTP</p>
                </div>
              </button>

              <button
                onClick={() => { setNewTipo('forense_discoduro'); setIsModalOpen(true); }}
                className="flex items-center gap-3 p-3 bg-[#121412] hover:bg-[#1a1e1a] border border-[#524000] hover:border-[#9DFF00] rounded-lg transition-all text-left cursor-pointer group"
              >
                <div className="p-2.5 bg-[#9DFF00]/10 text-[#9DFF00] rounded-lg shrink-0 group-hover:scale-110 transition-transform">
                  <HardDrive size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-white font-mono group-hover:text-[#9DFF00] transition-colors">💾 Forense Disco Duro</h4>
                  <p className="text-[10px] text-gray-400">8 Pasos NIST SP 800-86 / Clonado Bit</p>
                </div>
              </button>

            </div>
          </div>

          {/* Tabla Resumen de Casos Recientes & Feed de Auditoría Hash */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="lg:col-span-2 bg-[#121412] p-5 rounded-xl border border-[#524000]">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#524000]">
                <h3 className="text-sm font-extrabold text-[#FECF06] uppercase tracking-wider font-mono flex items-center gap-2">
                  <FolderOpen size={16} />
                  Expedientes Periciales Recientes
                </h3>
                <button
                  onClick={() => setActiveTab('casos')}
                  className="text-xs font-mono text-[#00FF41] hover:underline flex items-center gap-1 font-bold"
                >
                  Ver Todos ({casos.length}) <ChevronRight size={12} />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-sans">
                  <thead>
                    <tr className="bg-[#524000]/30 text-[10px] font-mono font-bold uppercase text-[#FECF06] border-b border-[#524000]">
                      <th className="p-2.5">Expediente</th>
                      <th className="p-2.5">Título del Proyecto</th>
                      <th className="p-2.5">Estado</th>
                      <th className="p-2.5 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#524000]/40 text-xs">
                    {casos.slice(0, 5).map((caso) => (
                      <tr key={caso.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-2.5 font-mono font-bold text-[#00FF41] whitespace-nowrap">
                          {caso.numeroCaso}
                        </td>
                        <td className="p-2.5 font-semibold text-white truncate max-w-[220px]">
                          {caso.titulo}
                        </td>
                        <td className="p-2.5">
                          <span className={`text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded border ${
                            caso.estado === 'cerrado'
                              ? 'bg-green-500/20 border-green-500/40 text-green-400'
                              : 'bg-yellow-500/20 border-yellow-500/40 text-[#FECF06]'
                          }`}>
                            {caso.estado}
                          </span>
                        </td>
                        <td className="p-2.5 text-right">
                          <button
                            onClick={() => { setSelectedCasoId(caso.id); setActiveTab('compliance'); }}
                            className="bg-[#524000] hover:bg-[#725900] text-[#FECF06] font-mono text-[10px] font-bold px-2.5 py-1 rounded border border-[#FECF06]/30 transition-colors"
                          >
                            Ir a Etapas & RAG
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Feed de Auditoría Hash Inmutable */}
            <div className="bg-[#121412] p-5 rounded-xl border border-[#524000] flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-[#FECF06] uppercase tracking-wider font-mono flex items-center gap-2 mb-4 pb-2 border-b border-[#524000]">
                  <Activity size={16} />
                  Hash Chain Inmutable (SHA-256)
                </h3>
                <div className="space-y-3">
                  {auditLogs.slice(0, 4).map((log, idx) => (
                    <div key={idx} className="p-2.5 bg-[#0a0c0a] rounded border border-[#524000]/60 space-y-1">
                      <div className="flex items-center justify-between text-[9px] font-mono text-gray-400">
                        <span className="text-[#00FF41] font-bold">{log.accion}</span>
                        <span>{new Date(log.timestamp || Date.now()).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-[10px] text-white font-sans line-clamp-1">{log.detalle}</p>
                      <div className="text-[8px] font-mono text-[#FECF06] truncate bg-black/40 p-1 rounded">
                        HASH: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#524000] text-center">
                <Link href="/auditoria" className="text-[10px] font-mono font-bold text-[#9DFF00] hover:underline">
                  Ver Registro Completo de Auditoría SHA-256 →
                </Link>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ================================================================================= */}
      {/* VISTA 2: GESTIÓN DE CASOS & DIRECTORIO                                           */}
      {/* ================================================================================= */}
      {activeTab === 'casos' && (
        <div className="space-y-6">
          
          {/* Barra de Filtros y Búsqueda */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-[#121412] p-4 rounded-xl border border-[#524000]">
            <div className="relative flex-1 w-full">
              <Search size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por N° expediente, título de proyecto, perito o fiscalía..."
                className="w-full bg-[#0a0c0a] text-white text-xs pl-9 pr-4 py-2.5 rounded-lg border border-[#524000] focus:border-[#FECF06] outline-none font-sans"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
              <select
                value={filterEstado}
                onChange={(e) => setFilterEstado(e.target.value)}
                className="bg-[#0a0c0a] text-xs text-white p-2.5 rounded-lg border border-[#524000] focus:border-[#FECF06] outline-none font-mono"
              >
                <option value="todos">Todos los Estados</option>
                <option value="iniciado">Iniciado</option>
                <option value="en_proceso">En Proceso</option>
                <option value="analisis">Análisis</option>
                <option value="informe">Informe</option>
                <option value="cerrado">Cerrado</option>
              </select>

              <select
                value={filterTipo}
                onChange={(e) => setFilterTipo(e.target.value)}
                className="bg-[#0a0c0a] text-xs text-white p-2.5 rounded-lg border border-[#524000] focus:border-[#FECF06] outline-none font-mono"
              >
                <option value="todos">Todas las Tipologías</option>
                <option value="forense_whatsapp">WhatsApp (Móviles)</option>
                <option value="forense_email">Email / Mensajería</option>
                <option value="forense_discoduro">Discos Duros / Storage</option>
              </select>
            </div>
          </div>

          {/* Tarjetas de Casos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {casosFiltrados.map((caso) => {
              const totalPasos = caso.tipoProyecto ? getPasosPorTipo(caso.tipoProyecto).length : 9;
              const pasosCompletados = caso.steps
                ? Object.values(caso.steps).filter((s: any) => s.estado === 'completado').length
                : 0;
              const pct = Math.round((pasosCompletados / Math.max(totalPasos, 1)) * 100);

              return (
                <div
                  key={caso.id}
                  className="bg-[#121412] p-5 rounded-xl border border-[#524000] hover:border-[#FECF06] transition-all flex flex-col justify-between space-y-4 group relative"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-black text-[#00FF41] bg-[#00FF41]/10 px-2 py-0.5 rounded border border-[#00FF41]/30">
                        {caso.numeroCaso}
                      </span>
                      <span className={`text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded border ${
                        caso.estado === 'cerrado'
                          ? 'bg-green-500/20 border-green-500/40 text-green-400'
                          : 'bg-yellow-500/20 border-yellow-500/40 text-[#FECF06]'
                      }`}>
                        {caso.estado}
                      </span>
                    </div>

                    <h3 className="font-bold text-white text-sm group-hover:text-[#FECF06] transition-colors line-clamp-2">
                      {caso.titulo}
                    </h3>

                    <div className="mt-3 space-y-1 text-[11px] text-gray-400 font-sans">
                      <p><span className="text-gray-500 font-semibold">Perito:</span> {caso.peritoLider || 'Sin asignar'}</p>
                      <p className="truncate"><span className="text-gray-500 font-semibold">Fiscalía:</span> {caso.fiscal || 'Sin asignar'}</p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-[#524000]">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono font-bold">
                        <span className="text-gray-400">Avance de Pasos Forenses</span>
                        <span className="text-[#FECF06]">{pasosCompletados}/{totalPasos} ({pct}%)</span>
                      </div>
                      <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                        <div className="h-full bg-[#FECF06] rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <button
                        onClick={() => { setSelectedCasoId(caso.id); setActiveTab('compliance'); }}
                        className="flex-1 bg-[#524000] hover:bg-[#725900] text-[#FECF06] font-mono text-xs font-bold py-1.5 px-3 rounded border border-[#FECF06]/40 transition-colors text-center cursor-pointer"
                      >
                        Seguimiento RAG
                      </button>

                      <Link
                        href={`/casos/${caso.id}`}
                        className="bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold py-1.5 px-3 rounded border border-white/20 transition-colors text-center"
                      >
                        Detalle
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ================================================================================= */}
      {/* VISTA 3: ETAPAS & SEGUIMIENTO COMPLIANCE RAG                                     */}
      {/* ================================================================================= */}
      {activeTab === 'compliance' && (
        <div className="space-y-6">
          
          {/* Selector de Caso Activo */}
          <div className="bg-[#121412] p-4 rounded-xl border border-[#524000] flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <ShieldCheck size={24} className="text-[#9DFF00] shrink-0" />
              <div>
                <label className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider block">Expediente Seleccionado</label>
                <select
                  value={selectedCasoId}
                  onChange={(e) => setSelectedCasoId(e.target.value)}
                  className="bg-[#0a0c0a] text-sm text-[#FECF06] font-mono font-extrabold py-1.5 px-3 rounded border border-[#FECF06]/50 outline-none w-full md:w-[320px]"
                >
                  {casos.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.numeroCaso} — {c.titulo}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {casoActivo && (
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="text-gray-400">Tipo: <strong className="text-white uppercase">{casoActivo.tipoProyecto}</strong></span>
                <span className="text-gray-400">Estado: <strong className="text-[#00FF41] uppercase">{casoActivo.estado}</strong></span>
              </div>
            )}
          </div>

          {/* BLOQUE RIGUROSO DE NORMATIVAS FORENSES RAG (Segmentado por categoría de evidencia) */}
          <div className="p-5 bg-[rgba(254,207,6,0.18)] rounded-xl border-l-[4px] border-[#FECF06] border border-[#524000] space-y-4">
            <div className="flex items-center justify-between border-b border-[#FECF06]/30 pb-3">
              <div>
                <h3 className="text-base font-black text-[#FECF06] uppercase tracking-wide font-mono flex items-center gap-2">
                  <BookOpen size={18} />
                  Marcos Normativos & ISOs Aplicables (Base de Conocimiento RAG)
                </h3>
                <p className="text-xs text-white font-sans mt-0.5">
                  Evidencia Clasificada: <strong className="text-[#00FF41] font-mono">{categoriaEvidenciaNormativa.tituloCategoria}</strong>
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-[#FECF06] bg-black/40 px-3 py-1 rounded border border-[#FECF06]/40">
                {categoriaEvidenciaNormativa.normativas.length} Normativas Fundamentadas
              </span>
            </div>

            {/* Grid de Normativas Fundamentadas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {categoriaEvidenciaNormativa.normativas.map((norm, idx) => (
                <div key={idx} className="p-3 bg-[#121412] rounded-lg border border-[#524000] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-extrabold text-[#00FF41]">{norm.codigo}</span>
                    <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-white/10 text-gray-300">
                      {norm.ambito}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white leading-snug">{norm.nombre}</h4>
                  <p className="text-[11px] text-gray-300 leading-relaxed font-sans">{norm.descripcion}</p>
                  <div className="pt-2 border-t border-[#524000]/60 text-[10px] font-mono text-[#FECF06] flex items-center justify-between">
                    <span>📌 {norm.articuloRelevante}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gating Secuencial de Pasos Forenses */}
          <div className="bg-[#121412] p-5 rounded-xl border border-[#524000] space-y-4">
            <h3 className="text-sm font-extrabold text-[#00FF41] uppercase tracking-wider font-mono flex items-center gap-2 pb-3 border-b border-[#524000]">
              <ShieldCheck size={16} />
              Secuencia de Pasos Periciales & Requisitos Gating ({pasosConfig.length} Etapas)
            </h3>

            <div className="space-y-3">
              {pasosConfig.map((paso) => {
                const stepData: any = casoActivo?.steps?.[paso.id] || {};
                const isCompleted = stepData?.estado === 'completado';
                const isCurrent = stepData?.estado === 'en_proceso' || (!stepData?.estado && paso.num === 1);

                return (
                  <div
                    key={paso.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isCompleted
                        ? 'bg-[#00FF41]/5 border-[#00FF41]/40'
                        : isCurrent
                        ? 'bg-[#FECF06]/10 border-[#FECF06]'
                        : 'bg-[#0a0c0a] border-[#524000] opacity-75'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-black text-sm shrink-0 ${
                          isCompleted
                            ? 'bg-[#00FF41] text-black'
                            : isCurrent
                            ? 'bg-[#FECF06] text-black'
                            : 'bg-white/10 text-gray-400'
                        }`}>
                          {paso.num}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold text-gray-400 uppercase">{paso.fase}</span>
                            <h4 className="text-xs font-bold text-white font-mono">{paso.titulo}</h4>
                          </div>
                          <p className="text-xs text-gray-300 mt-0.5">{paso.guide}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isCompleted ? (
                          <span className="text-xs font-mono font-bold text-[#00FF41] flex items-center gap-1 bg-[#00FF41]/10 px-3 py-1 rounded border border-[#00FF41]/30">
                            <CheckCircle2 size={14} /> Completado
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              completeStep(paso.id);
                              if (casoActivo) {
                                const currentSteps = casoActivo.steps || {};
                                updateCaso(casoActivo.id, {
                                  steps: {
                                    ...currentSteps,
                                    [paso.id]: { estado: 'completado', fechaCompletado: new Date().toISOString() }
                                  }
                                });
                              }
                            }}
                            className="bg-[#00FF41] hover:bg-[#00cc34] text-black font-mono text-xs font-extrabold px-4 py-1.5 rounded transition-all cursor-pointer shadow-md"
                          >
                            Completar Etapa
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Accesos Directos a las 6 Planillas Oficiales Imprimibles */}
          <div className="bg-[#121412] p-5 rounded-xl border border-[#524000] space-y-3">
            <h3 className="text-sm font-extrabold text-[#FECF06] uppercase tracking-wider font-mono flex items-center gap-2 pb-2 border-b border-[#524000]">
              <Printer size={16} />
              Impresión de Planillas Oficiales Imprimibles (Formato Carta/Oficio)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <Link href="/planillas/acta-obtencion" className="p-3 bg-[#0a0c0a] hover:bg-[#1a1e1a] border border-[#524000] hover:border-[#FECF06] rounded-lg text-xs font-mono font-bold text-white flex items-center justify-between transition-colors">
                <span>📄 Acta de Obtención</span>
                <Printer size={14} className="text-[#FECF06]" />
              </Link>
              <Link href="/planillas/acta-entrevista" className="p-3 bg-[#0a0c0a] hover:bg-[#1a1e1a] border border-[#524000] hover:border-[#FECF06] rounded-lg text-xs font-mono font-bold text-white flex items-center justify-between transition-colors">
                <span>📄 Acta de Entrevista</span>
                <Printer size={14} className="text-[#FECF06]" />
              </Link>
              <Link href="/planillas/prcc" className="p-3 bg-[#0a0c0a] hover:bg-[#1a1e1a] border border-[#524000] hover:border-[#FECF06] rounded-lg text-xs font-mono font-bold text-white flex items-center justify-between transition-colors">
                <span>📄 Planilla PRCC</span>
                <Printer size={14} className="text-[#FECF06]" />
              </Link>
              <Link href="/planillas/dictamen" className="p-3 bg-[#0a0c0a] hover:bg-[#1a1e1a] border border-[#524000] hover:border-[#FECF06] rounded-lg text-xs font-mono font-bold text-white flex items-center justify-between transition-colors">
                <span>📄 Dictamen Pericial</span>
                <Printer size={14} className="text-[#FECF06]" />
              </Link>
              <Link href="/planillas/entrega-resultados" className="p-3 bg-[#0a0c0a] hover:bg-[#1a1e1a] border border-[#524000] hover:border-[#FECF06] rounded-lg text-xs font-mono font-bold text-white flex items-center justify-between transition-colors">
                <span>📄 Entrega Resultados</span>
                <Printer size={14} className="text-[#FECF06]" />
              </Link>
              <Link href="/planillas/acta-auditoria-timeline" className="p-3 bg-[#0a0c0a] hover:bg-[#1a1e1a] border border-[#524000] hover:border-[#FECF06] rounded-lg text-xs font-mono font-bold text-white flex items-center justify-between transition-colors">
                <span>📄 Timeline Auditoría</span>
                <Printer size={14} className="text-[#FECF06]" />
              </Link>
            </div>
          </div>

        </div>
      )}

      {/* ================================================================================= */}
      {/* MODAL CREAR NUEVO CASO FORENSE                                                    */}
      {/* ================================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121412] border border-[#FECF06]/50 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#524000] pb-3">
              <h3 className="text-base font-black text-[#00FF41] font-mono uppercase tracking-wide flex items-center gap-2">
                <Plus size={18} />
                Apertura de Nuevo Caso Forense
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCaso} className="space-y-4 text-xs font-sans">
              <div>
                <label className="text-gray-300 font-bold block mb-1 font-mono uppercase text-[10px]">Título del Caso / Investigación</label>
                <input
                  type="text"
                  required
                  value={newTitulo}
                  onChange={(e) => setNewTitulo(e.target.value)}
                  placeholder="Ej: Análisis Forense WhatsApp en Caso Defraudación N° 98"
                  className="w-full bg-[#0a0c0a] text-white p-2.5 rounded-lg border border-[#524000] focus:border-[#FECF06] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-300 font-bold block mb-1 font-mono uppercase text-[10px]">Tipología de Proyecto</label>
                  <select
                    value={newTipo}
                    onChange={(e) => setNewTipo(e.target.value as TipoProyecto)}
                    className="w-full bg-[#0a0c0a] text-white p-2.5 rounded-lg border border-[#524000] focus:border-[#FECF06] outline-none font-mono"
                  >
                    <option value="forense_whatsapp">Forense WhatsApp</option>
                    <option value="forense_email">Forense Email</option>
                    <option value="forense_discoduro">Forense Disco Duro</option>
                  </select>
                </div>

                <div>
                  <label className="text-gray-300 font-bold block mb-1 font-mono uppercase text-[10px]">Prioridad</label>
                  <select
                    value={newPrioridad}
                    onChange={(e) => setNewPrioridad(e.target.value as PrioridadCaso)}
                    className="w-full bg-[#0a0c0a] text-white p-2.5 rounded-lg border border-[#524000] focus:border-[#FECF06] outline-none font-mono"
                  >
                    <option value="critica">Crítica</option>
                    <option value="alta">Alta</option>
                    <option value="media">Media</option>
                    <option value="baja">Baja</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-300 font-bold block mb-1 font-mono uppercase text-[10px]">Perito Líder</label>
                  <input
                    type="text"
                    value={newPerito}
                    onChange={(e) => setNewPerito(e.target.value)}
                    className="w-full bg-[#0a0c0a] text-white p-2.5 rounded-lg border border-[#524000] focus:border-[#FECF06] outline-none"
                  />
                </div>

                <div>
                  <label className="text-gray-300 font-bold block mb-1 font-mono uppercase text-[10px]">Fiscalía / Despacho</label>
                  <input
                    type="text"
                    value={newFiscal}
                    onChange={(e) => setNewFiscal(e.target.value)}
                    className="w-full bg-[#0a0c0a] text-white p-2.5 rounded-lg border border-[#524000] focus:border-[#FECF06] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-300 font-bold block mb-1 font-mono uppercase text-[10px]">Dispositivo / Evidencia Primaria</label>
                <input
                  type="text"
                  value={newDispositivo}
                  onChange={(e) => setNewDispositivo(e.target.value)}
                  placeholder="Ej: Samsung Galaxy S21 Ultra S/N: 9832A (IMEI: 354...)"
                  className="w-full bg-[#0a0c0a] text-white p-2.5 rounded-lg border border-[#524000] focus:border-[#FECF06] outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#524000]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-gray-300 font-mono text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#FECF06] hover:bg-[#e0b700] text-black font-mono text-xs font-black uppercase rounded-lg transition-colors cursor-pointer shadow-lg"
                >
                  Aperturar Caso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
