import type { Metadata, Viewport } from 'next'
import '../index.css'
import '@/styles/uswds-bootstrap-theme.css'

export const metadata: Metadata = {
  title: 'SHA256.US — Compliance Forense CMS',
  description: 'CMS de Compliance Forense Digital — Laboratorio de Informática Forense (USWDS & Bootstrap 5.3 Design System).',
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
  themeColor: '#112E51',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning data-bs-theme="light">
      <head>
        <meta name="color-scheme" content="light" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,700&family=Fira+Code:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
