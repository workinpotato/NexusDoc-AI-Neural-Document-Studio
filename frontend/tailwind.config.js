/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        space: {
          950: '#04060a',
          900: '#06080f',
          850: '#0a0f1d',
          800: '#0f172a',
          750: '#15203b',
          700: '#1e293b',
        },
        cyan: {
          glow: '#00f2fe',
        }
      },
      boxShadow: {
        panel: '0 20px 50px -10px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        'panel-hover': '0 24px 60px -10px rgba(6, 182, 212, 0.12), 0 0 0 1px rgba(6, 182, 212, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'cyan-glow': '0 0 25px -5px rgba(6, 182, 212, 0.45)',
        'teal-glow': '0 0 25px -5px rgba(20, 184, 166, 0.45)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-spin': 'spin 12s linear infinite',
      }
    },
  },
  plugins: [],
}
