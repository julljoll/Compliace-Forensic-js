import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function NotFound() {
  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        backgroundColor: '#524000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h1" sx={{ color: '#00FF41', fontWeight: 800, mb: 2 }}>
          404
        </Typography>
        <Typography sx={{ color: '#AEAEB2', fontSize: '18px', mb: 3 }}>
          Página no encontrada
        </Typography>
        <Button
          href="/"
          variant="contained"
          sx={{ backgroundColor: '#FECF06', color: '#000000', fontWeight: 700, '&:hover': { backgroundColor: '#e0b700' } }}
        >
          Volver al Panel
        </Button>
      </Box>
    </Box>
  );
}
