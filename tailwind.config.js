/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './**/*.html',
    './assets/js/**/*.js',
    '!./node_modules/**'
  ],
  theme: {
    extend: {
      colors: {
        xr: {
          bg:           '#ffffff',
          'bg-2':       '#f8fafc',
          surface:      '#f1f5f9',
          border:       '#e2e8f0',
          'border-dark':'#cbd5e1',
          blue:         '#2563eb',
          'blue-hover': '#1d4ed8',
          'blue-tint':  '#eff6ff',
          red:          '#dc2626',
          'red-tint':   '#fef2f2',
          green:        '#16a34a',
          'green-tint': '#f0fdf4',
          purple:       '#7c3aed',
          'purple-tint':'#f5f3ff',
          orange:       '#ea580c',
          'orange-tint':'#fff7ed',
          header:       '#0f172a',
          'header-2':   '#1e293b',
          text1:        '#0f172a',
          text2:        '#334155',
          text3:        '#64748b',
          muted:        '#94a3b8',
        }
      },
      fontFamily: {
        sans:  ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'serif'],
      },
      maxWidth: {
        '8xl': '88rem',
      },
      fontSize: {
        'display': ['2.5rem', { lineHeight: '1.1', fontWeight: '700' }],
      }
    },
  },
  plugins: [],
}
