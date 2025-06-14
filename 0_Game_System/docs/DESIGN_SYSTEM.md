# Sistema de Diseño D&D - Documentación

Este documento cataloga el sistema de diseño utilizado en el proyecto D&D, mapeando las variables CSS personalizadas con sus equivalentes en Tailwind CSS para facilitar un enfoque híbrido.

## Paleta de Colores

### Colores Primarios
| Variable CSS | Valor | Equivalente Tailwind | Uso |
|-------------|-------|---------------------|------|
| `--bg-form-neutral` | `#C1C3C7` | `theme('colors.form-neutral')` | Fondo neutral para formularios |
| `--bg-form-orden` | `#0E79B2` | `theme('colors.form-orden')` | Tema "Orden" - color principal |
| `--bg-form-caos` | `#E4572E` | `theme('colors.form-caos')` | Tema "Caos" - color principal |
| `--bg-color-1` | `#E5E7EB` | `theme('colors.color-1')` | Color de fondo secundario |
| `--bg-color-2` | `#191716` | `theme('colors.color-2')` | Color oscuro - casi negro |
| `--bg-color-3` | `#F2AF29` | `theme('colors.color-3')` | Color primario - amarillo/dorado |
| `--bg-color-4` | `#E63462` | `theme('colors.color-4')` | Color de acento - rojo/rosa |
| `--bg-color-5` | `#9E2A2B` | `theme('colors.color-5')` | Rojo oscuro |
| `--bg-color-6` | `#DD8E2A` | `theme('colors.color-6')` | Naranja |
| `--bg-color-7` | `#31E981` | `theme('colors.color-7')` | Verde brillante |
| `--bg-color-8` | `#388697` | `theme('colors.color-8')` | Azul verdoso |
| `--bg-color-9` | `#7F5A83` | `theme('colors.color-9')` | Púrpura |

### Mapeos Semánticos
| Variable CSS | Valor | Equivalente Tailwind | Uso |
|-------------|-------|---------------------|------|
| `--primary` | `var(--bg-color-3)` | `theme('colors.primary')` | Color primario de la aplicación |
| `--danger` | `var(--bg-color-4)` | `theme('colors.danger')` | Color para errores y alertas |
| `--success` | `var(--bg-color-7)` | `theme('colors.success')` | Color para éxitos |
| `--required-color` | `var(--bg-color-4)` | `theme('colors.required')` | Color para campos requeridos |
| `--bg-color-btn-dice` | `var(--bg-color-3)` | `theme('colors.btn-dice')` | Color de botones de dados |
| `--bg-title` | `var(--bg-color-3)` | `theme('colors.bg-title')` | Color de títulos |
| `--bg-loader` | `var(--bg-color-3)` | `theme('colors.bg-loader')` | Color de loaders |

### Colores de Borde y Texto
| Variable CSS | Valor | Equivalente Tailwind | Uso |
|-------------|-------|---------------------|------|
| `--border-light` | `#e5e7eb` | `theme('colors.border-light')` | Bordes claros |
| `--border-medium` | `#d1d5db` | `theme('colors.border-medium')` | Bordes medios |
| `--border-dark` | `#9ca3af` | `theme('colors.border-dark')` | Bordes oscuros |
| `--text-primary` | `#1f2937` | `theme('colors.text-primary')` | Texto principal |
| `--text-secondary` | `#374151` | `theme('colors.text-secondary')` | Texto secundario |
| `--text-muted` | `#6b7280` | `theme('colors.text-muted')` | Texto atenuado |

### Colores de Fondo
| Variable CSS | Valor | Equivalente Tailwind | Uso |
|-------------|-------|---------------------|------|
| `--bg-grey-lighter` | `#f9fafb` | `theme('colors.bg-grey-lighter')` | Fondo gris claro |
| `--bg-main` | `#f8fafc` | `theme('colors.bg-main')` | Fondo principal |

## Sistema Tipográfico

### Tamaños de Fuente
| Variable CSS | Valor | Equivalente Tailwind | Notas |
|-------------|-------|---------------------|-------|
| `--font-size-xs` | `0.75rem` (12px) | `text-xs` | Texto extra pequeño |
| `--font-size-sm` | `0.875rem` (14px) | `text-sm` | Texto pequeño |
| `--font-size-base` | `1rem` (16px) | `text-base` | Texto base |
| `--font-size-lg` | `1.125rem` (18px) | `text-lg` | Texto grande |
| `--font-size-xl` | `1.25rem` (20px) | `text-xl` | Texto extra grande |
| `--font-size-2xl` | `1.5rem` (24px) | `text-2xl` | Texto 2x grande |
| `--font-size-3xl` | `1.875rem` (30px) | `text-3xl` | Texto 3x grande |

### Altura de línea
| Variable CSS | Valor | Equivalente Tailwind | Uso |
|-------------|-------|---------------------|------|
| `--line-height-tight` | `1.25` | `leading-tight` | Altura de línea ajustada |
| `--line-height-normal` | `1.5` | `leading-normal` | Altura de línea normal |
| `--line-height-relaxed` | `1.75` | `leading-relaxed` | Altura de línea relajada |

### Peso de Fuente
| Variable CSS | Valor | Equivalente Tailwind | Uso |
|-------------|-------|---------------------|------|
| `--font-weight-normal` | `400` | `font-normal` | Peso normal |
| `--font-weight-medium` | `500` | `font-medium` | Peso medio |
| `--font-weight-semibold` | `600` | `font-semibold` | Peso semi-negrita |
| `--font-weight-bold` | `700` | `font-bold` | Peso negrita |
| `--font-weight-black` | `900` | `font-black` | Peso negro/extra-negrita |

## Sistema de Espaciado

| Variable CSS | Valor | Equivalente Tailwind | Uso |
|-------------|-------|---------------------|------|
| `--spacing-xs` | `0.25rem` (4px) | `p-1`, `m-1`, `gap-1` | Espaciado extra pequeño |
| `--spacing-sm` | `0.5rem` (8px) | `p-2`, `m-2`, `gap-2` | Espaciado pequeño |
| `--spacing-md` | `0.75rem` (12px) | `p-3`, `m-3`, `gap-3` | Espaciado medio |
| `--spacing-lg` | `1rem` (16px) | `p-4`, `m-4`, `gap-4` | Espaciado grande |
| `--spacing-xl` | `1.25rem` (20px) | `p-5`, `m-5`, `gap-5` | Espaciado extra grande |
| `--spacing-2xl` | `1.5rem` (24px) | `p-6`, `m-6`, `gap-6` | Espaciado 2x grande |
| `--spacing-3xl` | `2rem` (32px) | `p-8`, `m-8`, `gap-8` | Espaciado 3x grande |
| `--spacing-4xl` | `2.5rem` (40px) | `p-10`, `m-10`, `gap-10` | Espaciado 4x grande |

### Espaciado de Grid
| Variable CSS | Valor | Equivalente Tailwind | Uso |
|-------------|-------|---------------------|------|
| `--grid-gap-tight` | `0.5rem` | `gap-2` | Espaciado de grid ajustado |
| `--grid-gap-normal` | `0.75rem` | `gap-3` | Espaciado de grid normal |
| `--grid-gap-relaxed` | `1rem` | `gap-4` | Espaciado de grid relajado |
| `--grid-gap-loose` | `1.25rem` | `gap-5` | Espaciado de grid suelto |

## Sistema de Bordes

### Radios de Borde
| Variable CSS | Valor | Equivalente Tailwind | Uso |
|-------------|-------|---------------------|------|
| `--border-radius-sm` | `0.375rem` | `rounded` | Radio pequeño |
| `--border-radius-md` | `0.5rem` | `rounded-md` | Radio medio |
| `--border-radius-lg` | `0.75rem` | `rounded-lg` | Radio grande |
| `--border-radius-xl` | `1rem` | `rounded-xl` | Radio extra grande |
| `--border-card` | `0.5rem` | `rounded-md` | Radio para tarjetas (legacy) |

## Sistema de Sombras

| Variable CSS | Valor | Equivalente Tailwind | Uso |
|-------------|-------|---------------------|------|
| `--shadow-sm` | `0 1px 2px 0 rgba(0, 0, 0, 0.05)` | `shadow-sm` | Sombra pequeña |
| `--shadow-md` | `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)` | `shadow` | Sombra media |
| `--shadow-lg` | `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)` | `shadow-lg` | Sombra grande |
| `--shadow-xl` | `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)` | `shadow-xl` | Sombra extra grande |

## Sistema de Focus Ring y Transiciones

### Focus Ring
| Variable CSS | Valor | Equivalente Tailwind | Uso |
|-------------|-------|---------------------|------|
| `--focus-ring` | `0 0 0 3px rgba(242, 175, 41, 0.1)` | `ring-2 ring-primary ring-opacity-10` | Anillo de enfoque estándar |
| `--focus-ring-orden` | `0 0 0 3px rgba(14, 121, 178, 0.1)` | `ring-2 ring-form-orden ring-opacity-10` | Anillo de enfoque Orden |
| `--focus-ring-caos` | `0 0 0 3px rgba(228, 87, 46, 0.1)` | `ring-2 ring-form-caos ring-opacity-10` | Anillo de enfoque Caos |

### Transiciones
| Variable CSS | Valor | Equivalente Tailwind | Uso |
|-------------|-------|---------------------|------|
| `--transition-fast` | `all 0.15s ease` | `transition duration-150 ease-in-out` | Transición rápida |
| `--transition-normal` | `all 0.2s ease` | `transition duration-200 ease-in-out` | Transición normal |
| `--transition-slow` | `all 0.3s ease` | `transition duration-300 ease-in-out` | Transición lenta |

## Componentes Únicos que Requieren CSS Personalizado

### 1. Efectos de Tema Orden/Caos
- Gradientes personalizados
- Patrones de fondo específicos
- Variables dinámicas contextuales

### 2. Estructura de Grid para Hojas de Personaje
- Sistema de `grid-template-areas`
- Espacios dinámicos entre secciones
- Optimizaciones responsivas específicas

### 3. Efectos Visuales Avanzados
- Degradados con `color-mix()`
- Efectos de hover con transformación
- Sombras compuestas

### 4. Elementos de Formulario Personalizados
- Estilos para inputs numéricos
- Campos para habilidades e inventario
- Transiciones de enfoque específicas

## Notas sobre Compatibilidad

Mantener CSS personalizado para:
- Características modernas de CSS como `color-mix()`
- Patrones visuales específicos
- Efectos que requieren múltiples propiedades
- Interacciones complejas con el estado del usuario

Migrar a Tailwind:
- Utilidades básicas de posicionamiento y espaciado
- Clases de grid genéricas
- Utilidades de alineación y visualización
- Flexbox y tamaños básicos
