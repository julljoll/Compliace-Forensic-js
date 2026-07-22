import Link from 'next/link';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { User, Calendar, ChevronRight, Trash2, Smartphone, Mail, HardDrive } from '../../atoms/AppleIcon';
import { CasoCMS, EstadoCaso, NivelCumplimiento, TipoProyecto } from '../../../store/cmsStore';

const TIPO_ICONOS: Record<TipoProyecto, any> = {
  forense_whatsapp: Smartphone,
  forense_email: Mail,
  forense_discoduro: HardDrive,
};

const TIPO_COLORS: Record<TipoProyecto, { color: string; bg: string }> = {
  forense_whatsapp: { color: '#00FF41', bg: 'rgba(0, 255, 65, 0.1)' },
  forense_email: { color: '#FECF06', bg: 'rgba(254, 207, 6, 0.1)' },
  forense_discoduro: { color: '#9DFF00', bg: 'rgba(157, 255, 0, 0.1)' },
};

const TIPO_LABEL: Record<TipoProyecto, string> = {
  forense_whatsapp: 'WhatsApp',
  forense_email: 'Email',
  forense_discoduro: 'Disco Duro',
};

interface CasoCardProps {
  caso: CasoCMS;
  deleteCaso: (id: string) => void;
  estados: { value: EstadoCaso | 'todos'; label: string }[];
  estadoColors: Record<string, string>;
  prioridadColors: Record<string, string>;
  cumplimientoIcon: Record<NivelCumplimiento, { icon: any; color: string; label: string }>;
}

const PRIORIDAD_COLORS: Record<string, string> = {
  critica: '#FF3B30',
  alta: '#FF9500',
  media: '#FECF06',
  baja: '#00FF41',
};

export default function CasoCard({
  caso,
  deleteCaso,
  estados,
  cumplimientoIcon,
}: CasoCardProps) {
  const cumplConf = cumplimientoIcon[caso.nivelCumplimientoGeneral];
  const CumplIcon = cumplConf.icon;
  const TipoIcon = TIPO_ICONOS[caso.tipoProyecto] || Smartphone;
  const tipoColor = TIPO_COLORS[caso.tipoProyecto] || TIPO_COLORS.forense_whatsapp;
  const prioColor = PRIORIDAD_COLORS[caso.prioridad] || '#FECF06';

  return (
    <Card
      sx={{
        p: 2.5,
        backgroundColor: '#1E1800',
        border: '1px solid rgba(254, 207, 6, 0.25)',
        borderLeft: `4px solid ${prioColor}`,
        borderRadius: '8px',
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'center' },
        gap: 2,
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: '#FECF06',
          transform: 'translateY(-2px)',
        },
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0, width: '100%' }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1, flexWrap: 'wrap' }}>
          <Typography sx={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '12px', color: '#FECF06' }}>
            {caso.numeroCaso}
          </Typography>

          <Chip
            icon={<TipoIcon size={12} style={{ color: tipoColor.color }} />}
            label={TIPO_LABEL[caso.tipoProyecto] || 'WhatsApp'}
            size="small"
            sx={{ height: 20, fontSize: '10px', backgroundColor: tipoColor.bg, color: tipoColor.color, fontWeight: 700 }}
          />
        </Stack>

        <Link href={`/control/seguimiento-compliance?casoId=${caso.id}`} style={{ textDecoration: 'none' }}>
          <Typography sx={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', mb: 1, '&:hover': { color: '#FECF06' } }}>
            {caso.titulo}
          </Typography>
        </Link>

        <Stack direction="row" spacing={2} sx={{ fontSize: '12px', color: '#AEAEB2' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <User size={13} style={{ color: '#AEAEB2' }} />
            <span>{caso.peritoLider || 'Perito Asignado'}</span>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Calendar size={13} style={{ color: '#AEAEB2' }} />
            <span>{new Date(caso.fechaCreacion).toLocaleDateString('es-VE')}</span>
          </Box>
        </Stack>
      </Box>

      {/* Progress & Compliance */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'row', sm: 'column' }, alignItems: { xs: 'center', sm: 'flex-end' }, justifyContent: 'space-between', width: { xs: '100%', sm: 'auto' }, gap: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CumplIcon size={16} style={{ color: '#00FF41' }} />
          <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#AEAEB2', textTransform: 'uppercase' }}>
            {cumplConf.label}
          </Typography>
        </Box>

        <Box sx={{ width: { xs: '120px', sm: '130px' } }}>
          <Typography sx={{ fontSize: '10px', color: '#AEAEB2', fontWeight: 700, textAlign: 'right', mb: 0.5 }}>
            Progreso: {caso.porcentajeCompletado}%
          </Typography>
          <LinearProgress
            variant="determinate"
            value={caso.porcentajeCompletado || 0}
            sx={{ height: 6, borderRadius: 3, backgroundColor: 'rgba(0, 255, 65, 0.15)', '& .MuiLinearProgress-bar': { backgroundColor: '#00FF41' } }}
          />
        </Box>
      </Box>

      {/* Actions */}
      <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', sm: 'flex' } }}>
        <Link href={`/control/seguimiento-compliance?casoId=${caso.id}`} style={{ textDecoration: 'none' }}>
          <IconButton size="small" sx={{ color: '#FECF06', backgroundColor: 'rgba(254, 207, 6, 0.1)', '&:hover': { backgroundColor: 'rgba(254, 207, 6, 0.25)' } }}>
            <ChevronRight size={18} />
          </IconButton>
        </Link>
        <IconButton size="small" onClick={() => deleteCaso(caso.id)} sx={{ color: '#FF3B30', backgroundColor: 'rgba(255, 59, 48, 0.1)', '&:hover': { backgroundColor: 'rgba(255, 59, 48, 0.25)' } }}>
          <Trash2 size={16} />
        </IconButton>
      </Stack>

      <Box sx={{ display: { xs: 'flex', sm: 'none' }, width: '100%', gap: 1, mt: 1 }}>
        <Link href={`/control/seguimiento-compliance?casoId=${caso.id}`} style={{ textDecoration: 'none', flex: 1 }}>
          <Button fullWidth variant="contained" size="small" sx={{ backgroundColor: '#FECF06', color: '#000000', fontWeight: 700 }}>
            Abrir Expediente
          </Button>
        </Link>
        <IconButton onClick={() => deleteCaso(caso.id)} sx={{ color: '#FF3B30', backgroundColor: 'rgba(255, 59, 48, 0.1)' }}>
          <Trash2 size={16} />
        </IconButton>
      </Box>
    </Card>
  );
}
