import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Chip from '@mui/material/Chip';
import Checkbox from '@mui/material/Checkbox';
import LinearProgress from '@mui/material/LinearProgress';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckIcon from '@mui/icons-material/Check';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { Normativa } from '../../store/cmsStore';

interface NormativaAccordionProps {
  norm: Normativa;
  isExpanded: boolean;
  onToggle: (id: string | null) => void;
  progress: { total: number; checked: number; pct: number };
  ne: any;
  isChecked: (stageId: string) => boolean;
  getCheckDate: (stageId: string) => string | undefined;
  toggleCheck: (stageId: string, normId: string) => void;
}

export default function NormativaAccordion({
  norm,
  isExpanded,
  onToggle,
  progress,
  ne,
  isChecked,
  getCheckDate,
  toggleCheck,
}: NormativaAccordionProps) {
  return (
    <Accordion
      expanded={isExpanded}
      onChange={() => onToggle(isExpanded ? null : norm.id)}
      sx={{
        backgroundColor: '#1E1800',
        color: '#FFFFFF',
        border: '1px solid rgba(254, 207, 6, 0.25)',
        borderRadius: '8px !important',
        mb: 2,
        '&:before': { display: 'none' },
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#FECF06' }} />}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', pr: 1 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography sx={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '12px', color: '#FECF06' }}>
                {norm.codigo}
              </Typography>
              <Chip label={norm.tipo} size="small" sx={{ height: 18, fontSize: '9px', backgroundColor: 'rgba(254, 207, 6, 0.1)', color: '#FECF06', fontWeight: 700 }} />
              {progress.pct === 100 && (
                <Chip icon={<CheckIcon sx={{ fontSize: 12, color: '#00FF41 !important' }} />} label="Completo" size="small" sx={{ height: 18, fontSize: '9px', backgroundColor: 'rgba(0, 255, 65, 0.1)', color: '#00FF41', fontWeight: 700 }} />
              )}
            </Box>
            <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>
              {norm.nombre}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 2 }}>
            <Box sx={{ width: 80, display: { xs: 'none', sm: 'block' } }}>
              <LinearProgress variant="determinate" value={progress.pct} sx={{ height: 6, borderRadius: 3, backgroundColor: 'rgba(254, 207, 6, 0.15)', '& .MuiLinearProgress-bar': { backgroundColor: '#FECF06' } }} />
            </Box>
            <Typography sx={{ fontSize: '12px', fontWeight: 700, color: progress.pct === 100 ? '#00FF41' : '#FECF06' }}>
              {progress.checked}/{progress.total}
            </Typography>
          </Box>
        </Box>
      </AccordionSummary>

      {ne && (
        <AccordionDetails sx={{ p: 0, borderTop: '1px solid rgba(254, 207, 6, 0.15)' }}>
          {ne.etapas.map((etapa: any) => (
            <Box key={etapa.id} sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              {etapa.subetapas ? (
                <Box sx={{ mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <MenuBookIcon sx={{ fontSize: 16, color: '#FECF06' }} />
                    <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>{etapa.nombre}</Typography>
                  </Box>
                  <Typography sx={{ fontSize: '12px', color: '#AEAEB2', ml: 3 }}>{etapa.descripcion}</Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <Checkbox
                    checked={isChecked(etapa.id)}
                    onChange={() => toggleCheck(etapa.id, norm.id)}
                    size="small"
                    sx={{ color: '#FECF06', '&.Mui-checked': { color: '#00FF41' } }}
                  />
                  <Box>
                    <Typography sx={{ fontSize: '13px', fontWeight: 600, color: isChecked(etapa.id) ? '#AEAEB2' : '#FFFFFF', textDecoration: isChecked(etapa.id) ? 'line-through' : 'none' }}>
                      {etapa.nombre}
                    </Typography>
                    <Typography sx={{ fontSize: '11px', color: '#AEAEB2' }}>{etapa.descripcion}</Typography>
                    {isChecked(etapa.id) && getCheckDate(etapa.id) && (
                      <Typography sx={{ fontSize: '10px', color: '#00FF41', mt: 0.5, fontWeight: 700 }}>
                        ✓ {new Date(getCheckDate(etapa.id)!).toLocaleDateString('es-VE')}
                      </Typography>
                    )}
                  </Box>
                </Box>
              )}

              {etapa.subetapas && (
                <Box sx={{ ml: 4, borderLeft: '2px solid rgba(254, 207, 6, 0.2)', pl: 2, mt: 1 }}>
                  {etapa.subetapas.map((sub: any) => (
                    <Box key={sub.id} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, py: 0.5 }}>
                      <Checkbox
                        checked={isChecked(sub.id)}
                        onChange={() => toggleCheck(sub.id, norm.id)}
                        size="small"
                        sx={{ color: '#FECF06', '&.Mui-checked': { color: '#00FF41' } }}
                      />
                      <Box>
                        <Typography sx={{ fontSize: '12px', fontWeight: 600, color: isChecked(sub.id) ? '#AEAEB2' : '#FFFFFF', textDecoration: isChecked(sub.id) ? 'line-through' : 'none' }}>
                          {sub.nombre}
                        </Typography>
                        <Typography sx={{ fontSize: '11px', color: '#AEAEB2' }}>{sub.descripcion}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          ))}
        </AccordionDetails>
      )}
    </Accordion>
  );
}
