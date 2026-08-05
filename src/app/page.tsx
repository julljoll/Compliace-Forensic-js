'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

export default function Home() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard')
    } else {
      router.replace('/login')
    }
  }, [isAuthenticated, router])

  return (
    <div className="min-vh-100 min-vw-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#F0F4F8' }}>
      <div className="d-flex flex-column align-items-center gap-3">
        <div className="spinner-border text-primary" role="status" style={{ width: '2rem', height: '2rem' }}>
          <span className="visually-hidden">Cargando...</span>
        </div>
        <span className="text-muted small fw-bold">SHA256.US — Cargando sistema...</span>
      </div>
    </div>
  )
}
