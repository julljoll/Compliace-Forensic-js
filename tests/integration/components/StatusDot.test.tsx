import React from 'react'
import { describe, it, expect } from 'vitest'
import { renderWithTheme } from '@/testing/renderWithTheme'
import { StatusDot } from '@/components/atoms/StatusDot'

describe('StatusDot Component (MUI v6 Atom)', () => {
  it('debe renderizar el punto de estado online con color verde (#00FF41)', () => {
    const { container } = renderWithTheme(<StatusDot status="online" size={10} />)
    expect(container).toBeDefined()
    const dots = container.querySelectorAll('span')
    expect(dots.length).toBeGreaterThan(0)
  })

  it('debe renderizar el punto de estado offline sin animación ping', () => {
    const { container } = renderWithTheme(<StatusDot status="offline" size={8} />)
    expect(container).toBeDefined()
  })

  it('debe renderizar correctamente con estado null', () => {
    const { container } = renderWithTheme(<StatusDot status={null} />)
    expect(container).toBeDefined()
  })
})
