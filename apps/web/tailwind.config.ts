import type { Config } from 'tailwindcss'
export default {
  darkMode: ['class'],
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
        'gray-description': 'var(--gray-description)',
        'gray-secondary': 'var(--gray-secondary)',
        'light-primary': 'var(--light-primary)',
        'background-inactive': 'var(--background-inactive)',
        'dark-primary': 'var(--dark-primary)',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        }
      },
      screens: {
        xs: '450px'
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      boxShadow: {
        'dashboard-header': '0 1px 2px 0 rgba(0, 0, 0, 0.17)',
        default: '0 2px 6px 0 rgba(28, 29, 29, 0.25)'
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
} satisfies Config
