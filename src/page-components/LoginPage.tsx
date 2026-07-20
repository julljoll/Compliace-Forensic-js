'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

import { useAuthStore } from '../store/authStore';
import { ShieldCheck } from '../components/atoms/AppleIcon';
import Button from '../components/atoms/Button';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (!email.trim() || !password.trim()) return;
    const success = await login(email.trim(), password.trim());
    if (success) {
      router.replace('/dashboard');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#524000',
        backgroundImage: 'linear-gradient(135deg, #524000 0%, #211a00 100%)',
        p: 2,
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: '400px',
          p: 4,
          backgroundColor: '#121412',
          border: '1px solid rgba(254, 207, 6, 0.35)',
          borderRadius: '16px',
          boxShadow: '0 12px 32px rgba(0,0,0,0.8)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box sx={{ width: 64, height: 64, mb: 2, p: 1, borderRadius: '12px', backgroundColor: '#524000', border: '1px solid rgba(254, 207, 6, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src="/logo.png" alt="SHA256.US" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
        </Box>

        <Typography component="h1" sx={{ fontSize: '28px', fontWeight: 800, color: '#00FF41', fontFamily: 'monospace', mb: 0.5 }}>
          SHA256.US
        </Typography>
        <Typography sx={{ fontSize: '13px', color: '#AEAEB2', mb: 4, textAlign: 'center' }}>
          Sistema de Peritaje Forense Digital & Compliance
        </Typography>

        {error && <Alert severity="error" sx={{ width: '100%', mb: 3 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            label="Correo Electrónico"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="julljoll@gmail.com"
            required
            autoFocus
          />

          <TextField
            label="Contraseña"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <Button type="submit" variant="primary" size="lg" disabled={isLoading} style={{ width: '100%', marginTop: '8px' }}>
            <ShieldCheck size={18} />
            {isLoading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
          </Button>
        </Box>

        <Box sx={{ mt: 3, p: 1.5, width: '100%', borderRadius: '8px', backgroundColor: 'rgba(254, 207, 6, 0.05)', border: '1px solid rgba(254, 207, 6, 0.2)', textAlign: 'center' }}>
          <Typography sx={{ fontSize: '11px', color: '#AEAEB2' }}>
            Acceso por defecto: <Typography component="span" sx={{ color: '#00FF41', fontWeight: 700, fontFamily: 'monospace' }}>julljoll@gmail.com</Typography> | <Typography component="span" sx={{ color: '#00FF41', fontWeight: 700, fontFamily: 'monospace' }}>admin</Typography>
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}
