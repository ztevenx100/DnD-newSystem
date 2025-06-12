export default {
  plugins: {
    'postcss-import': {},
    tailwindcss: {},
    'postcss-nesting': { 
      // Configuración específica para que reconozca @apply y otras directivas de Tailwind
      noIsPseudoSelector: true 
    },
    autoprefixer: {},
    '@unocss/postcss': {},
  }
}
