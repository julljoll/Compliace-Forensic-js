'use client';

import React, { useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Rating from '@mui/material/Rating';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import LinearProgress from '@mui/material/LinearProgress';
import IconButton from '@mui/material/IconButton';

import { useAuthStore } from '../store/authStore';
import { useCMSStore } from '../store/cmsStore';
import { platformAPI } from '../db/platformAPI';
import { getPasosPorTipo } from '../data/tiposProyecto';
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
  const [activeTab, setActiveTab] = useState<'profile' | 'collaborators' | 'projects' | 'admin'>(isAdmin ? 'admin' : 'profile');
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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { md: 'center' }, gap: 2, pb: 2, borderBottom: '1px solid rgba(254, 207, 6, 0.2)' }}>
        <Box>
          <Typography component="h1" sx={{ fontSize: '24px', fontWeight: 700, color: '#00FF41' }}>
            Panel de Personal
          </Typography>
          <Typography sx={{ fontSize: '14px', color: '#AEAEB2', mt: 0.5 }}>
            Seguridad de tu perfil, gestión de colaboradores y métricas de desempeño del equipo.
          </Typography>
        </Box>
        <Tabs
          value={activeTab}
          onChange={(_, val) => setActiveTab(val)}
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.35)',
            borderRadius: '8px',
            p: '4px',
            '& .MuiTabs-indicator': { backgroundColor: '#FECF06' },
          }}
        >
          <Tab value="profile" label="Mi Perfil" sx={{ color: '#AEAEB2', '&.Mui-selected': { color: '#FECF06', fontWeight: 700 } }} />
          <Tab value="collaborators" label={`Colaboradores (${personal.length})`} sx={{ color: '#AEAEB2', '&.Mui-selected': { color: '#FECF06', fontWeight: 700 } }} />
          <Tab value="projects" label={`Mis Proyectos (${casos.length})`} sx={{ color: '#AEAEB2', '&.Mui-selected': { color: '#FECF06', fontWeight: 700 } }} />
          {isAdmin && (
            <Tab 
              value="admin" 
              label="Control Admin Global" 
              sx={{ color: '#FF3B30', '&.Mui-selected': { color: '#FF3B30', fontWeight: 800 } }} 
            />
          )}
        </Tabs>
      </Box>


      {/* Tab: Profile */}
      {activeTab === 'profile' && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative' }}>
              <Chip label={user?.rol || 'Usuario'} size="small" sx={{ position: 'absolute', top: 16, right: 16, backgroundColor: 'rgba(254, 207, 6, 0.1)', color: '#FECF06', fontWeight: 700 }} />
              <Box sx={{ position: 'relative', width: 120, height: 120, mb: 2 }}>
                <Avatar src={user?.profileImage || '/favicon.png'} sx={{ width: 120, height: 120, border: '3px solid #FECF06' }} />
                <IconButton onClick={() => fileInputRef.current?.click()} sx={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: '#FECF06', color: '#000', '&:hover': { backgroundColor: '#FFE052' } }}>
                  <Camera size={18} />
                </IconButton>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
              </Box>
              <Typography sx={{ fontSize: '20px', fontWeight: 700, color: '#FFFFFF' }}>{user?.nombre || 'Usuario'}</Typography>
              <Typography sx={{ fontSize: '13px', color: '#AEAEB2', fontFamily: 'monospace', mb: 2 }}>{user?.email || 'admin@sha256.us'}</Typography>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Card sx={{ p: 3 }}>
              <Typography component="h3" sx={{ fontSize: '18px', fontWeight: 700, color: '#FECF06', mb: 2 }}>
                Cambiar Clave de Acceso
              </Typography>
              {passError && <Alert severity="error" sx={{ mb: 2 }}>{passError}</Alert>}
              {passSuccess && <Alert severity="success" sx={{ mb: 2 }}>{passSuccess}</Alert>}

              <Box component="form" onSubmit={handlePasswordSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="Nueva Contraseña" type="password" fullWidth value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="Confirmar Contraseña" type="password" fullWidth value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                  </Grid>
                </Grid>
                <Button type="submit" variant="primary" size="md" disabled={changingPass} style={{ alignSelf: 'flex-end' }}>
                  {changingPass ? 'Actualizando...' : 'Guardar Cambios'}
                </Button>
              </Box>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Tab: Collaborators */}
      {activeTab === 'collaborators' && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            {topCollaborator && (
              <Card sx={{ p: 3, mb: 3, border: '1px solid #FECF06' }}>
                <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#FECF06', textTransform: 'uppercase', mb: 2 }}>
                  Colaborador Destacado
                </Typography>
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'rgba(254, 207, 6, 0.2)', color: '#FECF06', fontWeight: 700 }}>
                    {topCollaborator.nombre?.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography sx={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF' }}>
                      {topCollaborator.nombre} {topCollaborator.apellido}
                    </Typography>
                    <Typography sx={{ fontSize: '12px', color: '#AEAEB2' }}>{topCollaborator.cargo}</Typography>
                  </Box>
                </Stack>
                <Rating value={topCollaborator.ranking || 0} readOnly precision={0.5} />
              </Card>
            )}

            {!showAddForm ? (
              <Button onClick={() => setShowAddForm(true)} variant="primary" size="md" style={{ width: '100%' }}>
                <UserPlus size={16} /> Crear Colaborador
              </Button>
            ) : (
              <Card sx={{ p: 3 }}>
                <Typography component="h4" sx={{ fontSize: '16px', fontWeight: 700, color: '#FECF06', mb: 2 }}>
                  {isEditing ? 'Editar Colaborador' : 'Nuevo Colaborador'}
                </Typography>
                <Box component="form" onSubmit={handleAddCollaborator} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField label="Nombre *" fullWidth value={nombre} onChange={(e) => setNombre(e.target.value)} />
                  <TextField label="Apellido *" fullWidth value={apellido} onChange={(e) => setApellido(e.target.value)} />
                  <TextField label="Cédula *" fullWidth value={ci} onChange={(e) => setCi(e.target.value)} />
                  <TextField label="Cargo *" fullWidth value={cargo} onChange={(e) => setCargo(e.target.value)} />
                  <TextField label="Email *" type="email" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} />
                  <TextField select label="Rol *" fullWidth value={rol} onChange={(e) => setRol(e.target.value)}>
                    {ROLES.map(r => <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>)}
                  </TextField>
                  <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
                    <Button onClick={resetForm} variant="ghost" size="sm">Cancelar</Button>
                    <Button type="submit" variant="primary" size="sm">Guardar</Button>
                  </Stack>
                </Box>
              </Card>
            )}
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Card sx={{ p: 3 }}>
              <Typography component="h3" sx={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF', mb: 3 }}>
                Directorio de Colaboradores
              </Typography>
              <Grid container spacing={2}>
                {personal.map((p) => (
                  <Grid key={p.id} size={{ xs: 12, sm: 6 }}>
                    <Card sx={{ p: 2 }}>
                      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 2 }}>
                        <Avatar src={p.profile_image} sx={{ bgcolor: 'rgba(254, 207, 6, 0.1)', color: '#FECF06' }}>
                          {p.nombre?.charAt(0)}
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>{p.nombre} {p.apellido}</Typography>
                          <Typography sx={{ fontSize: '11px', color: '#AEAEB2' }}>@{p.username}</Typography>
                        </Box>
                      </Stack>
                      <Chip label={ROLES.find(r => r.value === p.rol)?.label || p.rol} size="small" sx={{ mb: 1.5, backgroundColor: 'rgba(254, 207, 6, 0.1)', color: '#FECF06' }} />
                      <Rating value={p.ranking || 0} onChange={(_, val) => handleSetRanking(p.id, val || 0)} size="small" />
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Tab: Projects */}
      {activeTab === 'projects' && (
        <Grid container spacing={3}>
          {casos.map((caso) => (
            <Grid key={caso.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card sx={{ p: 2.5 }}>
                <Typography sx={{ fontSize: '11px', fontFamily: 'monospace', color: '#FECF06' }}>{caso.numeroCaso}</Typography>
                <Typography sx={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF', mb: 1 }}>{caso.titulo}</Typography>
                <Typography sx={{ fontSize: '12px', color: '#AEAEB2', mb: 2 }}>Perito: {caso.peritoLider || 'Sin asignar'}</Typography>
                <LinearProgress variant="determinate" value={caso.porcentajeCompletado || 0} sx={{ height: 6, borderRadius: 3, backgroundColor: 'rgba(255, 255, 255, 0.1)', '& .MuiLinearProgress-bar': { backgroundColor: '#00FF41' } }} />
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Tab: Admin Compliance Panel */}
      {activeTab === 'admin' && isAdmin && (
        <AdminCompliancePanel />
      )}
    </Box>

  );
}
