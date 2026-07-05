/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dev-bg': '#040705',
        'dev-bg-sec': '#08110C',
        'dev-nav': '#0C160F',
        'dev-green': '#2CE67D',
        'dev-green-hover': '#42FF96',
        'dev-success': '#37E88F',
        'dev-info': '#5FAFFF',
        'dev-warn': '#FFC857',
        'dev-danger': '#FF5D73',
        'dev-text': '#F4F4F4',
        'dev-text-sec': '#8C9399',
        'dev-blue': '#80BFFF',
        'dev-purple': '#A78BFA',
        'dev-orange': '#FF9D4D',
      },
      fontFamily: {
        sans: ['"Geist Sans"', 'sans-serif'],
        mono: ['"Geist Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}