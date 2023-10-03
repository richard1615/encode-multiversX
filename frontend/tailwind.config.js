/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'light-cream': '#E8DDD9',
        'light-brown': '#BDA193',
        'leaf-green': '#9BB068',
        'mindful-gray-10': '#F7F4F2',
        'mindful-gray-80': '#4B3425',
        'mindful-gray-40': '#BDA193',
        'mindful-gray-100': '#1F160F',
        'empathy-orange-10': '#FFF0EB',
        'empathy-orange-40': '#FE814B',
      },
      borderRadius: {
        'custom': '45px',
      },
    },
  },
  plugins: [],
}
