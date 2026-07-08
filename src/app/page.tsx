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
    <div className="h-screen w-screen bg-[var(--apple-bg)] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-cms-accent/30 border-t-cms-accent rounded-full animate-spin" />
    </div>
  )
}
