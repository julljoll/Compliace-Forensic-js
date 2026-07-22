import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { ShieldCheck, CheckCircle2, Clock, ListChecks } from '../../atoms/AppleIcon';

interface ComplianceKPIsProps {
  stats: {
    totalStages: number;
    checkedStages: number;
    pct: number;
  };
  totalNormativas: number;
}

export default function ComplianceKPIs({ stats, totalNormativas }: ComplianceKPIsProps) {
  const kpis = [
    {
      label: 'Progreso Global',
      value: `${stats.pct}%`,
      color: stats.pct >= 80 ? '#00FF41' : stats.pct >= 50 ? '#FECF06' : '#FF3B30',
      icon: ShieldCheck,
    },
    {
      label: 'Etapas Verificadas',
      value: stats.checkedStages,
      color: '#00FF41',
      icon: CheckCircle2,
    },
    {
      label: 'Línea Base Pendiente',
      value: stats.totalStages - stats.checkedStages,
      color: '#FF9500',
      icon: Clock,
    },
    {
      label: 'Marcos Activos',
      value: totalNormativas,
      color: '#FECF06',
      icon: ListChecks,
    },
  ];

  return (
    <Grid container spacing={2}>
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <Grid key={kpi.label} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                p: 2.5,
                backgroundColor: '#1E1800',
                border: '1px solid rgba(254, 207, 6, 0.25)',
                borderLeft: `4px solid ${kpi.color}`,
                borderRadius: '8px',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#AEAEB2' }}>
                  {kpi.label}
                </Typography>
                <Icon size={18} style={{ color: kpi.color }} />
              </Box>
              <Typography sx={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF', fontFamily: 'monospace' }}>
                {kpi.value}
              </Typography>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}
