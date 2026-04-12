module.exports = {
  content: [
    './app/**/*.{ts,tsx,js,jsx}',
    './pages/**/*.{ts,tsx,js,jsx}',
    './components/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#f6f6f6',
        fg: '#181818',
        accent: '#0a0a0a',
        accent2: '#eaeaea',
        primary: '#1a1a1a',
        secondary: '#fff',
        border: '#eaeaea',
      },
      fontFamily: {
        sans: [
          'Inter', 'Inter var', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'
        ],
        display: [
          'Space Grotesk', 'Inter', 'Inter var', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'
        ],
      },
      borderRadius: {
        flow: '18px',
      },
    },
  },
  plugins: [],
};
