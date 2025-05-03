# DnD New System

Sistema de juego de rol de Dungeons & Dragons desarrollado con React y TypeScript.

## Estructura del Proyecto

```
src/
├── app/                    # Configuración y rutas de la aplicación
│   ├── config/            # Configuraciones globales
│   ├── routes/            # Definición de rutas
│   ├── providers/         # Proveedores de contexto
│   ├── Home.tsx          # Página principal
│   └── Home.css          # Estilos de la página principal
│
├── features/              # Características principales del juego
│   ├── world-map/        # Funcionalidad del mapa del mundo
│   ├── character-sheet/  # Hoja de personaje
│   ├── game-systems/     # Sistemas de juego
│   ├── combat/           # Sistema de combate
│   ├── inventory/        # Sistema de inventario
│   └── quests/           # Sistema de misiones
│
├── shared/               # Componentes y utilidades compartidas
│   ├── components/       # Componentes reutilizables
│   │   ├── UI/          # Componentes de interfaz de usuario
│   │   ├── Layout/      # Componentes de diseño
│   │   ├── Forms/       # Componentes de formularios
│   │   ├── Icons/       # Iconos SVG
│   │   └── ErrorPage/   # Página de error
│   ├── utils/           # Utilidades y helpers
│   │   ├── helpers/     # Funciones auxiliares
│   │   ├── constants/   # Constantes
│   │   ├── hooks/       # Hooks personalizados
│   │   └── types/       # Tipos e interfaces
│   └── hooks/           # Hooks compartidos
│
├── services/            # Servicios de la aplicación
│   ├── api/            # Servicios de API
│   ├── auth/           # Servicios de autenticación
│   ├── storage/        # Servicios de almacenamiento
│   └── game/           # Servicios específicos del juego
│
├── database/           # Configuración y operaciones de base de datos
│   ├── migrations/     # Migraciones de la base de datos
│   ├── seeds/         # Datos iniciales
│   └── queries/       # Consultas SQL
│
├── core/              # Lógica central del juego
├── assets/           # Recursos estáticos
└── interfaces/       # Interfaces y tipos globales
```

## Características Principales

- Gestión de personajes
- Sistema de combate
- Inventario y equipamiento
- Mapas y ubicaciones
- Misiones y objetivos
- Sistemas de juego personalizables

## Tecnologías Utilizadas

- React
- TypeScript
- Vite
- React Query
- SQLite
- CSS Modules

## Instalación

1. Clonar el repositorio
2. Instalar dependencias: `npm install`
3. Iniciar el servidor de desarrollo: `npm run dev`

## Convenciones de Código

- Utilizar TypeScript para todo el código
- Seguir los principios de Clean Architecture
- Mantener los componentes pequeños y reutilizables
- Documentar funciones y componentes principales
- Utilizar CSS Modules para los estilos

## Estructura de Componentes

- Cada componente debe tener su propio directorio
- Incluir archivo de estilos y tests cuando sea necesario
- Exportar componentes a través de archivos index.ts
- Mantener la lógica de negocio separada de la UI

## Contribución

1. Crear una rama para la nueva característica
2. Realizar los cambios siguiendo las convenciones
3. Asegurar que los tests pasan
4. Crear un Pull Request con una descripción detallada

## Licencia

MIT
