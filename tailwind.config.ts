import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'blueprint-blue': '#1d4ed8',
        'bg-primary': '#eef2f6',
      },
      fontFamily: {
        'dm-sans': ['"DM Sans"', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'pop-in': 'popIn 0.4s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'scale(0.98)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        popIn: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
