import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore, USER_JULL, USER_SHA256 } from '@/store/authStore'
import { generarTotpCode } from '@/lib/crypto/totp'

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.getState().logout()
  })

  it('debe iniciar sesión exitosamente para Jull con clave Karupano', async () => {
    const success = await useAuthStore.getState().login('julljoll@gmail.com', 'Karupano')
    expect(success).toBe(true)

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(true)
    expect(state.user).not.toBeNull()
    expect(state.user?.email).toBe('julljoll@gmail.com')
    expect(state.user?.nombre).toBe('Jull Joll')
    expect(state.user?.cargo).toBe('Perito Analizador de Datos Forenses')
    expect(state.user?.rol).toBe('admin')
    expect(state.error).toBeNull()
  })

  it('debe iniciar sesión exitosamente para SHA256 con clave 15816003', async () => {
    const success = await useAuthStore.getState().login('sha256.us@gmail.com', '15816003')
    expect(success).toBe(true)

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(true)
    expect(state.user).not.toBeNull()
    expect(state.user?.email).toBe('sha256.us@gmail.com')
    expect(state.user?.cargo).toBe('Encargado de la Etapa de Adquisición')
    expect(state.user?.rol).toBe('perito_lider')
    expect(state.error).toBeNull()
  })

  it('debe iniciar sesión exitosamente con Google Authenticator (TOTP 6 dígitos)', async () => {
    const code = await generarTotpCode(USER_JULL.totpSecret!)
    const success = await useAuthStore.getState().login('julljoll@gmail.com', '', code)
    expect(success).toBe(true)

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(true)
    expect(state.user?.email).toBe('julljoll@gmail.com')
  })

  it('debe rechazar correo electrónico inválido', async () => {
    const success = await useAuthStore.getState().login('correo-invalido', 'Karupano')
    expect(success).toBe(false)

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.user).toBeNull()
    expect(state.error).toBe('Ingrese un correo electrónico válido')
  })

  it('debe rechazar contraseña y código totp vacíos', async () => {
    const success = await useAuthStore.getState().login('julljoll@gmail.com', '   ', '')
    expect(success).toBe(false)

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.error).toBe('Ingrese la contraseña o el código de Google Authenticator')
  })

  it('debe cerrar sesión correctamente y limpiar el estado', async () => {
    await useAuthStore.getState().login('julljoll@gmail.com', 'Karupano')
    expect(useAuthStore.getState().isAuthenticated).toBe(true)

    useAuthStore.getState().logout()
    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.user).toBeNull()
    expect(state.error).toBeNull()
  })

  it('debe actualizar la imagen de perfil del usuario activo', async () => {
    await useAuthStore.getState().login('julljoll@gmail.com', 'Karupano')
    const fakeImageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErJggg=='
    
    useAuthStore.getState().updateProfileImage(fakeImageBase64)
    expect(useAuthStore.getState().user?.profileImage).toBe(fakeImageBase64)
  })
})
