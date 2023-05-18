/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit',
  purge: ['./*.{html}', './src/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: [
    'bg-green-500',
    'bg-red-500',
    'bg-gray-500',
    'bg-opacity-10',
    'bg-opacity-20',
    'bg-opacity-30',
    'bg-opacity-40',
    'bg-opacity-50',
    'bg-opacity-60',
    'bg-opacity-70',
    'bg-opacity-80',
    'bg-opacity-90',
    'bg-opacity-100',
  ],
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['light', 'dark'],
    darkTheme: 'dark',
  },
}
