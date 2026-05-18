/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Fluent UI (original) ──
        fluent: {
          bg: {
            DEFAULT: '#181818',
            secondary: '#2c2c2c',
          },
          surface: 'rgba(255, 255, 255, 0.05)',
          surfaceHover: 'rgba(255, 255, 255, 0.08)',
          surfaceActive: 'rgba(255, 255, 255, 0.03)',
          border: 'rgba(255, 255, 255, 0.08)',
          text: {
            DEFAULT: '#ffffff',
            muted: 'rgba(255, 255, 255, 0.7)',
          },
          accent: {
            DEFAULT: '#FECF06',
            light: '#FFE46B',
            dark: '#524000',
            fg: '#524000',
          },
          acrylic: 'rgba(32, 32, 32, 0.7)',
        },
        // ── CMS Compliance (Corporativo) ──
        cms: {
          bg:         '#0B0F19',
          sidebar:    '#111827',
          card:       '#1F2937',
          surface:    '#374151',
          border:     'rgba(255,255,255,0.07)',
          text:       '#F9FAFB',
          textMuted:  '#9CA3AF',
          accent:     '#2563EB',
          accent2:    '#3B82F6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'fluent-btn': '4px',
        'fluent-card': '0.75rem', // 12px
      },
      backdropBlur: {
        fluent: '20px',
      },
      boxShadow: {
        fluent: '0 4px 8px 0 rgba(0,0,0,0.2), 0 1px 2px 0 rgba(0,0,0,0.1)',
        'fluent-elevated': '0 8px 16px 0 rgba(0,0,0,0.2), 0 2px 4px 0 rgba(0,0,0,0.1)',
        'cms': '0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)',
      },
      transitionDuration: {
        '167': '167ms',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.35s ease-out forwards',
      },
    },
  },
  plugins: [],
}
