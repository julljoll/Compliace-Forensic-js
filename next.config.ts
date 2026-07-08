import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  experimental: {},
  async redirects() {
    return [
      { source: '/compliance', destination: '/control/seguimiento-compliance', permanent: true },
      { source: '/forense/manual-avilla', destination: '/forense/tutoriales', permanent: true },
      { source: '/forense/manual-serverless', destination: '/forense/tutoriales', permanent: true },
      { source: '/forense/adb-backup', destination: '/forense/tutoriales', permanent: true },
      { source: '/forense/apk-downgrade', destination: '/forense/tutoriales', permanent: true },
      { source: '/forense/whatsapp-parser', destination: '/forense/tutoriales', permanent: true },
      { source: '/forense/integridad', destination: '/forense/tutoriales', permanent: true },
      { source: '/manual-avilla', destination: '/forense/tutoriales', permanent: true },
      { source: '/sistemas/manual-avilla', destination: '/forense/tutoriales', permanent: true },
      { source: '/manual-serverless', destination: '/forense/tutoriales', permanent: true },
      { source: '/planillas/seguimiento', destination: '/control/seguimiento-compliance', permanent: true },
      { source: '/correo-forense', destination: '/forense/tutoriales', permanent: true },
      { source: '/sistemas/correo-electronico', destination: '/forense/tutoriales', permanent: true },
      { source: '/sistemas/correo-corporativo', destination: '/forense/tutoriales', permanent: true },
      { source: '/tareas', destination: '/', permanent: true },
    ]
  },
}

export default nextConfig
