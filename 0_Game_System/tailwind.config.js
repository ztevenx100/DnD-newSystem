import { nextui } from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      // Extendiendo colores con variables CSS personalizadas
      colors: {
        // Colores principales de formularios
        'form-neutral': 'var(--bg-form-neutral)',
        'form-orden': 'var(--bg-form-orden)',
        'form-caos': 'var(--bg-form-caos)',
        // Colores numerados
        'color-1': 'var(--bg-color-1)',
        'color-2': 'var(--bg-color-2)',
        'color-3': 'var(--bg-color-3)',
        'color-4': 'var(--bg-color-4)',
        'color-5': 'var(--bg-color-5)',
        'color-6': 'var(--bg-color-6)',
        'color-7': 'var(--bg-color-7)',
        'color-8': 'var(--bg-color-8)',
        'color-9': 'var(--bg-color-9)',
        // Mapeos semánticos
        'primary': 'var(--primary)',
        'danger': 'var(--danger)',
        'success': 'var(--success)',
        'required': 'var(--required-color)',
        'btn-dice': 'var(--bg-color-btn-dice)',
        'bg-title': 'var(--bg-title)',
        'bg-loader': 'var(--bg-loader)',
        // Colores de texto y borde
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        'border-light': 'var(--border-light)',
        'border-medium': 'var(--border-medium)',
        'border-dark': 'var(--border-dark)',
        'bg-grey-lighter': 'var(--bg-grey-lighter)',
        'bg-main': 'var(--bg-main)',
      },
      // Espaciado personalizado
      spacing: {
        'xs': 'var(--spacing-xs)',
        'sm': 'var(--spacing-sm)',
        'md': 'var(--spacing-md)',
        'lg': 'var(--spacing-lg)',
        'xl': 'var(--spacing-xl)',
        '2xl': 'var(--spacing-2xl)',
        '3xl': 'var(--spacing-3xl)',
        '4xl': 'var(--spacing-4xl)',
      },
      // Tamaños de fuente
      fontSize: {
        'xs': 'var(--font-size-xs)',
        'sm': 'var(--font-size-sm)',
        'base': 'var(--font-size-base)',
        'lg': 'var(--font-size-lg)',
        'xl': 'var(--font-size-xl)',
        '2xl': 'var(--font-size-2xl)',
        '3xl': 'var(--font-size-3xl)',
      },
      // Alturas de línea
      lineHeight: {
        'tight': 'var(--line-height-tight)',
        'normal': 'var(--line-height-normal)',
        'relaxed': 'var(--line-height-relaxed)',
      },
      // Pesos de fuente
      fontWeight: {
        'normal': 'var(--font-weight-normal)',
        'medium': 'var(--font-weight-medium)',
        'semibold': 'var(--font-weight-semibold)',
        'bold': 'var(--font-weight-bold)',
        'black': 'var(--font-weight-black)',
      },
      // Bordes redondeados
      borderRadius: {
        'sm': 'var(--border-radius-sm)',
        'DEFAULT': 'var(--border-radius-md)',
        'md': 'var(--border-radius-md)',
        'lg': 'var(--border-radius-lg)',
        'xl': 'var(--border-radius-xl)',
        'card': 'var(--border-card)',
      },
      // Sombras
      boxShadow: {
        'sm': 'var(--shadow-sm)',
        'DEFAULT': 'var(--shadow-md)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'xl': 'var(--shadow-xl)',
      },
      // Utilidades personalizadas para grid
      gridTemplateColumns: {
        'auto-fit-xs': 'repeat(auto-fit, minmax(8rem, 1fr))',
        'auto-fit-sm': 'repeat(auto-fit, minmax(12rem, 1fr))',
        'auto-fit-md': 'repeat(auto-fit, minmax(16rem, 1fr))',
        'auto-fit-lg': 'repeat(auto-fit, minmax(20rem, 1fr))',
      },
    },
  },
    darkMode: "class",
    safelist: [
    // Clases estructurales importantes
    'form-sheet',
    'fieldset-form',
    'form-title',
    'info-player',
    'stats-player',
    'initial-armament',
    'skills-player',
    'inventory-player',
    // Variantes de tema
    'orden',
    'caos',
    // Clases CSS personalizadas usadas dinámicamente
    'form-lbl', 'form-lbl-y', 'form-lbl-skills',
    'form-input', 'form-input-y',
    'grid-area-title', 'grid-area-info', 'grid-area-stats',
    'grid-area-armament', 'grid-area-skills', 'grid-area-inventory',
    'numeric-input',
  ],
  plugins: [nextui({
    prefix: "nextui", // prefix for themes
    addCommonColors: true, // override common colors (e.g. "blue", "green", "red")
    defaultTheme: "light", // default theme from the themes object
    defaultExtendTheme: "light", // default theme to extend on custom themes
    layout: {}, // common layout tokens (applied to all themes)
    themes: {
      light: {
        layout: {}, // light theme layout tokens
        colors: {}, // light theme colors
      },
      dark: {
        layout: {}, // dark theme layout tokens
        colors: {}, // dark theme colors
      },
    },
  })]
}