import type { Metadata, Viewport } from 'next'
import MuiRegistry from '@/components/providers/MuiRegistry'
import '../index.css'

export const metadata: Metadata = {
  title: 'SHA256.US — Compliance Forense CMS',
  description: 'CMS de Compliance Forense para gestión normativa y control del proceso técnico-forense en dispositivos móviles.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SHA256.US CMS',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#000000',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&family=Fira+Code:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>
        <MuiRegistry>
          {children}
        </MuiRegistry>
      </body>
    </html>
  )
}

