import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from '@/store/authStore'

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.getState().logout()
  })

  it('debe iniciar sesión exitosamente con credenciales válidas por defecto', async () => {
    const success = await useAuthStore.getState().login('julljoll@gmail.com', 'admin')
    expect(success).toBe(true)

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(true)
    expect(state.user).not.toBeNull()
    expect(state.user?.email).toBe('julljoll@gmail.com')
    expect(state.user?.nombre).toBe('Jull Joll')
    expect(state.user?.rol).toBe('admin')
    expect(state.error).toBeNull()
  })

  it('debe rechazar correo electrónico inválido', async () => {
    const success = await useAuthStore.getState().login('correo-invalido', 'admin')
    expect(success).toBe(false)

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.user).toBeNull()
    expect(state.error).toBe('Ingrese un correo electrónico válido')
  })

  it('debe rechazar contraseña vacía', async () => {
    const success = await useAuthStore.getState().login('julljoll@gmail.com', '   ')
    expect(success).toBe(false)

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.error).toBe('Ingrese la contraseña')
  })

  it('debe cerrar sesión correctamente y limpiar el estado', async () => {
    await useAuthStore.getState().login('julljoll@gmail.com', 'admin')
    expect(useAuthStore.getState().isAuthenticated).toBe(true)

    useAuthStore.getState().logout()
    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.user).toBeNull()
    expect(state.error).toBeNull()
  })

  it('debe actualizar la imagen de perfil del usuario activo', async () => {
    await useAuthStore.getState().login('julljoll@gmail.com', 'admin')
    const fakeImageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErJggg=='
    
    useAuthStore.getState().updateProfileImage(fakeImageBase64)
    expect(useAuthStore.getState().user?.profileImage).toBe(fakeImageBase64)
  })
})
