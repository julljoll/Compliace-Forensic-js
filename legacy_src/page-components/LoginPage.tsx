'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center p-3"
      style={{
        backgroundColor: '#112E51',
        backgroundImage: 'linear-gradient(135deg, #112E51 0%, #0A1C33 100%)',
      }}
    >
      <div
        className="card w-100 p-4 bg-white border shadow-lg rounded-4 d-flex flex-column align-items-center"
        style={{ maxWidth: '400px', borderColor: '#CBD5E1' }}
      >
        <div
          className="rounded-3 p-2 mb-3 bg-white border border-2 d-flex align-items-center justify-content-center"
          style={{ width: 64, height: 64, borderColor: '#112E51' }}
        >
          <img src="/logo.png" alt="SHA256.US" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
        </div>

        <h1 className="h3 fw-bold text-navy font-monospace mb-1" style={{ color: '#112E51' }}>
          SHA256.US
        </h1>
        <p className="small text-muted mb-4 text-center">
          Sistema de Peritaje Forense Digital &amp; Compliance
        </p>

        {error && <div className="alert alert-danger w-100 py-2 small mb-3">{error}</div>}

        <form onSubmit={handleSubmit} className="w-100 d-flex flex-column gap-3">
          <div>
            <label className="form-label small fw-bold text-uppercase text-navy">Correo Electrónico</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="julljoll@gmail.com"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="form-label small fw-bold text-uppercase text-navy">Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary fw-bold w-100 mt-2 py-2 d-flex align-items-center justify-content-center gap-2"
            disabled={isLoading}
          >
            <ShieldCheck size={18} />
            {isLoading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-4 p-2 rounded-3 bg-light border w-100 text-center small text-muted">
          Acceso por defecto: <span className="fw-bold font-monospace text-primary">julljoll@gmail.com</span> | <span className="fw-bold font-monospace text-primary">admin</span>
        </div>
      </div>
    </div>
  );
}
