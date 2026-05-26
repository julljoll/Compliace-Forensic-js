import React, { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useCMSStore } from '../store/cmsStore';
import { getPasosPorTipo } from '../data/tiposProyecto';
import { 
  Key, User, Camera, Star, UserPlus, Shield, Award, 
  Trophy, Mail, Phone, Briefcase, Check, AlertCircle, Edit, ShieldOff,
  FolderOpen, Trash2, Database, ShieldCheck
} from '../components/atoms/AppleIcon';

const ROLES = [
  { value: 'perito_lider', label: 'Perito Líder' },
  { value: 'perito_asistente', label: 'Perito Asistente' },
  { value: 'fiscal', label: 'Fiscal Adscrito' },
  { value: 'compliance_officer', label: 'Compliance Officer' },
  { value: 'coordinador', label: 'Coordinador Técnico' },
];

export default function PersonalPage() {
  // Auth Store
  const { user, changePassword, updateProfileImage } = useAuthStore();
  
  // Local States para DB
  const [personal, setPersonal] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // States
  const [activeTab, setActiveTab] = useState<'profile' | 'collaborators' | 'projects'>('profile');
  
  // CMS Store for Projects Tab
  const { casos, deleteCaso } = useCMSStore();
  
  // Password Change State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passError, setPassError] = useState<string | null>(null);
  const [passSuccess, setPassSuccess] = useState<string | null>(null);
  const [changingPass, setChangingPass] = useState(false);

  // Form State (Crear/Editar)
  const [isEditing, setIsEditing] = useState<number | null>(null);
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

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      if (window.electronAPI?.db?.getUsers) {
        const users = await window.electronAPI.db.getUsers();
        // Filtrar administradores si no queremos listarlos con los colaboradores (opcional)
        setPersonal(users.filter((u: any) => u.username !== 'admin'));
      } else {
        // Fallback local dev
        setPersonal([]);
      }
    } catch (e) {
      console.error('Error loading users:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('La imagen no debe superar los 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      if (typeof reader.result === 'string') {
        updateProfileImage(reader.result);
        if (window.electronAPI?.db?.updateUser && user?.id) {
           await window.electronAPI.db.updateUser(user.id, user.id, { profile_image: reader.result });
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError(null);
    setPassSuccess(null);

    if (!newPassword || !confirmPassword) {
      setPassError('Por favor completa todos los campos.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassError('Las contraseñas nuevas no coinciden.');
      return;
    }

    if (newPassword.length < 6) {
      setPassError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setChangingPass(true);
    try {
      const result = await changePassword(newPassword);
      if (result.success) {
        setPassSuccess('¡Contraseña cambiada con éxito!');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPassError(result.error || 'Ocurrió un error al cambiar la contraseña.');
      }
    } catch (err: any) {
      setPassError(err.message || 'Error de comunicación.');
    } finally {
      setChangingPass(false);
    }
  };

  const resetForm = () => {
    setNombre('');
    setApellido('');
    setCi('');
    setCargo('');
    setRol('perito_asistente');
    setDespacho('');
    setEmail('');
    setTelefono('');
    setUsername('');
    setPasswordColab('');
    setIsEditing(null);
    setShowAddForm(false);
  };

  const handleAddCollaborator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !apellido || !ci || !cargo || !email || (!isEditing && (!username || !passwordColab))) {
      alert('Por favor completa los campos obligatorios');
      return;
    }

    const userData: any = {
      nombre, apellido, ci, cargo, rol, despacho, email, telefono, username, 
    };
    
    if (passwordColab) {
      userData.password = passwordColab;
    }

    if (window.electronAPI?.db) {
      if (isEditing) {
        await window.electronAPI.db.updateUser(user?.id || 0, isEditing, userData);
      } else {
        const res = await window.electronAPI.db.addUser(user?.id || 0, userData);
        if (!res.success) {
          alert('Error: ' + res.error);
          return;
        }
      }
      await loadUsers();
    }
    
    resetForm();
  };

  const handleEditClick = (colab: any) => {
    setIsEditing(colab.id);
    setNombre(colab.nombre || '');
    setApellido(colab.apellido || '');
    setCi(colab.ci || '');
    setCargo(colab.cargo || '');
    setRol(colab.rol || 'perito_asistente');
    setDespacho(colab.despacho || '');
    setEmail(colab.email || '');
    setTelefono(colab.telefono || '');
    setUsername(colab.username || '');
    setPasswordColab('');
    setShowAddForm(true);
  };

  const handleToggleActive = async (id: number, currentStatus: number) => {
    if (window.electronAPI?.db?.updateUser && user?.id) {
      await window.electronAPI.db.updateUser(user.id, id, { activo: currentStatus === 1 ? 0 : 1 });
      await loadUsers();
    }
  };

  const handleSetRanking = async (id: number, stars: number) => {
    if (window.electronAPI?.db?.updateUser && user?.id) {
      await window.electronAPI.db.updateUser(user.id, id, { ranking: stars });
      await loadUsers();
    }
  };

  const topCollaborator = personal.length > 0 
    ? [...personal].sort((a, b) => (b.ranking || 0) - (a.ranking || 0))[0] 
    : null;

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-fluent-border pb-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Panel de Personal</h1>
          <p className="text-sm text-fluent-text-muted mt-1 font-medium">
            Seguridad de tu perfil, gestión de colaboradores y métricas de desempeño del equipo.
          </p>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex bg-fluent-surfaceActive p-1 rounded-lg border border-fluent-border">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-2 ${
              activeTab === 'profile' 
                ? 'bg-fluent-accent text-fluent-accent-fg shadow-md' 
                : 'text-fluent-text-muted hover:text-white'
            }`}
          >
            <User size={14} />
            Mi Perfil (Admin)
          </button>
          <button 
            onClick={() => setActiveTab('collaborators')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-2 ${
              activeTab === 'collaborators' 
                ? 'bg-fluent-accent text-fluent-accent-fg shadow-md' 
                : 'text-fluent-text-muted hover:text-white'
            }`}
          >
            <UserPlus size={14} />
            Colaboradores ({personal.length})
          </button>
          <button 
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-2 ${
              activeTab === 'projects' 
                ? 'bg-[#FECF06] text-black shadow-md' 
                : 'text-fluent-text-muted hover:text-white'
            }`}
          >
            <FolderOpen size={14} />
            Mis Proyectos ({casos.length})
          </button>
        </div>
      </div>

      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="fluent-mica p-6 rounded-xl border border-fluent-border lg:col-span-1 flex flex-col items-center text-center justify-center relative">
            <div className="absolute top-4 right-4 bg-fluent-accent/15 border border-fluent-accent/30 text-fluent-accent px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">
              {user?.rol || 'Usuario'}
            </div>

            <div className="relative group w-32 h-32 mb-6">
              <img 
                src={user?.profileImage || "https://ik.imagekit.io/lvxdbpx6l/APP%20FORENSICS/avatar.png"} 
                alt="Profile" 
                className="w-full h-full object-cover rounded-full border-4 border-fluent-border bg-white/[0.03]"
              />
              
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-xs font-bold text-white gap-1"
              >
                <Camera size={18} />
                <span>Cambiar Foto</span>
              </button>
              
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            <h2 className="text-xl font-bold text-white">{user?.nombre || 'Usuario'}</h2>
            <p className="text-xs text-fluent-text-muted font-mono mt-1">@{user?.username || 'admin'}</p>
            
            <div className="w-full border-t border-fluent-border mt-6 pt-4 text-left space-y-3">
              <div className="flex items-center gap-2.5 text-xs">
                <Shield size={14} className="text-fluent-accent" />
                <span className="font-semibold text-white">Rol del Sistema:</span>
                <span className="text-fluent-text-muted font-mono">{ROLES.find(r => r.value === user?.rol)?.label || user?.rol || 'Administrador'}</span>
              </div>
            </div>
          </div>

          <div className="fluent-mica p-6 rounded-xl border border-fluent-border lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3 border-b border-fluent-border pb-4">
              <div className="w-8 h-8 rounded-lg bg-fluent-accent/10 border border-fluent-accent/20 flex items-center justify-center text-fluent-accent">
                <Key size={16} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Cambiar Clave de Acceso</h3>
                <p className="text-xs text-fluent-text-muted font-medium">Actualiza tu contraseña para asegurar tu cuenta de peritaje.</p>
              </div>
            </div>

            {passError && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3.5 text-xs text-red-300 flex items-center gap-2.5">
                <AlertCircle size={16} />
                <span>{passError}</span>
              </div>
            )}

            {passSuccess && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3.5 text-xs text-green-300 flex items-center gap-2.5">
                <Check size={16} />
                <span>{passSuccess}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="fluent-label">Nueva Contraseña</label>
                  <input 
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="fluent-input"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="fluent-label">Confirmar Nueva Contraseña</label>
                  <input 
                    type="password"
                    placeholder="Repite la contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="fluent-input"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button 
                  type="submit" 
                  disabled={changingPass}
                  className="fluent-btn fluent-btn-primary px-6"
                >
                  {changingPass ? 'Actualizando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>

        </div>
      )}

      {activeTab === 'collaborators' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="space-y-6 lg:col-span-1">
            
            {topCollaborator ? (
              <div className="fluent-mica p-6 rounded-xl border border-fluent-accent/30 relative overflow-hidden bg-gradient-to-br from-fluent-bg to-fluent-accent/5">
                <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-fluent-accent/5 rounded-full blur-xl"></div>
                <div className="absolute top-4 right-4 text-fluent-accent">
                  <Trophy size={20} strokeWidth={2.5} className="drop-shadow-[0_2px_4px_rgba(254,207,6,0.3)] animate-pulse" />
                </div>
                
                <h4 className="text-xs font-black uppercase text-fluent-accent tracking-wider mb-4 flex items-center gap-1.5">
                  Colaborador Destacado
                </h4>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-white/[0.03] border-2 border-fluent-accent flex items-center justify-center font-bold text-white text-lg">
                    {topCollaborator.nombre?.charAt(0)}{topCollaborator.apellido?.charAt(0)}
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-base leading-tight">
                      {topCollaborator.nombre} {topCollaborator.apellido}
                    </h5>
                    <p className="text-xs text-fluent-text-muted mt-0.5">{topCollaborator.cargo}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-fluent-accent mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      fill={i < (topCollaborator.ranking || 0) ? "currentColor" : "none"} 
                    />
                  ))}
                  <span className="text-xs font-bold text-white ml-1.5">({topCollaborator.ranking || 0}/5 Estrellas)</span>
                </div>
                
                <p className="text-xs text-fluent-text-muted leading-relaxed italic">
                  Actualmente liderando la tabla de valoración de peritos en procesos activos de preservación forense SHA256.US.
                </p>
              </div>
            ) : (
              <div className="fluent-mica p-6 rounded-xl border border-fluent-border text-center text-fluent-text-muted">
                <Award size={36} className="mx-auto mb-3 opacity-20" />
                <p className="text-xs font-medium">Crea colaboradores y valóralos para mostrar el destacado aquí.</p>
              </div>
            )}

            {!showAddForm ? (
              <button 
                onClick={() => setShowAddForm(true)}
                className="w-full fluent-btn fluent-btn-primary flex items-center justify-center gap-2.5 py-3 hover:translate-y-[-2px] transition-all"
              >
                <UserPlus size={16} />
                Crear Colaborador
              </button>
            ) : (
              <div className="fluent-mica p-5 rounded-xl border border-fluent-border space-y-4">
                <div className="flex justify-between items-center border-b border-fluent-border pb-3">
                  <h4 className="font-bold text-sm text-white">{isEditing ? 'Editar Colaborador' : 'Nuevo Colaborador'}</h4>
                  <button 
                    onClick={resetForm}
                    className="text-xs text-fluent-text-muted hover:text-white"
                  >
                    Cancelar
                  </button>
                </div>

                <form onSubmit={handleAddCollaborator} className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="fluent-label">Nombre *</label>
                      <input 
                        type="text"
                        required
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="fluent-input py-1.5"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="fluent-label">Apellido *</label>
                      <input 
                        type="text"
                        required
                        value={apellido}
                        onChange={(e) => setApellido(e.target.value)}
                        className="fluent-input py-1.5"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="fluent-label">Cédula Identidad *</label>
                      <input 
                        type="text"
                        required
                        value={ci}
                        onChange={(e) => setCi(e.target.value)}
                        className="fluent-input py-1.5"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="fluent-label">Cargo *</label>
                      <input 
                        type="text"
                        required
                        placeholder="Ej. Perito Forense"
                        value={cargo}
                        onChange={(e) => setCargo(e.target.value)}
                        className="fluent-input py-1.5"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="fluent-label">Usuario *</label>
                    <input 
                      type="text"
                      required
                      placeholder="Nombre de usuario"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={isEditing !== null}
                      className="fluent-input py-1.5 disabled:opacity-50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="fluent-label">{isEditing ? 'Contraseña (dejar en blanco para no cambiar)' : 'Contraseña *'}</label>
                    <input 
                      type="password"
                      required={!isEditing}
                      placeholder="Clave de acceso"
                      value={passwordColab}
                      onChange={(e) => setPasswordColab(e.target.value)}
                      className="fluent-input py-1.5"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="fluent-label">Rol del Sistema</label>
                    <select 
                      value={rol}
                      onChange={(e) => setRol(e.target.value)}
                      className="fluent-input py-1.5 select-arrow bg-fluent-surfaceActive"
                    >
                      {ROLES.map(r => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="fluent-label">Email Institucional *</label>
                    <input 
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="fluent-input py-1.5"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="fluent-label">Teléfono</label>
                      <input 
                        type="text"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        className="fluent-input py-1.5"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="fluent-label">Despacho / Fiscalía</label>
                      <input 
                        type="text"
                        placeholder="Ej. Laboratorio 3"
                        value={despacho}
                        onChange={(e) => setDespacho(e.target.value)}
                        className="fluent-input py-1.5"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full fluent-btn fluent-btn-primary py-2.5 text-xs font-bold mt-2"
                  >
                    {isEditing ? 'Actualizar Colaborador' : 'Guardar Colaborador'}
                  </button>
                </form>
              </div>
            )}

          </div>

          <div className="lg:col-span-2 space-y-4">
            
            <div className="fluent-mica p-6 rounded-xl border border-fluent-border">
              <h3 className="text-lg font-bold text-white mb-4">Directorio de Colaboradores (Base de Datos)</h3>
              
              {loading ? (
                 <div className="text-center py-10 text-fluent-text-muted">Cargando...</div>
              ) : personal.length === 0 ? (
                <div className="text-center py-10 text-fluent-text-muted">
                  <User size={40} className="mx-auto mb-3 opacity-20" />
                  <p className="text-sm font-medium">No se han registrado colaboradores técnicos en el CMS.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {personal.map(p => (
                    <div 
                      key={p.id} 
                      className={`fluent-card p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-fluent-border rounded-lg bg-fluent-surface/40 hover:bg-fluent-surface ${!p.activo ? 'opacity-50' : ''}`}
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="w-12 h-12 rounded-full bg-white/[0.03] border border-fluent-border flex items-center justify-center font-bold text-fluent-accent text-sm self-start md:self-auto overflow-hidden">
                          {p.profile_image ? (
                             <img src={p.profile_image} alt={p.nombre} className="w-full h-full object-cover" />
                          ) : (
                             <>{p.nombre?.charAt(0)}{p.apellido?.charAt(0)}</>
                          )}
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">{p.nombre} {p.apellido} <span className="text-xs text-fluent-text-muted font-normal">(@{p.username})</span></span>
                            <span className="text-[9px] bg-white/10 px-1.5 py-0.5 rounded text-fluent-text-muted uppercase font-semibold">
                              {ROLES.find(r => r.value === p.rol)?.label || p.rol}
                            </span>
                            {p.activo === 0 && (
                              <span className="text-[9px] bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded uppercase font-semibold">Inactivo</span>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-fluent-text-muted">
                            {p.cargo && <span className="flex items-center gap-1"><Briefcase size={12} /> {p.cargo}</span>}
                            {p.email && <span className="flex items-center gap-1"><Mail size={12} /> {p.email}</span>}
                            {p.telefono && <span className="flex items-center gap-1"><Phone size={12} /> {p.telefono}</span>}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-start md:items-end justify-center gap-2">
                        <div className="flex items-center gap-2">
                           <button onClick={() => handleEditClick(p)} className="text-fluent-text-muted hover:text-white p-1 rounded transition-colors" title="Editar">
                              <Edit size={16} />
                           </button>
                           <button onClick={() => handleToggleActive(p.id, p.activo)} className="text-fluent-text-muted hover:text-red-400 p-1 rounded transition-colors" title={p.activo ? 'Desactivar' : 'Activar'}>
                              {p.activo ? <ShieldOff size={16} /> : <Check size={16} />}
                           </button>
                        </div>
                        <div className="flex items-center gap-0.5 text-fluent-accent">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => handleSetRanking(p.id, i + 1)}
                              className="hover:scale-115 transition-transform"
                            >
                              <Star 
                                size={14} 
                                fill={i < (p.ranking || 0) ? "currentColor" : "none"} 
                                className="cursor-pointer"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {activeTab === 'projects' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-white">Mis Proyectos Forenses</h3>
              <p className="text-xs text-fluent-text-muted mt-0.5">Control de procesos activos e inalterabilidad de la evidencia digital.</p>
            </div>
            <span className="text-[10px] font-black font-mono text-[#FECF06] bg-[#FECF06]/10 px-2.5 py-1 rounded border border-[#FECF06]/20 uppercase tracking-widest">
              Total: {casos.length} Proyectos
            </span>
          </div>

          {casos.length === 0 ? (
            <div className="fluent-mica p-16 text-center rounded-xl border border-fluent-border">
              <FolderOpen size={48} className="mx-auto mb-4 text-fluent-text-muted opacity-25" />
              <p className="text-fluent-text-muted font-bold text-xs uppercase tracking-wider">No hay proyectos activos en el servidor Neon Serverless</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {casos.map((caso) => {
                const stepCount = caso.steps
                  ? Object.values(caso.steps).filter(s => s.estado === 'completado').length
                  : Object.keys(caso.completed_steps || {}).filter(k => caso.completed_steps?.[k]).length;
                const totalStepCount = caso.tipoProyecto ? getPasosPorTipo(caso.tipoProyecto).length : 9;
                const stepPct = Math.round((stepCount / Math.max(totalStepCount, 1)) * 100);
                
                // Calculate compliance rate based on checked requirements (out of 25)
                const complianceChecklist = caso.compliance_checklist || [];
                const checkedCount = complianceChecklist.filter(c => c.checked).length;
                const compliancePct = Math.min(100, Math.round((checkedCount / 25) * 100));

                return (
                  <div key={caso.id} className="fluent-mica p-5 rounded-xl border border-white/5 bg-[#0b1f13]/15 hover:border-[#FECF06]/30 transition-all flex flex-col justify-between h-[255px] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#FECF06]/5 rounded-full blur-xl group-hover:bg-[#FECF06]/10 transition-colors"></div>
                    
                    <div>
                      {/* Cabecera del caso */}
                      <div className="flex justify-between items-start mb-3">
                        <div className="min-w-0">
                          <span className="font-mono text-[9px] font-black text-[#FECF06] uppercase tracking-wider block">
                            {caso.numeroCaso}
                          </span>
                          <h4 className="font-bold text-white text-sm line-clamp-1 group-hover:text-[#FECF06] transition-all">
                            {caso.titulo}
                          </h4>
                        </div>
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border shrink-0 ${
                          caso.estado === 'cerrado' || caso.estado === 'archivado'
                            ? 'bg-white/5 border-white/10 text-fluent-text-muted'
                            : 'bg-green-500/10 border-green-500/20 text-green-400'
                        }`}>
                          {caso.estado}
                        </span>
                      </div>

                      {/* Info adicional */}
                      <div className="grid grid-cols-2 gap-2 mb-4 text-[10px] text-fluent-text-muted">
                        <div>
                          <span className="text-[8px] uppercase tracking-wider block opacity-50">Perito Líder</span>
                          <span className="font-bold text-white/80">{caso.peritoLider || 'Sin asignar'}</span>
                        </div>
                        <div>
                          <span className="text-[8px] uppercase tracking-wider block opacity-50">Fiscalía</span>
                          <span className="font-bold text-white/80 truncate block">{caso.fiscal || 'Sin asignar'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Gauges y Barras de progreso */}
                    <div className="space-y-3">
                      {/* Progreso Forense */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] font-bold">
                          <span className="text-white/60 flex items-center gap-1">
                            <Database size={10} className="text-cyan-400" /> Pasos Forenses
                          </span>
                          <span className="text-cyan-400 font-mono">{stepCount}/9 ({stepPct}%)</span>
                        </div>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${stepPct}%` }} />
                        </div>
                      </div>

                      {/* Progreso Compliance */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] font-bold">
                          <span className="text-white/60 flex items-center gap-1">
                            <ShieldCheck size={10} className="text-[#00FF41]" /> Compliance Rate
                          </span>
                          <span className="text-[#00FF41] font-mono">{compliancePct}%</span>
                        </div>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-[#00FF41] rounded-full" style={{ width: `${compliancePct}%` }} />
                        </div>
                      </div>

                      {/* Botón de eliminación */}
                      <div className="flex justify-end pt-2 border-t border-white/5">
                        <button
                          onClick={() => {
                            if (window.confirm(`¿Estás seguro de que deseas eliminar permanentemente el proyecto "${caso.titulo}"? Esta acción no se puede deshacer y eliminará todos los registros en Neon Serverless.`)) {
                              deleteCaso(caso.id);
                            }
                          }}
                          className="flex items-center gap-1 px-3 py-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[9px] font-black uppercase tracking-wider border border-red-500/20 hover:border-red-500/40 transition-all cursor-pointer"
                        >
                          <Trash2 size={10} />
                          Eliminar
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
