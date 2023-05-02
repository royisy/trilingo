/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      gridTemplateColumns: {
        20: 'repeat(20, minmax(0, 1fr))',
      },
      width: {
        128: '32rem',
      },
    },
  },
  safelist: ['bg-green-500', 'bg-red-500', 'bg-gray-500'],
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['light', 'dark'],
    darkTheme: 'dark',
  },
}
