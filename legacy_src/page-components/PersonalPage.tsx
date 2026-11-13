'use client';

import React, { useState, useRef, useEffect } from 'react';

import { useAuthStore } from '../store/authStore';
import { useCMSStore } from '../store/cmsStore';
import { platformAPI } from '../db/platformAPI';
import {
  Key, User, Camera, Star, UserPlus, Shield, Award,
  Trophy, Mail, Phone, Briefcase, Check, AlertCircle, Edit, ShieldOff,
  FolderOpen, Trash2, Database, ShieldCheck
} from '../components/atoms/AppleIcon';

import Button from '../components/atoms/Button';
import AdminCompliancePanel from '../components/organisms/AdminCompliancePanel';

const ROLES = [
  { value: 'perito_lider', label: 'Perito Líder' },
  { value: 'perito_asistente', label: 'Perito Asistente' },
  { value: 'fiscal', label: 'Fiscal Adscrito' },
  { value: 'compliance_officer', label: 'Compliance Officer' },
  { value: 'coordinador', label: 'Coordinador Técnico' },
];

export default function PersonalPage() {
  const { user, changePassword, updateProfileImage } = useAuthStore();
  const isAdmin = user?.rol === 'admin' || user?.email === 'julljoll@gmail.com' || user?.email === 'admin@sha256.us';
  const [personal, setPersonal] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'collaborators' | 'admin'>(isAdmin ? 'admin' : 'profile');
  const { casos, deleteCaso, personal: cmsPersonal, addPersonal, updatePersonal } = useCMSStore();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passError, setPassError] = useState<string | null>(null);
  const [passSuccess, setPassSuccess] = useState<string | null>(null);
  const [changingPass, setChangingPass] = useState(false);

  const [isEditing, setIsEditing] = useState<string | number | null>(null);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [ci, setCi] = useState('');
  const [cargo, setCargo] = useState('');
  const [rol, setRol] = useState('perito_asistente');
  const [despacho, setDespacho] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [username, setUsername] = useState('');
  const [passwordColab, setPasswordColab] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadUsers = async () => {
    try {
      if (platformAPI.db?.getUsers) {
        const users = await platformAPI.db.getUsers();
        setPersonal(users.filter((u: any) => u.username !== 'admin'));
      } else {
        setPersonal(cmsPersonal.filter((u: any) => u.username !== 'admin'));
      }
    } catch (e) {
      console.error('Error loading users:', e);
    } finally { setLoading(false); }
  };

  useEffect(() => { loadUsers(); }, [cmsPersonal]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert('La imagen no debe superar los 2MB'); return; }
    const reader = new FileReader();
    reader.onloadend = async () => {
      if (typeof reader.result === 'string') {
        updateProfileImage(reader.result);
        if (platformAPI.db?.updateUser && user?.id) {
          await platformAPI.db.updateUser(user.id, user.id, { profile_image: reader.result });
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError(null); setPassSuccess(null);
    if (!newPassword || !confirmPassword) { setPassError('Por favor completa todos los campos.'); return; }
    if (newPassword !== confirmPassword) { setPassError('Las contraseñas nuevas no coinciden.'); return; }
    if (newPassword.length < 6) { setPassError('La contraseña debe tener al menos 6 caracteres.'); return; }
    setChangingPass(true);
    try {
      const result = await changePassword(newPassword);
      if (result.success) {
        setPassSuccess('¡Contraseña cambiada con éxito!');
        setNewPassword(''); setConfirmPassword('');
      } else { setPassError(result.error || 'Ocurrió un error al cambiar la contraseña.'); }
    } catch (err: any) { setPassError(err.message || 'Error de comunicación.'); }
    finally { setChangingPass(false); }
  };

  const resetForm = () => {
    setNombre(''); setApellido(''); setCi(''); setCargo('');
    setRol('perito_asistente'); setDespacho(''); setEmail(''); setTelefono('');
    setUsername(''); setPasswordColab(''); setIsEditing(null); setShowAddForm(false);
  };

  const handleAddCollaborator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !apellido || !ci || !cargo || !email || (!isEditing && (!username || !passwordColab))) {
      alert('Por favor completa los campos obligatorios'); return;
    }
    const userData: any = { nombre, apellido, ci, cargo, rol, despacho, email, telefono, username, activo: 1 };
    if (passwordColab) userData.password = passwordColab;

    if (platformAPI.db) {
      if (isEditing) {
        await platformAPI.db.updateUser(user?.id || 0, Number(isEditing), userData);
        updatePersonal(isEditing.toString(), {
          nombre, apellido, ci, cargo, rol: rol as any, despacho, email, telefono
        });
      }
      else {
        const res = await platformAPI.db.addUser(user?.id || 0, userData);
        if (!res.success) { alert('Error: ' + res.error); return; }
        addPersonal({
          nombre, apellido, ci, cargo, rol: rol as any, organismo: 'MP', despacho, email, telefono, activo: true, ranking: 0,
        });
      }
      await loadUsers();
    } else {
      if (isEditing) {
        updatePersonal(isEditing.toString(), {
          nombre, apellido, ci, cargo, rol: rol as any, despacho, email, telefono
        });
      } else {
        addPersonal({
          nombre, apellido, ci, cargo, rol: rol as any, organismo: 'MP', despacho, email, telefono, activo: true, ranking: 0,
        });
      }
    }
    resetForm();
  };

  const handleEditClick = (colab: any) => {
    setIsEditing(colab.id); setNombre(colab.nombre || ''); setApellido(colab.apellido || '');
    setCi(colab.ci || ''); setCargo(colab.cargo || ''); setRol(colab.rol || 'perito_asistente');
    setDespacho(colab.despacho || ''); setEmail(colab.email || ''); setTelefono(colab.telefono || '');
    setUsername(colab.username || ''); setPasswordColab(''); setShowAddForm(true);
  };

  const handleToggleActive = async (id: number | string, currentStatus: any) => {
    const nextStatus = (currentStatus === 1 || currentStatus === true) ? false : true;
    if (platformAPI.db?.updateUser && user?.id) {
      await platformAPI.db.updateUser(user.id, Number(id), { activo: nextStatus ? 1 : 0 });
      updatePersonal(id.toString(), { activo: nextStatus });
      await loadUsers();
    } else {
      updatePersonal(id.toString(), { activo: nextStatus });
    }
  };

  return (
    <div className="container-fluid max-w-1280 px-0 pb-5">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 pb-3 mb-4 border-bottom border-2" style={{ borderColor: '#CBD5E1' }}>
        <div>
          <h1 className="h3 fw-bold text-navy mb-1" style={{ color: '#112E51' }}>
            Panel de Personal &amp; Peritos Judiciales
          </h1>
          <p className="text-muted small mb-0">
            Gestión pericial, credenciales de acceso, equipo técnico e indicadores de cumplimiento.
          </p>
        </div>
        {isAdmin && (
          <button
            type="button"
            className="btn btn-warning btn-sm fw-bold text-navy"
            onClick={() => { setShowAddForm(!showAddForm); if (showAddForm) resetForm(); }}
          >
            <UserPlus size={16} /> {showAddForm ? 'Cerrar Formulario' : 'Nuevo Colaborador'}
          </button>
        )}
      </div>

      {/* Navegación por Tabs Bootstrap */}
      <ul className="nav nav-tabs mb-4 border-bottom border-2" style={{ borderColor: '#CBD5E1' }}>
        {isAdmin && (
          <li className="nav-item">
            <button
              className={`nav-link fw-bold ${activeTab === 'admin' ? 'active text-navy border-bottom border-3 border-primary' : 'text-muted'}`}
              onClick={() => setActiveTab('admin')}
            >
              🛡️ Administración &amp; Compliance General
            </button>
          </li>
        )}
        <li className="nav-item">
          <button
            className={`nav-link fw-bold ${activeTab === 'profile' ? 'active text-navy border-bottom border-3 border-primary' : 'text-muted'}`}
            onClick={() => setActiveTab('profile')}
          >
            👤 Mi Perfil Pericial
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link fw-bold ${activeTab === 'collaborators' ? 'active text-navy border-bottom border-3 border-primary' : 'text-muted'}`}
            onClick={() => setActiveTab('collaborators')}
          >
            👥 Peritos &amp; Colaboradores ({personal.length})
          </button>
        </li>
      </ul>

      {/* Tab: Admin */}
      {activeTab === 'admin' && isAdmin && (
        <AdminCompliancePanel />
      )}

      {/* Tab: Profile */}
      {activeTab === 'profile' && (
        <div className="row g-4">
          <div className="col-12 col-md-4">
            <div className="card p-4 text-center border shadow-sm bg-white rounded-3">
              <div className="position-relative d-inline-block mx-auto mb-3">
                {(user as any)?.profileImage || (user as any)?.profile_image ? (
                  <img
                    src={(user as any)?.profileImage || (user as any)?.profile_image}
                    alt={user?.nombre || 'Perfil'}
                    className="rounded-circle border border-2 border-primary object-fit-cover"
                    style={{ width: '96px', height: '96px' }}
                  />
                ) : (
                  <div className="rounded-circle bg-navy text-white fw-bold d-flex align-items-center justify-content-center mx-auto" style={{ width: '96px', height: '96px', fontSize: '36px', backgroundColor: '#112E51' }}>
                    {(user?.nombre || 'P').charAt(0).toUpperCase()}
                  </div>
                )}
                <button
                  type="button"
                  className="btn btn-sm btn-primary rounded-circle position-absolute bottom-0 end-0 p-1"
                  onClick={() => fileInputRef.current?.click()}
                  title="Cambiar Foto"
                >
                  <Camera size={14} />
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="d-none" onChange={handleImageChange} />
              </div>
              <h2 className="h5 fw-bold text-navy mb-1" style={{ color: '#112E51' }}>{user?.nombre} {(user as any)?.apellido || ''}</h2>
              <div className="usa-tag usa-tag--info mx-auto mb-3">{user?.rol || 'Perito Judicial'}</div>
              <div className="text-muted small">C.I.: <span className="fw-bold font-monospace">{(user as any)?.ci || 'V-00.000.000'}</span></div>
              <div className="text-muted small">Email: <span className="fw-bold">{user?.email}</span></div>
            </div>
          </div>

          <div className="col-12 col-md-8">
            <div className="card p-4 border shadow-sm bg-white rounded-3">
              <h3 className="h6 fw-bold text-navy text-uppercase mb-3 d-flex align-items-center gap-2">
                <Key size={18} className="text-primary" /> Cambiar Contraseña de Acceso
              </h3>

              {passError && <div className="alert alert-danger py-2 small mb-3">{passError}</div>}
              {passSuccess && <div className="alert alert-success py-2 small mb-3">{passSuccess}</div>}

              <form onSubmit={handlePasswordSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-uppercase">Nueva Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-uppercase">Confirmar Nueva Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary fw-bold" disabled={changingPass}>
                  {changingPass ? 'Actualizando...' : 'Actualizar Contraseña'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Collaborators */}
      {activeTab === 'collaborators' && (
        <div>
          {/* Formulario Agregar/Editar Colaborador */}
          {showAddForm && (
            <div className="card p-4 border mb-4 bg-white rounded-3 shadow-sm">
              <h3 className="h6 fw-bold text-navy text-uppercase mb-3">
                {isEditing ? 'Editar Perito / Colaborador' : 'Registrar Nuevo Perito / Colaborador'}
              </h3>
              <form onSubmit={handleAddCollaborator}>
                <div className="row g-3">
                  <div className="col-12 col-md-4">
                    <label className="form-label small fw-bold">Nombre *</label>
                    <input type="text" className="form-control" value={nombre} onChange={e => setNombre(e.target.value)} required />
                  </div>
                  <div className="col-12 col-md-4">
                    <label className="form-label small fw-bold">Apellido *</label>
                    <input type="text" className="form-control" value={apellido} onChange={e => setApellido(e.target.value)} required />
                  </div>
                  <div className="col-12 col-md-4">
                    <label className="form-label small fw-bold">C.I. *</label>
                    <input type="text" className="form-control" value={ci} onChange={e => setCi(e.target.value)} required />
                  </div>
                  <div className="col-12 col-md-4">
                    <label className="form-label small fw-bold">Cargo *</label>
                    <input type="text" className="form-control" value={cargo} onChange={e => setCargo(e.target.value)} required />
                  </div>
                  <div className="col-12 col-md-4">
                    <label className="form-label small fw-bold">Rol *</label>
                    <select className="form-select" value={rol} onChange={e => setRol(e.target.value)}>
                      {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </select>
                  </div>
                  <div className="col-12 col-md-4">
                    <label className="form-label small fw-bold">Email *</label>
                    <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-bold">Usuario *</label>
                    <input type="text" className="form-control" value={username} onChange={e => setUsername(e.target.value)} required disabled={!!isEditing} />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-bold">{isEditing ? 'Nueva Contraseña (Opcional)' : 'Contraseña *'}</label>
                    <input type="password" className="form-control" value={passwordColab} onChange={e => setPasswordColab(e.target.value)} required={!isEditing} />
                  </div>
                </div>
                <div className="d-flex gap-2 justify-content-end mt-3">
                  <button type="button" className="btn btn-outline-secondary btn-sm" onClick={resetForm}>Cancelar</button>
                  <button type="submit" className="btn btn-primary btn-sm fw-bold">Guardar Colaborador</button>
                </div>
              </form>
            </div>
          )}

          {/* Grid de Tarjetas de Colaboradores */}
          <div className="row g-3">
            {personal.map(colab => (
              <div className="col-12 col-md-6 col-lg-4" key={colab.id}>
                <div className="card p-3 border shadow-sm bg-white rounded-3 h-100 d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div className="d-flex align-items-center gap-2">
                        <div className="rounded-circle bg-navy text-white fw-bold d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', backgroundColor: '#112E51' }}>
                          {(colab.nombre || 'P').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="fw-bold text-navy" style={{ fontSize: '14px' }}>{colab.nombre} {colab.apellido}</div>
                          <div className="text-muted font-monospace" style={{ fontSize: '10.5px' }}>{colab.ci}</div>
                        </div>
                      </div>
                      <span className={`usa-tag ${colab.activo ? 'usa-tag--success' : 'usa-tag--error'}`}>
                        {colab.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>

                    <div className="text-dark small mb-2">{colab.cargo || 'Perito Forense'}</div>
                    <div className="text-muted small font-monospace">{colab.email}</div>
                  </div>

                  {isAdmin && (
                    <div className="d-flex justify-content-end gap-2 mt-3 pt-2 border-top">
                      <button type="button" className="btn btn-sm btn-outline-primary p-1" onClick={() => handleEditClick(colab)}>
                        <Edit size={14} />
                      </button>
                      <button type="button" className={`btn btn-sm ${colab.activo ? 'btn-outline-danger' : 'btn-outline-success'} p-1`} onClick={() => handleToggleActive(colab.id, colab.activo)}>
                        {colab.activo ? <ShieldOff size={14} /> : <ShieldCheck size={14} />}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
