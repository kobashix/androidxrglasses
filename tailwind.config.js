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
          bg:         '#080c18',
          'bg-alt':   '#0c1220',
          surface:    '#0f1629',
          'surface-2':'#141e35',
          border:     '#1e2d4a',
          'border-2': '#2a3f63',
          cyan:       '#00c8ff',
          purple:     '#a78bfa',
          orange:     '#fb923c',
          green:      '#34d399',
          red:        '#f87171',
          'text-1':   '#f0f4ff',
          'text-2':   '#c5cfe0',
          'text-3':   '#8b9ab5',
          muted:      '#5a6a85',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      maxWidth: {
        '8xl': '88rem',
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#c5cfe0',
            a: { color: '#00c8ff' },
            h2: { color: '#f0f4ff' },
            h3: { color: '#f0f4ff' },
            strong: { color: '#f0f4ff' },
            code: { color: '#a78bfa' },
          }
        }
      }
    },
  },
  plugins: [],
}
