/** @type {import('tailwindcss').Config} */

const plugin = require('tailwindcss/plugin')

module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      textShadow: {
        sm: '0 1px 2px var(--tw-shadow-color)',
        DEFAULT: '0 2px 4px var(--tw-shadow-color)',
        lg: '0 8px 16px var(--tw-shadow-color)',
        xl: '4px 8px 20px var(--tw-shadow-color)',
      },
      spacing: {
        '1/3': '33%',
        '1/2': '50%',
        '16/9': '56.25%',
        full: '100%',
      },
      colors: {
        transparent: 'transparent',
        burgundy: '#9f3e52',
      },
      fontFamily: {
        body: ['Roboto Regular', 'Open Sans', 'ui-sans-serif'],
        bold: ['Roboto Bold', 'Open Sans', 'ui-sans-serif'],
        title: ['GT Sectra Bold', 'ui-serif'],
        serif: ['GT Sectra Regular', 'ui-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@rvxlab/tailwind-plugin-ios-full-height'),
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'text-shadow': (value) => ({
            textShadow: value,
          }),
        },
        { values: theme('textShadow') }
      )
    }),
  ],
}
