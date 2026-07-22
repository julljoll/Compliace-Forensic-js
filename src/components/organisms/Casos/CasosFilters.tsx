import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import { EstadoCaso, PrioridadCaso } from '../../../store/cmsStore';

interface CasosFiltersProps {
  busqueda: string;
  setBusqueda: (v: string) => void;
  filtroEstado: EstadoCaso | 'todos';
  setFiltroEstado: (v: EstadoCaso | 'todos') => void;
  filtroPrioridad: PrioridadCaso | 'todos';
  setFiltroPrioridad: (v: PrioridadCaso | 'todos') => void;
  estados: { value: EstadoCaso | 'todos'; label: string }[];
  prioridades: { value: PrioridadCaso | 'todos'; label: string }[];
}

export default function CasosFilters({
  busqueda,
  setBusqueda,
  filtroEstado,
  setFiltroEstado,
  filtroPrioridad,
  setFiltroPrioridad,
  estados,
  prioridades,
}: CasosFiltersProps) {
  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: '#1E1800',
        border: '1px solid rgba(254, 207, 6, 0.25)',
        borderRadius: '8px',
        mb: 3,
      }}
    >
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          size="small"
          placeholder="Filtrar por ID de caso, título o perito..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          fullWidth
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '6px',
            '& .MuiOutlinedInput-root': {
              color: '#FFFFFF',
              '& fieldset': { borderColor: 'rgba(254, 207, 6, 0.2)' },
              '&:hover fieldset': { borderColor: '#FECF06' },
            },
          }}
        />

        <TextField
          select
          size="small"
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value as any)}
          sx={{
            minWidth: 160,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '6px',
            '& .MuiOutlinedInput-root': { color: '#FFFFFF' },
          }}
        >
          {estados.map((e) => (
            <MenuItem key={e.value} value={e.value}>
              {e.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          size="small"
          value={filtroPrioridad}
          onChange={(e) => setFiltroPrioridad(e.target.value as any)}
          sx={{
            minWidth: 160,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '6px',
            '& .MuiOutlinedInput-root': { color: '#FFFFFF' },
          }}
        >
          {prioridades.map((p) => (
            <MenuItem key={p.value} value={p.value}>
              {p.label}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
    </Box>
  );
}
