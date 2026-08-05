'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import CMSLayout from '@/components/templates/CMSLayout'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return (
      <div className="min-vh-100 min-vw-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#F0F4F8' }}>
        <div className="d-flex flex-column align-items-center gap-3">
          <div className="spinner-border text-primary" role="status" style={{ width: '2rem', height: '2rem' }}>
            <span className="visually-hidden">Verificando sesión...</span>
          </div>
          <span className="text-muted small fw-bold">Verificando sesión...</span>
        </div>
      </div>
    )
  }

  return <CMSLayout>{children}</CMSLayout>
}
