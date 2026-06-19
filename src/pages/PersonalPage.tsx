import React, { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useCMSStore } from '../store/cmsStore';
import { platformAPI } from '../db/platformAPI';
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
  const { user, changePassword, updateProfileImage } = useAuthStore();
  const [personal, setPersonal] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'collaborators' | 'projects'>('profile');
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
          nombre,
          apellido,
          ci,
          cargo,
          rol: rol as any,
          organismo: 'MP',
          despacho,
          email,
          telefono,
          activo: true,
          ranking: 0,
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
          nombre,
          apellido,
          ci,
          cargo,
          rol: rol as any,
          organismo: 'MP',
          despacho,
          email,
          telefono,
          activo: true,
          ranking: 0,
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

  const handleSetRanking = async (id: number | string, stars: number) => {
    if (platformAPI.db?.updateUser && user?.id) {
      await platformAPI.db.updateUser(user.id, Number(id), { ranking: stars });
      updatePersonal(id.toString(), { ranking: stars });
      await loadUsers();
    } else {
      updatePersonal(id.toString(), { ranking: stars });
    }
  };

  const topCollaborator = personal.length > 0
    ? [...personal].sort((a, b) => (b.ranking || 0) - (a.ranking || 0))[0]
    : null;

  return (
    <div className="space-y-6 animate-fade-in pb-10">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[rgba(0,0,0,0.08)] pb-6">
        <div>
          <h1 className="text-apple-title-1 font-bold text-[var(--apple-text)]">Panel de Personal</h1>
          <p className="text-[15px] text-[var(--co-gray-1)] mt-1 font-medium">
            Seguridad de tu perfil, gestión de colaboradores y métricas de desempeño del equipo.
          </p>
        </div>
        <div className="flex bg-[rgba(0,0,0,0.04)] p-1 rounded-lg border border-[rgba(0,0,0,0.08)]">
          <button onClick={() => setActiveTab('profile')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-2 ${activeTab === 'profile' ? 'bg-[#0071E3] text-white shadow-md' : 'text-[#86868B] hover:text-[#1D1D1F]'}`}>
            <User size={14} /> Mi Perfil (Admin)
          </button>
          <button onClick={() => setActiveTab('collaborators')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-2 ${activeTab === 'collaborators' ? 'bg-[#0071E3] text-white shadow-md' : 'text-[#86868B] hover:text-[#1D1D1F]'}`}>
            <UserPlus size={14} /> Colaboradores ({personal.length})
          </button>
          <button onClick={() => setActiveTab('projects')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-2 ${activeTab === 'projects' ? 'bg-[#0071E3] text-white shadow-md' : 'text-[#86868B] hover:text-[#1D1D1F]'}`}>
            <FolderOpen size={14} /> Mis Proyectos ({casos.length})
          </button>
        </div>
      </div>

      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="apple-card p-6 lg:col-span-1 flex flex-col items-center text-center justify-center relative">
            <div className="absolute top-4 right-4 bg-[rgba(0,113,227,0.1)] border border-[rgba(0,113,227,0.2)] text-[#0071E3] px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">
              {user?.rol || 'Usuario'}
            </div>
            <div className="relative group w-32 h-32 mb-6">
              <img src={user?.profileImage || "https://ik.imagekit.io/lvxdbpx6l/APP%20FORENSICS/avatar.png"} alt="Profile"
                className="w-full h-full object-cover rounded-full border-4 border-[rgba(0,0,0,0.08)]" />
              <button onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-xs font-bold text-white gap-1">
                <Camera size={18} /> <span>Cambiar Foto</span>
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </div>
            <h2 className="text-xl font-bold text-[#1D1D1F]">{user?.nombre || 'Usuario'}</h2>
            <p className="text-xs text-[#86868B] font-mono mt-1">@{user?.username || 'admin'}</p>
            <div className="w-full border-t border-[rgba(0,0,0,0.08)] mt-6 pt-4 text-left space-y-3">
              <div className="flex items-center gap-2.5 text-xs">
                <Shield size={14} className="text-[#0071E3]" />
                <span className="font-semibold text-[#1D1D1F]">Rol del Sistema:</span>
                <span className="text-[#86868B] font-mono">{ROLES.find(r => r.value === user?.rol)?.label || user?.rol || 'Administrador'}</span>
              </div>
            </div>
          </div>

          <div className="apple-card p-6 lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3 border-b border-[rgba(0,0,0,0.08)] pb-4">
              <div className="w-8 h-8 rounded-lg bg-[rgba(0,113,227,0.1)] border border-[rgba(0,113,227,0.2)] flex items-center justify-center text-[#0071E3]">
                <Key size={16} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1D1D1F]">Cambiar Clave de Acceso</h3>
                <p className="text-xs text-[#86868B] font-medium">Actualiza tu contraseña para asegurar tu cuenta de peritaje.</p>
              </div>
            </div>

            {passError && (
              <div className="bg-[rgba(255,59,48,0.08)] border border-[rgba(255,59,48,0.2)] rounded-lg p-3.5 text-xs text-[#FF3B30] flex items-center gap-2.5">
                <AlertCircle size={16} /> <span>{passError}</span>
              </div>
            )}
            {passSuccess && (
              <div className="bg-[rgba(52,199,89,0.08)] border border-[rgba(52,199,89,0.2)] rounded-lg p-3.5 text-xs text-[#34C759] flex items-center gap-2.5">
                <Check size={16} /> <span>{passSuccess}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#6E6E73] uppercase tracking-wider">Nueva Contraseña</label>
                  <input type="password" placeholder="Mínimo 6 caracteres" value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 text-sm text-[#1D1D1F] bg-white border border-[rgba(0,0,0,0.12)] rounded-lg focus:border-[#0071E3] focus:ring-1 focus:ring-[#0071E3] outline-none transition-all placeholder:text-[#86868B]/50" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#6E6E73] uppercase tracking-wider">Confirmar Nueva Contraseña</label>
                  <input type="password" placeholder="Repite la contraseña" value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 text-sm text-[#1D1D1F] bg-white border border-[rgba(0,0,0,0.12)] rounded-lg focus:border-[#0071E3] focus:ring-1 focus:ring-[#0071E3] outline-none transition-all placeholder:text-[#86868B]/50" />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button type="submit" disabled={changingPass}
                  className="px-6 py-2 bg-[#0071E3] text-white text-xs font-bold rounded-lg hover:bg-[#0077ED] transition-colors">
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
              <div className="apple-card p-6 border border-[rgba(0,113,227,0.3)] relative overflow-hidden bg-gradient-to-br from-white to-[rgba(0,113,227,0.04)]">
                <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-[rgba(0,113,227,0.05)] rounded-full blur-xl"></div>
                <div className="absolute top-4 right-4 text-[#0071E3]">
                  <Trophy size={20} strokeWidth={2.5} className="drop-shadow-[0_2px_4px_rgba(254,207,6,0.3)] animate-pulse" />
                </div>
                <h4 className="text-xs font-black uppercase text-[#0071E3] tracking-wider mb-4 flex items-center gap-1.5">
                  Colaborador Destacado
                </h4>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-[rgba(0,0,0,0.03)] border-2 border-[#0071E3] flex items-center justify-center font-bold text-[#0071E3] text-lg">
                    {topCollaborator.nombre?.charAt(0)}{topCollaborator.apellido?.charAt(0)}
                  </div>
                  <div>
                    <h5 className="font-bold text-[#1D1D1F] text-base leading-tight">
                      {topCollaborator.nombre} {topCollaborator.apellido}
                    </h5>
                    <p className="text-xs text-[#86868B] mt-0.5">{topCollaborator.cargo}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[#0071E3] mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={16} fill={i < (topCollaborator.ranking || 0) ? "currentColor" : "none"} />
                  ))}
                  <span className="text-xs font-bold text-[#1D1D1F] ml-1.5">({topCollaborator.ranking || 0}/5 Estrellas)</span>
                </div>
                <p className="text-xs text-[#86868B] leading-relaxed italic">
                  Actualmente liderando la tabla de valoración de peritos en procesos activos de preservación forense SHA256.US.
                </p>
              </div>
            ) : (
              <div className="apple-card p-6 text-center text-[#86868B]">
                <Award size={36} className="mx-auto mb-3 opacity-20" />
                <p className="text-xs font-medium">Crea colaboradores y valóralos para mostrar el destacado aquí.</p>
              </div>
            )}

            {!showAddForm ? (
              <button onClick={() => setShowAddForm(true)}
                className="w-full py-3 bg-[#0071E3] text-white text-xs font-bold rounded-lg hover:bg-[#0077ED] transition-all flex items-center justify-center gap-2.5">
                <UserPlus size={16} /> Crear Colaborador
              </button>
            ) : (
              <div className="apple-card p-5 space-y-4">
                <div className="flex justify-between items-center border-b border-[rgba(0,0,0,0.08)] pb-3">
                  <h4 className="font-bold text-sm text-[#1D1D1F]">{isEditing ? 'Editar Colaborador' : 'Nuevo Colaborador'}</h4>
                  <button onClick={resetForm} className="text-xs text-[#86868B] hover:text-[#1D1D1F]">Cancelar</button>
                </div>
                <form onSubmit={handleAddCollaborator} className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#6E6E73] uppercase tracking-wider">Nombre *</label>
                      <input type="text" required value={nombre} onChange={(e) => setNombre(e.target.value)}
                        className="w-full px-3 py-1.5 text-sm text-[#1D1D1F] bg-white border border-[rgba(0,0,0,0.12)] rounded-lg focus:border-[#0071E3] outline-none transition-all" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#6E6E73] uppercase tracking-wider">Apellido *</label>
                      <input type="text" required value={apellido} onChange={(e) => setApellido(e.target.value)}
                        className="w-full px-3 py-1.5 text-sm text-[#1D1D1F] bg-white border border-[rgba(0,0,0,0.12)] rounded-lg focus:border-[#0071E3] outline-none transition-all" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#6E6E73] uppercase tracking-wider">Cédula *</label>
                      <input type="text" required value={ci} onChange={(e) => setCi(e.target.value)}
                        className="w-full px-3 py-1.5 text-sm text-[#1D1D1F] bg-white border border-[rgba(0,0,0,0.12)] rounded-lg focus:border-[#0071E3] outline-none transition-all" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#6E6E73] uppercase tracking-wider">Cargo *</label>
                      <input type="text" required placeholder="Ej. Perito Forense" value={cargo} onChange={(e) => setCargo(e.target.value)}
                        className="w-full px-3 py-1.5 text-sm text-[#1D1D1F] bg-white border border-[rgba(0,0,0,0.12)] rounded-lg focus:border-[#0071E3] outline-none transition-all" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#6E6E73] uppercase tracking-wider">Usuario *</label>
                    <input type="text" required placeholder="Nombre de usuario" value={username} onChange={(e) => setUsername(e.target.value)} disabled={isEditing !== null}
                      className="w-full px-3 py-1.5 text-sm text-[#1D1D1F] bg-white border border-[rgba(0,0,0,0.12)] rounded-lg focus:border-[#0071E3] outline-none transition-all disabled:opacity-50" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#6E6E73] uppercase tracking-wider">{isEditing ? 'Contraseña (dejar en blanco para no cambiar)' : 'Contraseña *'}</label>
                    <input type="password" required={!isEditing} placeholder="Clave de acceso" value={passwordColab} onChange={(e) => setPasswordColab(e.target.value)}
                      className="w-full px-3 py-1.5 text-sm text-[#1D1D1F] bg-white border border-[rgba(0,0,0,0.12)] rounded-lg focus:border-[#0071E3] outline-none transition-all" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#6E6E73] uppercase tracking-wider">Rol del Sistema</label>
                    <select value={rol} onChange={(e) => setRol(e.target.value)}
                      className="w-full px-3 py-1.5 text-sm text-[#1D1D1F] bg-white border border-[rgba(0,0,0,0.12)] rounded-lg focus:border-[#0071E3] outline-none transition-all">
                      {ROLES.map(r => (<option key={r.value} value={r.value}>{r.label}</option>))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#6E6E73] uppercase tracking-wider">Email *</label>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-1.5 text-sm text-[#1D1D1F] bg-white border border-[rgba(0,0,0,0.12)] rounded-lg focus:border-[#0071E3] outline-none transition-all" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#6E6E73] uppercase tracking-wider">Teléfono</label>
                      <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)}
                        className="w-full px-3 py-1.5 text-sm text-[#1D1D1F] bg-white border border-[rgba(0,0,0,0.12)] rounded-lg focus:border-[#0071E3] outline-none transition-all" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#6E6E73] uppercase tracking-wider">Despacho</label>
                      <input type="text" placeholder="Ej. Laboratorio 3" value={despacho} onChange={(e) => setDespacho(e.target.value)}
                        className="w-full px-3 py-1.5 text-sm text-[#1D1D1F] bg-white border border-[rgba(0,0,0,0.12)] rounded-lg focus:border-[#0071E3] outline-none transition-all" />
                    </div>
                  </div>
                  <button type="submit"
                    className="w-full py-2.5 bg-[#0071E3] text-white text-xs font-bold rounded-lg hover:bg-[#0077ED] transition-colors mt-2">
                    {isEditing ? 'Actualizar Colaborador' : 'Guardar Colaborador'}
                  </button>
                </form>
              </div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="apple-card p-6">
              <h3 className="text-lg font-bold text-[#1D1D1F] mb-4">Directorio de Colaboradores (Base de Datos)</h3>
              {loading ? (
                <div className="text-center py-10 text-[#86868B]">Cargando...</div>
              ) : personal.length === 0 ? (
                <div className="text-center py-10 text-[#86868B]">
                  <User size={40} className="mx-auto mb-3 opacity-20" />
                  <p className="text-sm font-medium">No se han registrado colaboradores técnicos en el CMS.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {personal.map(p => {
                    const isColabActive = p.activo === 1 || p.activo === true || p.activo === '1';
                    return (
                      <div key={p.id}
                        className={`apple-card p-5 border border-black/[0.06] rounded-2xl bg-white shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300 ${!isColabActive ? 'opacity-60' : ''}`}>
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-black/[0.03] border border-black/[0.08] flex items-center justify-center font-bold text-[#0071E3] text-sm overflow-hidden shrink-0">
                              {p.profile_image ? (
                                <img src={p.profile_image} alt={p.nombre} className="w-full h-full object-cover" />
                              ) : (
                                <>{p.nombre?.charAt(0)}{p.apellido?.charAt(0)}</>
                              )}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-[#1D1D1F] text-[14px] truncate">
                                {p.nombre} {p.apellido}
                              </h4>
                              <p className="text-[11px] text-[#86868B] font-medium truncate">@{p.username}</p>
                            </div>
                          </div>

                          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/[0.04] text-[10px] font-bold text-[#6E6E73] uppercase tracking-wider">
                            {ROLES.find(r => r.value === p.rol)?.label || p.rol}
                          </div>

                          <div className="space-y-2 text-xs text-[#6E6E73] border-t border-black/[0.05] pt-3">
                            {p.cargo && (
                              <div className="flex items-center gap-2">
                                <Briefcase size={12} className="text-[#86868B]" />
                                <span className="truncate">{p.cargo}</span>
                              </div>
                            )}
                            {p.email && (
                              <div className="flex items-center gap-2">
                                <Mail size={12} className="text-[#86868B]" />
                                <span className="truncate" title={p.email}>{p.email}</span>
                              </div>
                            )}
                            {p.telefono && (
                              <div className="flex items-center gap-2">
                                <Phone size={12} className="text-[#86868B]" />
                                <span>{p.telefono}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-black/[0.05] mt-4 pt-3">
                          <div className="flex items-center gap-0.5 text-[#0071E3]">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <button key={i} type="button" onClick={() => handleSetRanking(p.id, i + 1)} className="hover:scale-115 transition-transform">
                                <Star size={13} fill={i < (p.ranking || 0) ? "currentColor" : "none"} className="cursor-pointer" />
                              </button>
                            ))}
                          </div>

                          <div className="flex items-center gap-1">
                            <button onClick={() => handleEditClick(p)} className="p-1.5 rounded-lg text-[#86868B] hover:text-[#0071E3] hover:bg-black/[0.04] transition-colors" title="Editar">
                              <Edit size={14} />
                            </button>
                            <button onClick={() => handleToggleActive(p.id, p.activo)} className="p-1.5 rounded-lg text-[#86868B] hover:text-[#FF3B30] hover:bg-black/[0.04] transition-colors" title={isColabActive ? 'Desactivar' : 'Activar'}>
                              {isColabActive ? <ShieldOff size={14} /> : <Check size={14} />}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
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
              <h3 className="text-lg font-bold text-[#1D1D1F]">Mis Proyectos Forenses</h3>
              <p className="text-xs text-[#86868B] mt-0.5">Control de procesos activos e inalterabilidad de la evidencia digital.</p>
            </div>
            <span className="text-[10px] font-black font-mono text-[#0071E3] bg-[rgba(0,113,227,0.08)] px-2.5 py-1 rounded border border-[rgba(0,113,227,0.15)] uppercase tracking-widest">
              Total: {casos.length} Proyectos
            </span>
          </div>

          {casos.length === 0 ? (
            <div className="apple-card p-16 text-center">
              <FolderOpen size={48} className="mx-auto mb-4 text-[#86868B] opacity-25" />
              <p className="text-[#86868B] font-bold text-xs uppercase tracking-wider">No hay proyectos activos en el servidor Neon Serverless</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {casos.map((caso) => {
                const stepCount = caso.steps
                  ? Object.values(caso.steps).filter(s => s.estado === 'completado').length
                  : Object.keys(caso.completed_steps || {}).filter(k => caso.completed_steps?.[k]).length;
                const totalStepCount = caso.tipoProyecto ? getPasosPorTipo(caso.tipoProyecto).length : 9;
                const stepPct = Math.round((stepCount / Math.max(totalStepCount, 1)) * 100);
                const complianceChecklist = caso.compliance_checklist || [];
                const checkedCount = complianceChecklist.filter(c => c.checked).length;
                const compliancePct = Math.min(100, Math.round((checkedCount / 25) * 100));

                return (
                  <div key={caso.id} className="apple-card p-5 hover:border-[rgba(0,113,227,0.3)] transition-all flex flex-col justify-between h-[255px] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[rgba(0,113,227,0.04)] rounded-full blur-xl group-hover:bg-[rgba(0,113,227,0.08)] transition-colors"></div>
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div className="min-w-0">
                          <span className="font-mono text-[9px] font-black text-[#0071E3] uppercase tracking-wider block">{caso.numeroCaso}</span>
                          <h4 className="font-bold text-[#1D1D1F] text-sm line-clamp-1 group-hover:text-[#0071E3] transition-all">{caso.titulo}</h4>
                        </div>
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border shrink-0 ${caso.estado === 'cerrado' || caso.estado === 'archivado' ? 'bg-[rgba(0,0,0,0.04)] border-[rgba(0,0,0,0.08)] text-[#86868B]' : 'bg-[rgba(52,199,89,0.08)] border-[rgba(52,199,89,0.2)] text-[#34C759]'}`}>
                          {caso.estado}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-4 text-[10px] text-[#86868B]">
                        <div><span className="text-[8px] uppercase tracking-wider block opacity-50">Perito Líder</span><span className="font-bold text-[#1D1D1F]">{caso.peritoLider || 'Sin asignar'}</span></div>
                        <div><span className="text-[8px] uppercase tracking-wider block opacity-50">Fiscalía</span><span className="font-bold text-[#1D1D1F] truncate block">{caso.fiscal || 'Sin asignar'}</span></div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] font-bold">
                          <span className="text-[#6E6E73] flex items-center gap-1"><Database size={10} className="text-[#0071E3]" /> Pasos Forenses</span>
                          <span className="text-[#0071E3] font-mono">{stepCount}/{totalStepCount} ({stepPct}%)</span>
                        </div>
                        <div className="w-full h-1 bg-[rgba(0,0,0,0.06)] rounded-full overflow-hidden">
                          <div className="h-full bg-[#0071E3] rounded-full" style={{ width: `${stepPct}%` }} />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] font-bold">
                          <span className="text-[#6E6E73] flex items-center gap-1"><ShieldCheck size={10} className="text-[#34C759]" /> Compliance Rate</span>
                          <span className="text-[#34C759] font-mono">{compliancePct}%</span>
                        </div>
                        <div className="w-full h-1 bg-[rgba(0,0,0,0.06)] rounded-full overflow-hidden">
                          <div className="h-full bg-[#34C759] rounded-full" style={{ width: `${compliancePct}%` }} />
                        </div>
                      </div>
                      <div className="flex justify-end pt-2 border-t border-[rgba(0,0,0,0.06)]">
                        <button onClick={() => { if (window.confirm(`¿Estás seguro de que deseas eliminar permanentemente el proyecto "${caso.titulo}"? Esta acción no se puede deshacer y eliminará todos los registros en Neon Serverless.`)) { deleteCaso(caso.id); } }}
                          className="flex items-center gap-1 px-3 py-1 rounded bg-[rgba(255,59,48,0.08)] hover:bg-[rgba(255,59,48,0.15)] text-[#FF3B30] text-[9px] font-black uppercase tracking-wider border border-[rgba(255,59,48,0.2)] hover:border-[rgba(255,59,48,0.4)] transition-all cursor-pointer">
                          <Trash2 size={10} /> Eliminar
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
