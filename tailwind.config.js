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
        // ── Fluent UI (redefined for macOS Light Theme) ──
        fluent: {
          bg: {
            DEFAULT: '#F5F5F7',
            secondary: '#FFFFFF',
          },
          surface: 'rgba(0, 0, 0, 0.025)',
          surfaceHover: 'rgba(0, 0, 0, 0.05)',
          surfaceActive: 'rgba(0, 0, 0, 0.01)',
          border: 'rgba(0, 0, 0, 0.08)',
          text: {
            DEFAULT: '#1D1D1F',
            muted: '#86868B',
          },
          accent: {
            DEFAULT: '#0071E3',
            light: '#4393E6',
            dark: '#0054a6',
            fg: '#ffffff',
          },
          acrylic: 'rgba(255, 255, 255, 0.65)',
        },
        // ── CMS Compliance (redefined for macOS Light Theme) ──
        cms: {
          bg:         '#F5F5F7',           // macOS system gray background
          sidebar:    'rgba(246, 246, 246, 0.72)', // macOS Finder sidebar translucent
          card:       '#FFFFFF',           // macOS card background
          surface:    '#F5F5F7',           // macOS system gray
          border:     'rgba(0, 0, 0, 0.08)', // macOS divider
          text:       '#1D1D1F',           // macOS primary label
          textMuted:  '#86868B',           // macOS secondary label
          accent:     '#0071E3',           // Apple System Blue
          accent2:    '#4393E6',           // Apple Light Blue
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
