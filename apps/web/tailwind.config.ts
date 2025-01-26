import type { Config } from 'tailwindcss'
export default {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        'navy-primary': 'var(--navy-primary)',
        'navy-tertiary': 'var(--navy-tertiary)',
        'blue-primary': 'var(--blue-primary)',
        'blue-secondary': 'var(--blue-secondary)',
        'orange-primary': 'var(--orange-primary)',
        'gray-primary': 'var(--gray-primary)',
        'gray-secondary': 'var(--gray-secondary)',
        'light-primary': 'var(--light-primary)',
        'background-inactive': 'var(--background-inactive)',
        'dark-primary': 'var(--dark-primary)'
      },
      screens: {
        xs: '450px'
      }
    }
  },
  plugins: []
} satisfies Config
