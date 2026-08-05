'use client';

import React, { useState, useEffect } from 'react';

import { useAuthStore } from '../../store/authStore';
import { useCMSStore, CasoCMS, RolPersonal } from '../../store/cmsStore';
import { useAuditStore } from '../../store/auditStore';
import { platformAPI } from '../../db/platformAPI';
import { indexedDBStorage } from '../../db/indexedDB';
import Button from '../atoms/Button';
import {
  Shield, Trash2, UserPlus, Database, ShieldAlert,
  Search, Key, ShieldCheck, AlertTriangle, RefreshCw
} from '../atoms/AppleIcon';

const ROLES_FORENSES: { value: RolPersonal; label: string; desc: string; color: string }[] = [
  { value: 'perito_lider', label: 'Perito Líder Informático', desc: 'ISO 27037/27042 — Dictamen pericial y custodia', color: '#D9A700' },
  { value: 'perito_asistente', label: 'Perito Asistente de Extracción', desc: 'Adquisición física/lógica IPED & FTK', color: '#008837' },
  { value: 'fiscal', label: 'Fiscal Adscrito MP', desc: 'Control de legalidad COPP y orden de allanamiento', color: '#005EA2' },
  { value: 'compliance_officer', label: 'Compliance Officer Legal-Forense', desc: 'Auditoría inmutable y verificación de cadena de custodia', color: '#005EA2' },
  { value: 'coordinador', label: 'Coordinador Técnico de Lab', desc: 'Gestión de laboratorio y asignación de expedientes', color: '#112E51' },
  { value: 'admin', label: 'Administrador Global Plataforma', desc: 'Acceso total: Borrado de BD, usuarios y políticas', color: '#D9381E' },
];

export default function AdminCompliancePanel() {
  const { user } = useAuthStore();
  const { casos, personal, deleteCaso, deletePersonal, addPersonal, updatePersonal } = useCMSStore();
  const auditLogs = useAuditStore((state) => state.logs);
  const loadAuditLogs = useAuditStore((state) => state.loadLogs);

  const [activeTab, setActiveTab] = useState<'purge_cases' | 'user_rbac' | 'db_health'>('purge_cases');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modales de Confirmación de Borrado de Caso
  const [casoToDelete, setCasoToDelete] = useState<CasoCMS | null>(null);
  const [confirmTextCaso, setConfirmTextCaso] = useState('');
  const [deletingCaso, setDeletingCaso] = useState(false);

  // Modales de Confirmación de Borrado de Usuario
  const [userToDelete, setUserToDelete] = useState<any | null>(null);
  const [confirmTextUser, setConfirmTextUser] = useState('');
  const [deletingUser, setDeletingUser] = useState(false);

  // Estado para crear/editar usuario
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | number | null>(null);
  const [formNombre, setFormNombre] = useState('');
  const [formApellido, setFormApellido] = useState('');
  const [formCi, setFormCi] = useState('');
  const [formCargo, setFormCargo] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formUsername, setFormUsername] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formDespacho, setFormDespacho] = useState('');
  const [formTelefono, setFormTelefono] = useState('');
  const [formRol, setFormRol] = useState<RolPersonal>('perito_asistente');

  // Estado de Base de Datos
  const [dbStats, setDbStats] = useState({ indexedDBCases: 0, indexedDBUsers: 0, indexedDBLogs: 0 });

  useEffect(() => {
    loadAuditLogs();
    async function loadStats() {
      try {
        const casosCount = await indexedDBStorage.getCount('casos').catch(() => 0);
        const usersCount = await indexedDBStorage.getCount('personal').catch(() => 0);
        const logsCount = await indexedDBStorage.getCount('audit_logs').catch(() => 0);
        setDbStats({ indexedDBCases: casosCount, indexedDBUsers: usersCount, indexedDBLogs: logsCount });
      } catch (e) {
        console.error('Error fetching DB stats:', e);
      }
    }
    loadStats();
  }, [casos.length, personal.length]);

  // Handler para Eliminar Caso
  const handleExecuteDeleteCaso = async () => {
    if (!casoToDelete) return;
    if (confirmTextCaso.trim().toUpperCase() !== 'BORRAR') {
      alert('Debes escribir la palabra BORRAR para confirmar.');
      return;
    }
    setDeletingCaso(true);
    try {
      await deleteCaso(casoToDelete.id);
      setCasoToDelete(null);
      setConfirmTextCaso('');
    } catch (err) {
      console.error('Error al borrar caso:', err);
      alert('Ocurrió un error al intentar eliminar el caso.');
    } finally {
      setDeletingCaso(false);
    }
  };

  // Handler para Eliminar Usuario
  const handleExecuteDeleteUser = async () => {
    if (!userToDelete) return;
    if (confirmTextUser.trim().toUpperCase() !== 'BORRAR') {
      alert('Debes escribir la palabra BORRAR para confirmar.');
      return;
    }
    if (userToDelete.email === user?.email || String(userToDelete.id) === String(user?.id)) {
      alert('No puedes eliminar la cuenta de administrador que está en uso.');
      return;
    }
    setDeletingUser(true);
    try {
      await deletePersonal(userToDelete.id.toString());
      setUserToDelete(null);
      setConfirmTextUser('');
    } catch (err) {
      console.error('Error al borrar usuario:', err);
      alert('Ocurrió un error al eliminar el usuario.');
    } finally {
      setDeletingUser(false);
    }
  };

  // Guardar o Editar Usuario
  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNombre || !formApellido || !formCi || !formEmail || (!editingUserId && (!formUsername || !formPassword))) {
      alert('Por favor completa todos los campos obligatorios.');
      return;
    }

    const userData: any = {
      nombre: formNombre,
      apellido: formApellido,
      ci: formCi,
      cargo: formCargo,
      email: formEmail,
      username: formUsername,
      despacho: formDespacho,
      telefono: formTelefono,
      rol: formRol,
      activo: 1,
    };
    if (formPassword) userData.password = formPassword;

    try {
      if (editingUserId) {
        if (platformAPI.db?.updateUser) {
          await platformAPI.db.updateUser(user?.id || 0, Number(editingUserId), userData);
        }
        updatePersonal(editingUserId.toString(), userData);
      } else {
        if (platformAPI.db?.addUser) {
          await platformAPI.db.addUser(user?.id || 0, userData);
        }
        addPersonal({
          ...userData,
          organismo: 'MP',
          activo: true,
          ranking: 5,
        });
      }
      setShowUserModal(false);
      resetUserForm();
    } catch (err) {
      console.error('Error saving user:', err);
      alert('Ocurrió un error al guardar los datos del usuario.');
    }
  };

  const resetUserForm = () => {
    setEditingUserId(null);
    setFormNombre('');
    setFormApellido('');
    setFormCi('');
    setFormCargo('');
    setFormEmail('');
    setFormUsername('');
    setFormPassword('');
    setFormDespacho('');
    setFormTelefono('');
    setFormRol('perito_asistente');
  };

  const handleEditUserClick = (u: any) => {
    setEditingUserId(u.id);
    setFormNombre(u.nombre || '');
    setFormApellido(u.apellido || '');
    setFormCi(u.ci || '');
    setFormCargo(u.cargo || '');
    setFormEmail(u.email || '');
    setFormUsername(u.username || '');
    setFormPassword('');
    setFormDespacho(u.despacho || '');
    setFormTelefono(u.telefono || '');
    setFormRol(u.rol || 'perito_asistente');
    setShowUserModal(true);
  };

  // Casos filtrados para purgado
  const casosFiltrados = casos.filter(c =>
    c.numeroCaso.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.peritoLider && c.peritoLider.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="d-flex flex-column gap-4 pb-5">
      {/* Banner de Autorización Crítica */}
      <div className="usa-alert usa-alert--error mb-2">
        <div className="usa-alert__heading d-flex align-items-center gap-2">
          <ShieldAlert size={18} className="text-danger" />
          🔒 PANEL DE ADMINISTRACIÓN GLOBAL &amp; GOBERNANZA DE DATOS FORENSES
        </div>
        <div className="small">
          Acceso reservado para el Administrador de Plataforma y Compliance Officer. Todas las acciones ejecutadas en esta sección son irreversibles y quedan firmadas inmutablemente con hash SHA-256 en la auditoría del sistema.
        </div>
      </div>

      {/* Tabs Principales de Gobernanza */}
      <ul className="nav nav-tabs border-bottom border-2" style={{ borderColor: '#CBD5E1' }}>
        <li className="nav-item">
          <button
            className={`nav-link fw-bold ${activeTab === 'purge_cases' ? 'active text-navy border-bottom border-3 border-primary' : 'text-muted'}`}
            onClick={() => setActiveTab('purge_cases')}
          >
            🗑️ Purgado de Expedientes ({casos.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link fw-bold ${activeTab === 'user_rbac' ? 'active text-navy border-bottom border-3 border-primary' : 'text-muted'}`}
            onClick={() => setActiveTab('user_rbac')}
          >
            👥 Gestión RBAC &amp; Personal ({personal.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link fw-bold ${activeTab === 'db_health' ? 'active text-navy border-bottom border-3 border-primary' : 'text-muted'}`}
            onClick={() => setActiveTab('db_health')}
          >
            🛢️ Diagnóstico de Base de Datos
          </button>
        </li>
      </ul>

      {/* ── PESTAÑA 1: PURGADO Y ELIMINACIÓN DE CASOS ── */}
      {activeTab === 'purge_cases' && (
        <div className="d-flex flex-column gap-3">
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2">
            <h2 className="h5 fw-bold text-navy mb-0" style={{ color: '#112E51' }}>
              Purga de Expedientes &amp; Eliminación Permanente
            </h2>
            <div className="input-group" style={{ maxWidth: '320px' }}>
              <span className="input-group-text bg-white border-end-0 text-muted">
                <Search size={16} />
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Buscar expediente por código o título..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="usa-alert usa-alert--info">
            <div className="usa-alert__heading">Advertencia de Seguridad Ambiental</div>
            La eliminación de un caso borra de forma permanente todas sus evidencias registradas, tareas, actas y registros de seguimiento en la base de datos local.
          </div>

          {/* Tabla USWDS (.usa-table) */}
          <div className="table-responsive rounded-3 border bg-white shadow-sm">
            <table className="usa-table table table-hover mb-0 align-middle">
              <thead>
                <tr>
                  <th scope="col">CÓDIGO CASO</th>
                  <th scope="col">TÍTULO / DESCRIPCIÓN</th>
                  <th scope="col">TIPO PROYECTO</th>
                  <th scope="col">PERITO LÍDER</th>
                  <th scope="col">ESTADO</th>
                  <th scope="col" className="text-center">ACCIONES ADMIN</th>
                </tr>
              </thead>
              <tbody>
                {casosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-muted">
                      No se encontraron casos registrados en la base de datos.
                    </td>
                  </tr>
                ) : (
                  casosFiltrados.map((caso) => (
                    <tr key={caso.id}>
                      <td className="font-monospace fw-bold text-primary" style={{ fontSize: '12px' }}>
                        {caso.numeroCaso}
                      </td>
                      <td>
                        <div className="fw-bold text-navy" style={{ fontSize: '13.5px' }}>{caso.titulo}</div>
                        <div className="text-muted small">Exp: {caso.expediente || 'S/N'}</div>
                      </td>
                      <td>
                        <span className="usa-tag usa-tag--info">
                          {caso.tipoProyecto === 'forense_whatsapp' ? 'WhatsApp' : caso.tipoProyecto === 'forense_email' ? 'Email' : 'Disco Duro'}
                        </span>
                      </td>
                      <td className="small text-muted">
                        {caso.peritoLider || 'Sin Perito Asignado'}
                      </td>
                      <td>
                        <span className={`usa-tag ${caso.estado === 'cerrado' ? 'usa-tag--success' : 'usa-tag--info'}`}>
                          {caso.estado.toUpperCase()}
                        </span>
                      </td>
                      <td className="text-center">
                        <button
                          type="button"
                          className="btn btn-danger btn-sm fw-bold d-inline-flex align-items-center gap-1"
                          onClick={() => { setCasoToDelete(caso); setConfirmTextCaso(''); }}
                        >
                          <Trash2 size={14} /> ELIMINAR CASO
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── PESTAÑA 2: CONTROL DE USUARIOS Y ROLES FORENSES ── */}
      {activeTab === 'user_rbac' && (
        <div className="d-flex flex-column gap-4">
          {/* Métricas por Rol */}
          <div className="row g-3">
            {ROLES_FORENSES.map((rolItem) => {
              const count = personal.filter(p => p.rol === rolItem.value).length;
              return (
                <div className="col-12 col-sm-6 col-md-4" key={rolItem.value}>
                  <div className="card p-3 border shadow-sm bg-white rounded-3 h-100">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-bold small text-uppercase font-monospace" style={{ color: rolItem.color }}>
                        {rolItem.label}
                      </span>
                      <span className="badge bg-secondary text-dark fw-bold">{count}</span>
                    </div>
                    <div className="text-muted small">{rolItem.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <h3 className="h5 fw-bold text-navy mb-0" style={{ color: '#112E51' }}>
              Directorio Oficial de Personal &amp; Peritos Forenses
            </h3>
            <button
              type="button"
              className="btn btn-primary btn-sm fw-bold d-inline-flex align-items-center gap-1"
              onClick={() => { resetUserForm(); setShowUserModal(true); }}
            >
              <UserPlus size={16} /> CREAR USUARIO / PERITO
            </button>
          </div>

          {/* Tabla de Usuarios USWDS */}
          <div className="table-responsive rounded-3 border bg-white shadow-sm">
            <table className="usa-table table table-hover mb-0 align-middle">
              <thead>
                <tr>
                  <th scope="col">USUARIO / PERITO</th>
                  <th scope="col">CÉDULA (CI)</th>
                  <th scope="col">ROL TÉCNICO FORENSE</th>
                  <th scope="col">CARGO / DESPACHO</th>
                  <th scope="col">ESTADO</th>
                  <th scope="col" className="text-center">ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {personal.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-muted">
                      No hay colaboradores ni usuarios adicionales registrados.
                    </td>
                  </tr>
                ) : (
                  personal.map((u) => {
                    const rolMeta = ROLES_FORENSES.find(r => r.value === u.rol) || ROLES_FORENSES[1];
                    return (
                      <tr key={u.id}>
                        <td>
                          <div className="fw-bold text-navy">{u.nombre} {u.apellido}</div>
                          <div className="text-muted font-monospace small">{u.email}</div>
                        </td>
                        <td className="font-monospace small">{u.ci || 'V-00.000.000'}</td>
                        <td>
                          <span className="usa-tag usa-tag--info" style={{ color: rolMeta.color }}>
                            {rolMeta.label}
                          </span>
                        </td>
                        <td className="small">{u.cargo || 'Perito Judicial'}</td>
                        <td>
                          <span className={`usa-tag ${u.activo ? 'usa-tag--success' : 'usa-tag--error'}`}>
                            {u.activo ? 'ACTIVO' : 'INACTIVO'}
                          </span>
                        </td>
                        <td className="text-center">
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm p-1"
                            onClick={() => { setUserToDelete(u); setConfirmTextUser(''); }}
                            title="Eliminar usuario"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── PESTAÑA 3: DIAGNÓSTICO DE BASE DE DATOS ── */}
      {activeTab === 'db_health' && (
        <div className="d-flex flex-column gap-3">
          <h2 className="h5 fw-bold text-navy mb-0" style={{ color: '#112E51' }}>
            Estado y Rendimiento de Base de Datos Local (IndexedDB)
          </h2>

          <div className="row g-3">
            <div className="col-12 col-md-4">
              <div className="usa-card usa-card--gold">
                <div className="usa-card__label">Expedientes en LocalStorage/IndexedDB</div>
                <div className="usa-card__stat mt-1">{dbStats.indexedDBCases}</div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="usa-card usa-card--green">
                <div className="usa-card__label">Usuarios &amp; Peritos Registrados</div>
                <div className="usa-card__stat mt-1">{dbStats.indexedDBUsers}</div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="usa-card usa-card--lime">
                <div className="usa-card__label">Logs de Auditoría SHA-256</div>
                <div className="usa-card__stat mt-1">{dbStats.indexedDBLogs}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmar Borrado de Caso */}
      {casoToDelete && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-danger">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title fw-bold">⚠ Confirmar Purga de Caso</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setCasoToDelete(null)}></button>
              </div>
              <div className="modal-body">
                <p className="text-dark">
                  ¿Está seguro de eliminar permanentemente el expediente <strong>{casoToDelete.numeroCaso}</strong>?
                </p>
                <div className="mb-3">
                  <label className="form-label small fw-bold">Escriba la palabra BORRAR para confirmar:</label>
                  <input
                    type="text"
                    className="form-control text-uppercase"
                    value={confirmTextCaso}
                    onChange={(e) => setConfirmTextCaso(e.target.value)}
                    placeholder="BORRAR"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setCasoToDelete(null)}>Cancelar</button>
                <button
                  type="button"
                  className="btn btn-danger btn-sm fw-bold"
                  disabled={confirmTextCaso.trim().toUpperCase() !== 'BORRAR' || deletingCaso}
                  onClick={handleExecuteDeleteCaso}
                >
                  {deletingCaso ? 'Eliminando...' : 'Eliminar Permanentemente'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
