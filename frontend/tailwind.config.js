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
          950: '#f6f8fc',
          900: '#ffffff',
          850: '#f8fafc',
          800: '#ffffff',
          750: '#eef2ff',
          700: '#e2e8f0',
        },
        cyan: {
          glow: '#00f2fe',
        }
      },
      boxShadow: {
        panel: '0 12px 30px rgba(15, 23, 42, 0.07), 0 1px 2px rgba(15, 23, 42, 0.04)',
        'panel-hover': '0 16px 34px rgba(6, 182, 212, 0.12), 0 0 0 1px rgba(6, 182, 212, 0.2)',
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
