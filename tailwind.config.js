/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '480px', // extra-small — teléfonos pequeños
      },
      colors: {
        // ── Apple HIG Design System ──
        apple: {
          bg: {
            DEFAULT: 'var(--apple-bg)',
            secondary: 'var(--apple-bg-secondary)',
          },
          surface: 'var(--apple-surface)',
          surfaceHover: 'var(--apple-surface-hover)',
          surfaceActive: 'var(--apple-surface-active)',
          border: 'var(--apple-border)',
          text: {
            DEFAULT: 'var(--apple-text)',
            muted: 'var(--apple-text-muted)',
            secondary: 'var(--apple-text-secondary)',
          },
          accent: {
            DEFAULT: 'var(--apple-accent)',
            light: 'var(--apple-accent-light)',
            dark: 'var(--apple-accent-dark)',
            fg: '#ffffff',
          },
          acrylic: 'var(--apple-sidebar-bg)',
          red:    '#FF3B30',
          orange: '#FF9500',
          yellow: '#FFCC00',
          green:  '#34C759',
          mint:   '#00C7BE',
          teal:   '#30B0C7',
          cyan:   '#32ADE6',
          blue:   '#007AFF',
          indigo: '#5856D6',
          purple: '#AF52DE',
          pink:   '#FF2D55',
          brown:  '#A2845E',
          gray:   '#8E8E93',
          gray2:  '#AEAEB2',
          gray3:  '#C7C7CC',
          gray4:  '#D1D1D6',
          gray5:  '#E5E5EA',
          gray6:  '#F2F2F7',
        },

        // ── Legacy fluent-* aliases (mapped to Apple HIG) ──
        fluent: {
          accent: 'var(--apple-accent)',
          'accent-light': 'var(--apple-accent-light)',
          'accent-fg': '#ffffff',
          bg: 'var(--apple-bg)',
          border: 'var(--apple-border)',
          surface: 'var(--apple-bg-secondary)',
          surfaceActive: 'var(--apple-surface-active)',
          text: 'var(--apple-text)',
          'text-muted': 'var(--apple-text-muted)',
        },
        // ── Legacy cms-* aliases (mapped to Apple HIG) ──
        cms: {
          accent: 'var(--apple-accent)',
          border: 'var(--apple-border)',
          surface: 'var(--apple-bg)',
          textMuted: 'var(--apple-text-muted)',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"SF Pro Text"', '"Helvetica Neue"', 'Inter', 'sans-serif'],
      },
      fontSize: {
        'apple-title':   ['2rem',   { lineHeight: '1.2', fontWeight: '700', letterSpacing: '-0.025em' }],
        'apple-title2':  ['1.5rem', { lineHeight: '1.25', fontWeight: '700', letterSpacing: '-0.02em' }],
        'apple-headline':['1rem',   { lineHeight: '1.3', fontWeight: '600', letterSpacing: '0em' }],
        'apple-body':    ['0.875rem',{ lineHeight: '1.4', fontWeight: '400', letterSpacing: '0em' }],
        'apple-callout': ['0.8125rem',{lineHeight: '1.4', fontWeight: '400', letterSpacing: '0em' }],
        'apple-subhead': ['0.75rem', { lineHeight: '1.3', fontWeight: '500', letterSpacing: '0em' }],
        'apple-footnote':['0.6875rem',{lineHeight: '1.3', fontWeight: '400', letterSpacing: '0em' }],
        'apple-caption': ['0.625rem', { lineHeight: '1.2', fontWeight: '500', letterSpacing: '0.025em' }],
        'apple-caption2':['0.5625rem',{lineHeight: '1.2', fontWeight: '600', letterSpacing: '0.04em' }],
      },
      borderRadius: {
        'apple-btn': '8px',
        'apple-card': '16px',
        'apple-panel': '20px',
      },
      backdropBlur: {
        apple: '30px',
      },
      boxShadow: {
        'apple': '0 0 1px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
        'apple-elevated': '0 0 1px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.02)',
        'apple-modal': '0 0 1px rgba(0,0,0,0.1), 0 20px 60px rgba(0,0,0,0.08), 0 8px 20px rgba(0,0,0,0.06)',
      },
      transitionTimingFunction: {
        'apple-spring': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'apple-momentum': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'apple-fadeUp': 'fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'apple-fadeIn': 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'apple-scaleIn': 'scaleIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'apple-slideUp': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
    },
  },
  plugins: [],
}
