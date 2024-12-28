import type { Config } from 'tailwindcss';

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: '#4E0D80',
        baseColor: '#4F26DE',
        secondary: '#f5f7fa',
        dark: {
          100: '#282C36',
          200: '#344054',
          300: '#252525',
          400: '#171719',
          500: '#09090B',
          600: '#131316',
          700: '#1A1A1A',
        },
        grey: {
          100: '#D0D5DD',
          200: '#667185',
          300: '#98A0B3',
          400: '#F2F6FF',
          500: '#667085',
          600: '#C3CAD9',
          700: '#4E5668',
          800: '#282C36',
          900: '#79777E',
          base: '#353438',
          stroke: "E9EAEB"
        },
        red: {
          secondary: "#FEEDED"
        }
      },
    },
  },
  plugins: [],
} satisfies Config;
