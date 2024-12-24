/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      width: {
        120: '40rem', // 30rem을 w-120으로 정의
      },
    },
  },
  plugins: [],
};
