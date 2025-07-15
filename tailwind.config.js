module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'colour-1': '#000000',
        'colour-2': '#ccc',
        'colour-3': '#e4d4ff',
        'colour-4': '#f0f0f0',
        'colour-5': '#181818',
        'colour-6': '#242424',
        'accent': '#8b3dff',
        'gradient-start': '#8b3dff',
        'gradient-end': '#1a1a1a',
        'background-color': '#16101b',
        'blur-bg': '#16101b66',
        'blur-border': '#84719040',
      },
      spacing: {
        'size': '70vw',
        'top': '50%',
      },
      filter: {
        'blur-40': 'blur(40px)',
      },
      opacity: {
        '60': '0.6',
      },
      animation: {
        'zoom-gradient': 'zoom_gradient 6s infinite alternate',
      },
      keyframes: {
        zoom_gradient: {
          '0%': { transform: 'translate(-50%, -50%) scale(1)' },
          '100%': { transform: 'translate(-50%, -50%) scale(1.5)' },
        }
      }
    },
  },
  plugins: [require('@preline/plugin')],
}