'use client';

import React, { useState, useEffect } from 'react';
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
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import InputAdornment from '@mui/material/InputAdornment';

// Iconos MUI
import ShieldIcon from '@mui/icons-material/ShieldOutlined';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import PersonAddIcon from '@mui/icons-material/PersonAddOutlined';
import StorageIcon from '@mui/icons-material/StorageOutlined';
import FolderDeleteIcon from '@mui/icons-material/FolderDeleteOutlined';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUserOutlined';
import SearchIcon from '@mui/icons-material/SearchOutlined';
import LockResetIcon from '@mui/icons-material/LockResetOutlined';
import DownloadIcon from '@mui/icons-material/DownloadOutlined';
import SecurityIcon from '@mui/icons-material/SecurityOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmberOutlined';

import { useAuthStore } from '../../store/authStore';
import { useCMSStore, CasoCMS, RolPersonal } from '../../store/cmsStore';
import { useAuditStore } from '../../store/auditStore';
import { platformAPI } from '../../db/platformAPI';
import { indexedDBStorage } from '../../db/indexedDB';
import Button from '../atoms/Button';

const ROLES_FORENSES: { value: RolPersonal; label: string; desc: string; color: string }[] = [
  { value: 'perito_lider', label: 'Perito Líder Informático', desc: 'ISO 27037/27042 — Dictamen pericial y custodia', color: '#FECF06' },
  { value: 'perito_asistente', label: 'Perito Asistente de Extracción', desc: 'Adquisición física/lógica IPED & FTK', color: '#00FF41' },
  { value: 'fiscal', label: 'Fiscal Adscrito MP', desc: 'Control de legalidad COPP y orden de allanamiento', color: '#9DFF00' },
  { value: 'compliance_officer', label: 'Compliance Officer Legal-Forense', desc: 'Auditoría inmutable RAG y verificación de cadena de custodia', color: '#00E5FF' },
  { value: 'coordinador', label: 'Coordinador Técnico de Lab', desc: 'Gestión de laboratorio y asignación de expedientes', color: '#E040FB' },
  { value: 'admin', label: 'Administrador Global Plataforma', desc: 'Acceso total: Borrado de BD, usuarios y políticas', color: '#FF3B30' },
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

  // Reset del formulario de usuario
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
    setShowUserModal(false);
  };

  // Abrir edición de usuario
  const handleOpenEditUser = (colab: any) => {
    setEditingUserId(colab.id);
    setFormNombre(colab.nombre || '');
    setFormApellido(colab.apellido || '');
    setFormCi(colab.ci || '');
    setFormCargo(colab.cargo || '');
    setFormEmail(colab.email || '');
    setFormUsername(colab.username || '');
    setFormPassword('');
    setFormDespacho(colab.despacho || '');
    setFormTelefono(colab.telefono || '');
    setFormRol(colab.rol || 'perito_asistente');
    setShowUserModal(true);
  };

  // Handler para Guardar Usuario (Nuevo o Editado)
  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNombre || !formApellido || !formCi || !formCargo || !formEmail) {
      alert('Por favor completa todos los campos requeridos con (*)');
      return;
    }

    const payload = {
      nombre: formNombre,
      apellido: formApellido,
      ci: formCi,
      cargo: formCargo,
      email: formEmail,
      telefono: formTelefono || '+58 251-0000000',
      username: formUsername || formEmail.split('@')[0],
      despacho: formDespacho || 'Laboratorio Central de Informática Forense',
      rol: formRol,
      organismo: 'Ministerio Público / Cuerpo Investigativo',
      activo: true,
      ranking: 5,
    };

    try {
      if (editingUserId) {
        updatePersonal(editingUserId.toString(), payload);
        if (platformAPI.db?.updateUser && user?.id) {
          await platformAPI.db.updateUser(user.id, Number(editingUserId), { ...payload, password: formPassword || undefined });
        }
      } else {
        if (!formPassword) {
          alert('Ingresa una contraseña para el nuevo usuario');
          return;
        }
        addPersonal(payload);
        if (platformAPI.db?.addUser && user?.id) {
          await platformAPI.db.addUser(user.id, { ...payload, password: formPassword });
        }
      }
      resetUserForm();
    } catch (err) {
      console.error('Error al guardar usuario:', err);
      alert('Ocurrió un error al guardar los datos del usuario.');
    }
  };

  // Handler para Exportar Copia de Seguridad JSON
  const handleExportBackup = async () => {
    try {
      const jsonCasos = JSON.stringify(casos, null, 2);
      const blob = new Blob([jsonCasos], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `SHA256_BACKUP_CASOS_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('Error al generar el archivo de respaldo');
    }
  };

  const casosFiltrados = casos.filter(c => 
    c.numeroCaso.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.peritoLider && c.peritoLider.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pb: 4 }}>
      {/* Encabezado Principal Admin */}
      <Box 
        sx={{ 
          p: 3, 
          borderRadius: 2, 
          background: 'linear-gradient(135deg, rgba(254, 207, 6, 0.1) 0%, rgba(13, 17, 23, 0.95) 100%)', 
          border: '1px solid rgba(254, 207, 6, 0.3)',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { md: 'center' },
          gap: 2
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <ShieldIcon sx={{ color: '#FECF06', fontSize: 30 }} />
            <Typography component="h1" sx={{ fontSize: '24px', fontWeight: 800, color: '#00FF41' }}>
              Panel de Control Administrativo General — Compliance Officer
            </Typography>
            <Chip 
              label="CUENTA ADMIN GLOBAL" 
              size="small" 
              sx={{ backgroundColor: 'rgba(255, 59, 48, 0.2)', color: '#FF3B30', border: '1px solid #FF3B30', fontWeight: 800, fontFamily: 'monospace' }} 
            />
          </Box>
          <Typography sx={{ fontSize: '13px', color: '#8B949E' }}>
            Centro neurálgico de administración del CMS: eliminación auditada de casos y evidencias, gestión de usuarios con roles periciales y salud de base de datos.
          </Typography>
        </Box>

        <Button onClick={handleExportBackup} variant="secondary" size="md" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <DownloadIcon fontSize="small" /> RESPALDO BD (JSON)
        </Button>
      </Box>

      {/* Navegación por Pestañas */}
      <Box sx={{ borderBottom: 1, borderColor: 'rgba(48, 54, 61, 0.8)' }}>
        <Tabs 
          value={activeTab} 
          onChange={(_, val) => setActiveTab(val)}
          sx={{
            '& .MuiTabs-indicator': { backgroundColor: '#FECF06', height: 3 },
            '& .MuiTab-root': { color: '#8B949E', textTransform: 'none', fontWeight: 600, fontSize: '14px' },
            '& .Mui-selected': { color: '#FECF06', fontWeight: 700 }
          }}
        >
          <Tab 
            value="purge_cases" 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FolderDeleteIcon fontSize="small" />
                <span>Gestión y Borrado de Casos ({casos.length})</span>
              </Box>
            } 
          />
          <Tab 
            value="user_rbac" 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <VerifiedUserIcon fontSize="small" />
                <span>Control de Usuarios y Roles ({personal.length})</span>
              </Box>
            } 
          />
          <Tab 
            value="db_health" 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <StorageIcon fontSize="small" />
                <span>Salud BD & Auditoría</span>
              </Box>
            } 
          />
        </Tabs>
      </Box>

      {/* ─── PESTAÑA 1: GESTIÓN Y BORRADO DE CASOS ─────────────────────────────────── */}
      {activeTab === 'purge_cases' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Typography component="h3" sx={{ fontSize: '18px', fontWeight: 700, color: '#FECF06', p: 1, backgroundColor: 'rgba(254,207,6,0.18)', borderLeft: '3px solid #FECF06', borderRadius: '0 4px 4px 0' }}>
              Directorio General de Casos — Administración de Base de Datos
            </Typography>

            <TextField
              size="small"
              placeholder="Buscar por N° Caso, Título o Perito..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#8B949E' }} />
                    </InputAdornment>
                  )
                }
              }}
              sx={{ width: { xs: '100%', sm: 320 }, backgroundColor: '#161B22' }}
            />
          </Box>

          <Alert severity="warning" icon={<WarningAmberIcon sx={{ color: '#FECF06' }} />} sx={{ backgroundColor: 'rgba(254, 207, 6, 0.08)', color: '#E6EDF3', border: '1px solid rgba(254, 207, 6, 0.3)' }}>
            <strong>ADVERTENCIA DE SEGURIDAD AMBIENTAL:</strong> La eliminación de un caso borra de forma permanente todas sus evidencias registradas, tareas, actas y registros de seguimiento en la base de datos local y en la nube. La acción dejará un registro inmutable con firma SHA-256 en la auditoría del sistema.
          </Alert>

          <TableContainer component={Paper} sx={{ backgroundColor: '#161B22', border: '1px solid rgba(48,54,61,0.8)', borderRadius: 2 }}>
            <Table>
              <TableHead sx={{ backgroundColor: '#0D1117' }}>
                <TableRow>
                  <TableCell sx={{ color: '#FECF06', fontWeight: 700, fontFamily: 'monospace' }}>CÓDIGO CASO</TableCell>
                  <TableCell sx={{ color: '#E6EDF3', fontWeight: 700 }}>TÍTULO / DESCRIPCIÓN</TableCell>
                  <TableCell sx={{ color: '#E6EDF3', fontWeight: 700 }}>TIPO PROYECTO</TableCell>
                  <TableCell sx={{ color: '#E6EDF3', fontWeight: 700 }}>PERITO LÍDER</TableCell>
                  <TableCell sx={{ color: '#E6EDF3', fontWeight: 700 }}>ESTADO</TableCell>
                  <TableCell sx={{ color: '#E6EDF3', fontWeight: 700 }} align="center">ACCIONES ADMIN</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {casosFiltrados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ color: '#8B949E', py: 4 }}>
                      No se encontraron casos registrados en la base de datos.
                    </TableCell>
                  </TableRow>
                ) : (
                  casosFiltrados.map((caso) => (
                    <TableRow key={caso.id} sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.03)' } }}>
                      <TableCell sx={{ color: '#FECF06', fontFamily: 'monospace', fontWeight: 700 }}>
                        {caso.numeroCaso}
                      </TableCell>
                      <TableCell sx={{ color: '#E6EDF3' }}>
                        <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{caso.titulo}</Typography>
                        <Typography sx={{ fontSize: '12px', color: '#8B949E' }}>Exp: {caso.expediente || 'S/N'}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={caso.tipoProyecto === 'forense_whatsapp' ? 'WhatsApp' : caso.tipoProyecto === 'forense_email' ? 'Email' : 'Disco Duro'} 
                          size="small"
                          sx={{ backgroundColor: 'rgba(0, 255, 65, 0.1)', color: '#00FF41', fontWeight: 700 }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: '#8B949E', fontSize: '13px' }}>
                        {caso.peritoLider || 'Sin Perito Asignado'}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={caso.estado.toUpperCase()} 
                          size="small"
                          sx={{ 
                            backgroundColor: caso.estado === 'cerrado' ? 'rgba(0, 229, 255, 0.1)' : 'rgba(254, 207, 6, 0.1)', 
                            color: caso.estado === 'cerrado' ? '#00E5FF' : '#FECF06' 
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Button 
                          onClick={() => { setCasoToDelete(caso); setConfirmTextCaso(''); }}
                          variant="destructive" 
                          size="sm"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#FF3B30', color: '#FFFFFF' }}
                        >
                          <DeleteForeverIcon fontSize="small" /> ELIMINAR CASO
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* ─── PESTAÑA 2: CONTROL DE USUARIOS Y ROLES FORENSES ───────────────────────── */}
      {activeTab === 'user_rbac' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Métricas por Rol */}
          <Grid container spacing={2}>
            {ROLES_FORENSES.map((rolItem) => {
              const count = personal.filter(p => p.rol === rolItem.value).length;
              return (
                <Grid key={rolItem.value} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card sx={{ p: 2, backgroundColor: '#161B22', border: `1px solid ${rolItem.color}`, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography sx={{ fontSize: '11px', fontWeight: 700, color: rolItem.color, textTransform: 'uppercase', fontFamily: 'monospace' }}>
                          {rolItem.label}
                        </Typography>
                        <Typography sx={{ fontSize: '11px', color: '#8B949E', mt: 0.5 }}>{rolItem.desc}</Typography>
                      </Box>
                      <Chip label={count} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#E6EDF3', fontWeight: 800 }} />
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          {/* Header Barra de Acciones */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography component="h3" sx={{ fontSize: '18px', fontWeight: 700, color: '#FECF06', p: 1, backgroundColor: 'rgba(254,207,6,0.18)', borderLeft: '3px solid #FECF06', borderRadius: '0 4px 4px 0' }}>
              Directorio Oficial de Personal & Peritos Forenses
            </Typography>

            <Button 
              onClick={() => { resetUserForm(); setShowUserModal(true); }}
              variant="primary" 
              size="md"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <PersonAddIcon fontSize="small" /> CREAR USUARIO / PERITO
            </Button>
          </Box>

          {/* Tabla de Usuarios */}
          <TableContainer component={Paper} sx={{ backgroundColor: '#161B22', border: '1px solid rgba(48,54,61,0.8)', borderRadius: 2 }}>
            <Table>
              <TableHead sx={{ backgroundColor: '#0D1117' }}>
                <TableRow>
                  <TableCell sx={{ color: '#FECF06', fontWeight: 700 }}>USUARIO / PERITO</TableCell>
                  <TableCell sx={{ color: '#E6EDF3', fontWeight: 700 }}>CÉDULA (CI)</TableCell>
                  <TableCell sx={{ color: '#E6EDF3', fontWeight: 700 }}>ROL TÉCNICO FORENSE</TableCell>
                  <TableCell sx={{ color: '#E6EDF3', fontWeight: 700 }}>CARGO / DESPACHO</TableCell>
                  <TableCell sx={{ color: '#E6EDF3', fontWeight: 700 }}>ESTADO</TableCell>
                  <TableCell sx={{ color: '#E6EDF3', fontWeight: 700 }} align="center">ACCIONES ADMIN</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {personal.map((p) => {
                  const roleObj = ROLES_FORENSES.find(r => r.value === p.rol) || ROLES_FORENSES[1];
                  const isCurrentAdmin = (!!user?.email && p.email === user.email) || (user?.id !== undefined && String(p.id) === String(user.id));

                  return (
                    <TableRow key={p.id} sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.03)' } }}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar src={p.profileImage || p.profile_image} sx={{ bgcolor: 'rgba(254, 207, 6, 0.2)', color: '#FECF06', fontWeight: 700 }}>
                            {p.nombre?.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#E6EDF3' }}>
                              {p.nombre} {p.apellido} {isCurrentAdmin && <Chip label="TÚ" size="small" sx={{ ml: 1, height: 18, fontSize: 10, bgcolor: '#FECF06', color: '#000' }} />}
                            </Typography>
                            <Typography sx={{ fontSize: '12px', color: '#8B949E', fontFamily: 'monospace' }}>
                              {p.email} (@{p.username || 'user'})
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: '#FECF06', fontFamily: 'monospace', fontWeight: 700 }}>
                        {p.ci || 'V-00.000.000'}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={roleObj.label} 
                          size="small"
                          sx={{ backgroundColor: `${roleObj.color}20`, color: roleObj.color, border: `1px solid ${roleObj.color}`, fontWeight: 700 }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: '#8B949E', fontSize: '13px' }}>
                        {p.cargo} — <Typography component="span" sx={{ fontSize: '11px', color: '#8B949E', fontStyle: 'italic' }}>{p.despacho || 'Lab Forense'}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={p.activo ? 'ACTIVO' : 'INACTIVO'} 
                          size="small"
                          sx={{ backgroundColor: p.activo ? 'rgba(0, 255, 65, 0.1)' : 'rgba(255, 59, 48, 0.1)', color: p.activo ? '#00FF41' : '#FF3B30' }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                          <Button onClick={() => handleOpenEditUser(p)} variant="ghost" size="sm">
                            Editar
                          </Button>

                          {!isCurrentAdmin && (
                            <Button 
                              onClick={() => { setUserToDelete(p); setConfirmTextUser(''); }}
                              variant="destructive" 
                              size="sm"
                              style={{ backgroundColor: 'rgba(255, 59, 48, 0.2)', color: '#FF3B30', border: '1px solid #FF3B30' }}
                            >
                              Eliminar
                            </Button>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* ─── PESTAÑA 3: SALUD BD Y AUDITORÍA ─────────────────────────────────────────── */}
      {activeTab === 'db_health' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Typography component="h3" sx={{ fontSize: '18px', fontWeight: 700, color: '#FECF06', p: 1, backgroundColor: 'rgba(254,207,6,0.18)', borderLeft: '3px solid #FECF06', borderRadius: '0 4px 4px 0' }}>
            Monitor de Almacenamiento Persistente & Bitácora Inmutable
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ p: 3, backgroundColor: '#161B22', border: '1px solid rgba(0, 255, 65, 0.3)', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <StorageIcon sx={{ color: '#00FF41', fontSize: 32 }} />
                  <Box>
                    <Typography sx={{ fontSize: '16px', fontWeight: 700, color: '#E6EDF3' }}>Base de Datos SQLite Local</Typography>
                    <Typography sx={{ fontSize: '12px', color: '#00FF41', fontFamily: 'monospace' }}>ESTADO: OPERATIVO (LOCAL EN DISCO)</Typography>
                  </Box>
                </Box>
                <Typography sx={{ fontSize: '13px', color: '#8B949E' }}>
                  Base de datos SQLite relacional alojada localmente en <code style={{ color: '#FECF06' }}>sha256_forense.sqlite</code>.
                </Typography>
                <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(48,54,61,0.8)' }}>
                  <Typography sx={{ fontSize: '12px', color: '#FECF06', fontFamily: 'monospace' }}>Casos en Disco: {casos.length}</Typography>
                  <Typography sx={{ fontSize: '12px', color: '#FECF06', fontFamily: 'monospace' }}>Peritos/Usuarios en Disco: {personal.length}</Typography>
                </Box>
              </Card>
            </Grid>


            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ p: 3, backgroundColor: '#161B22', border: '1px solid rgba(0, 229, 255, 0.3)', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <LockResetIcon sx={{ color: '#00E5FF', fontSize: 32 }} />
                  <Box>
                    <Typography sx={{ fontSize: '16px', fontWeight: 700, color: '#E6EDF3' }}>Trazabilidad SHA-256</Typography>
                    <Typography sx={{ fontSize: '12px', color: '#00E5FF', fontFamily: 'monospace' }}>LOGS REGISTRADOS: {auditLogs.length}</Typography>
                  </Box>
                </Box>
                <Typography sx={{ fontSize: '13px', color: '#8B949E' }}>
                  Cadena inmutable de bloques de auditoría criptográfica.
                </Typography>
              </Card>
            </Grid>
          </Grid>


          {/* Historial de Auditoría de Acciones Críticas */}
          <TableContainer component={Paper} sx={{ backgroundColor: '#161B22', border: '1px solid rgba(48,54,61,0.8)', borderRadius: 2 }}>
            <Table size="small">
              <TableHead sx={{ backgroundColor: '#0D1117' }}>
                <TableRow>
                  <TableCell sx={{ color: '#FECF06', fontWeight: 700 }}>FECHA / HORA</TableCell>
                  <TableCell sx={{ color: '#E6EDF3', fontWeight: 700 }}>ACCIÓN ADMIN</TableCell>
                  <TableCell sx={{ color: '#E6EDF3', fontWeight: 700 }}>DETALLE / MOTIVO</TableCell>
                  <TableCell sx={{ color: '#E6EDF3', fontWeight: 700 }}>USUARIO</TableCell>
                  <TableCell sx={{ color: '#00FF41', fontWeight: 700, fontFamily: 'monospace' }}>HASH INMUTABLE SHA-256</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {auditLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ color: '#8B949E', py: 3 }}>
                      Sin registros de auditoría aún.
                    </TableCell>
                  </TableRow>
                ) : (
                  auditLogs.slice(0, 15).map((entry, idx) => (
                    <TableRow key={entry.id || idx}>
                      <TableCell sx={{ color: '#8B949E', fontSize: '12px', fontFamily: 'monospace' }}>
                        {entry.timestamp}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={entry.accion} 
                          size="small"
                          sx={{ 
                            backgroundColor: entry.nivel === 'error' ? 'rgba(255, 59, 48, 0.2)' : 'rgba(254, 207, 6, 0.2)', 
                            color: entry.nivel === 'error' ? '#FF3B30' : '#FECF06',
                            fontWeight: 700,
                            fontSize: 10
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: '#E6EDF3', fontSize: '12px' }}>
                        {entry.detalle}
                      </TableCell>
                      <TableCell sx={{ color: '#8B949E', fontSize: '12px' }}>
                        {entry.usuario}
                      </TableCell>
                      <TableCell sx={{ color: '#00FF41', fontFamily: 'monospace', fontSize: '11px' }}>
                        {entry.hashActual ? entry.hashActual.substring(0, 20) + '...' : 'c8f492...0a12'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* ─── MODAL DIALOG: CREAR / EDITAR USUARIO ──────────────────────────────────── */}
      <Dialog 
        open={showUserModal} 
        onClose={resetUserForm}
        maxWidth="md"
        fullWidth
        slotProps={{ paper: { sx: { backgroundColor: '#161B22', color: '#E6EDF3', border: '1px solid #FECF06' } } }}
      >
        <DialogTitle sx={{ color: '#FECF06', fontWeight: 700, borderBottom: '1px solid rgba(48, 54, 61, 0.8)' }}>
          {editingUserId ? 'Editar Colaborador / Perito Forense' : 'Registrar Nuevo Perito o Fiscal con Rol Técnico'}
        </DialogTitle>
        <Box component="form" onSubmit={handleSaveUser}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 3 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Nombre *" fullWidth value={formNombre} onChange={(e) => setFormNombre(e.target.value)} required />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Apellido *" fullWidth value={formApellido} onChange={(e) => setFormApellido(e.target.value)} required />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Cédula de Identidad (CI) *" fullWidth value={formCi} onChange={(e) => setFormCi(e.target.value)} required />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Cargo Oficial *" fullWidth value={formCargo} onChange={(e) => setFormCargo(e.target.value)} required />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Correo Electrónico Institucional *" type="email" fullWidth value={formEmail} onChange={(e) => setFormEmail(e.target.value)} required />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Nombre de Usuario (Username)" fullWidth value={formUsername} onChange={(e) => setFormUsername(e.target.value)} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label={editingUserId ? "Nueva Contraseña (Opcional)" : "Contraseña de Acceso *"} type="password" fullWidth value={formPassword} onChange={(e) => setFormPassword(e.target.value)} required={!editingUserId} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Despacho / Fiscalía / Laboratorio" fullWidth value={formDespacho} onChange={(e) => setFormDespacho(e.target.value)} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Teléfono de Contacto" fullWidth value={formTelefono} onChange={(e) => setFormTelefono(e.target.value)} placeholder="+58 412-0000000" />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField 
                  select 
                  label="Rol Específico Forense *" 
                  fullWidth 
                  value={formRol} 
                  onChange={(e) => setFormRol(e.target.value as RolPersonal)}
                >
                  {ROLES_FORENSES.map((r) => (
                    <MenuItem key={r.value} value={r.value}>
                      <Box>
                        <Typography sx={{ fontWeight: 700, color: r.color }}>{r.label}</Typography>
                        <Typography sx={{ fontSize: '11px', color: '#8B949E' }}>{r.desc}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(48, 54, 61, 0.8)' }}>
            <Button onClick={resetUserForm} variant="ghost" size="sm">Cancelar</Button>
            <Button type="submit" variant="primary" size="sm">Guardar Cambios</Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* ─── MODAL DIALOG: CONFIRMACIÓN BORRADO DE CASO ───────────────────────────── */}
      <Dialog 
        open={Boolean(casoToDelete)} 
        onClose={() => setCasoToDelete(null)}
        slotProps={{ paper: { sx: { backgroundColor: '#161B22', color: '#E6EDF3', border: '1px solid #FF3B30' } } }}
      >
        <DialogTitle sx={{ color: '#FF3B30', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningAmberIcon /> ELIMINACIÓN PERMANENTE DE CASO FORENSE
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <Typography sx={{ fontSize: '14px' }}>
            ¿Estás seguro de que deseas eliminar permanentemente el caso <strong style={{ color: '#FECF06', fontFamily: 'monospace' }}>{casoToDelete?.numeroCaso}</strong> — <em>"{casoToDelete?.titulo}"</em>?
          </Typography>
          <Alert severity="error" sx={{ backgroundColor: 'rgba(255, 59, 48, 0.1)', color: '#FF3B30', border: '1px solid #FF3B30' }}>
            Esta acción eliminará todas las evidencias vinculadas y no se podrá deshacer. Para confirmar, escribe exactamente la palabra <strong>BORRAR</strong> a continuación:
          </Alert>
          <TextField 
            fullWidth 
            placeholder="Escribe BORRAR para confirmar" 
            value={confirmTextCaso} 
            onChange={(e) => setConfirmTextCaso(e.target.value)}
            autoFocus
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setCasoToDelete(null)} variant="ghost" size="sm">Cancelar</Button>
          <Button 
            onClick={handleExecuteDeleteCaso} 
            variant="destructive" 
            size="sm" 
            disabled={deletingCaso || confirmTextCaso.trim().toUpperCase() !== 'BORRAR'}
            style={{ backgroundColor: '#FF3B30', color: '#FFF' }}
          >
            {deletingCaso ? 'Eliminando...' : 'CONFIRMAR BORRADO PERMANENTE'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ─── MODAL DIALOG: CONFIRMACIÓN BORRADO DE USUARIO ────────────────────────── */}
      <Dialog 
        open={Boolean(userToDelete)} 
        onClose={() => setUserToDelete(null)}
        slotProps={{ paper: { sx: { backgroundColor: '#161B22', color: '#E6EDF3', border: '1px solid #FF3B30' } } }}
      >
        <DialogTitle sx={{ color: '#FF3B30', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningAmberIcon /> ELIMINACIÓN DE PERITO / USUARIO
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <Typography sx={{ fontSize: '14px' }}>
            ¿Estás seguro de eliminar al colaborador <strong>{userToDelete?.nombre} {userToDelete?.apellido}</strong> ({userToDelete?.email})?
          </Typography>
          <Alert severity="error" sx={{ backgroundColor: 'rgba(255, 59, 48, 0.1)', color: '#FF3B30', border: '1px solid #FF3B30' }}>
            Escribe <strong>BORRAR</strong> para ejecutar el retiro del usuario de la plataforma:
          </Alert>
          <TextField 
            fullWidth 
            placeholder="Escribe BORRAR para confirmar" 
            value={confirmTextUser} 
            onChange={(e) => setConfirmTextUser(e.target.value)}
            autoFocus
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setUserToDelete(null)} variant="ghost" size="sm">Cancelar</Button>
          <Button 
            onClick={handleExecuteDeleteUser} 
            variant="destructive" 
            size="sm" 
            disabled={deletingUser || confirmTextUser.trim().toUpperCase() !== 'BORRAR'}
            style={{ backgroundColor: '#FF3B30', color: '#FFF' }}
          >
            {deletingUser ? 'Eliminando...' : 'CONFIRMAR ELIMINACIÓN'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
