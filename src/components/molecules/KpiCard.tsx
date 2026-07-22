import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { CMSIcon } from '../atoms/AppleIcon';

interface KpiCardProps {
  title: string;
  value: string | number;
  sub?: string;
  icon: CMSIcon;
  color?: string;
}

export default function KpiCard({
  title,
  value,
  sub,
  icon: Icon,
  color = '#FECF06',
}: KpiCardProps) {
  return (
    <Card
      sx={{
        p: 2.5,
        backgroundColor: '#1E1800',
        border: '1px solid rgba(254, 207, 6, 0.25)',
        borderLeft: `4px solid ${color}`,
        borderRadius: '8px',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
        <Typography sx={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#AEAEB2' }}>
          {title}
        </Typography>
        <Icon size={16} style={{ color }} />
      </Box>
      <Typography sx={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF', fontFamily: 'monospace', mb: 0.5 }}>
        {value}
      </Typography>
      {sub && (
        <Typography sx={{ fontSize: '12px', color: '#AEAEB2' }}>
          {sub}
        </Typography>
      )}
    </Card>
  );
}
