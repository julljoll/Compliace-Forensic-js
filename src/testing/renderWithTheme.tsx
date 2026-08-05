import React, { ReactNode } from 'react'
import { render, RenderOptions } from '@testing-library/react'

interface ProvidersProps {
  children: ReactNode
}

const AllTheProviders = ({ children }: ProvidersProps) => {
  return (
    <>
      {children}
    </>
  )
}

export function renderWithTheme(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: AllTheProviders, ...options })
}

export * from '@testing-library/react'
