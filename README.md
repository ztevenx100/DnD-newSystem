# DnD New System

Un sistema web moderno para gestionar partidas de D&D (Dungeons & Dragons) con un enfoque simplificado y dinámico. El sistema implementa mecánicas personalizadas basadas en el concepto "Azar de las dos manos".

![Vista previa del sistema](https://github.com/user-attachments/assets/7c416bd1-3baf-4f5b-bbee-ca3b1eccecaf)

## 🎯 Características Principales

- **Sistema de Personajes**
  - 6 clases únicas (Guerrero, Mago, Explorador, Médico, Investigador, Actor)
  - 5 razas jugables (Humano, Elfo, Enano, Aasimars, Tieflings)
  - 6 profesiones base (Cazador, Herrero, Artista, Sabio, Sacerdote, Estratega)

- **Mecánicas de Juego**
  - Sistema de estadísticas basado en 6 atributos principales
  - Habilidades por clase y extras
  - Sistema de alineación (Orden/Caos)
  - Anillos de poder desbloqueables
  - Inventario dinámico con sistema de monedas

## 🛠️ Tecnologías

- **Frontend**
  - React v18.3.1
  - TypeScript v5.5.4
  - NextUI v2.4.6
  - React Hook Form v7.52.2

- **Estilado**
  - TailwindCSS v3.4.7
  - UnoCSS v0.61.8

- **Backend & Base de Datos**
  - Supabase v2.45.0
  - UUID v9.0.8

- **Desarrollo**
  - Vite v5.3.5

## 🚀 Inicio Rápido

1. **Instalación**
```bash
# Clonar el repositorio
git clone https://github.com/yourusername/DnD-newSystem.git

# Navegar al directorio
cd DnD-newSystem/0_Game_System

# Instalar dependencias
npm install
```

2. **Configuración**
```bash
# Crear archivo .env basado en .env.example
cp .env.example .env

# Configurar variables de Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key
```

3. **Desarrollo**
```bash
# Iniciar servidor de desarrollo
npm run dev
```

## 📊 Estructura del Proyecto

```
0_Game_System/
├── src/
│   ├── components/     # Componentes React
│   ├── services/      # Servicios y APIs
│   ├── interfaces/    # Types y interfaces
│   └── utils/        # Utilidades
├── public/           # Archivos estáticos
└── sql/             # Scripts SQL
```

## 🎮 Guía de Uso

### Creación de Personaje
1. Seleccionar clase, raza y profesión
2. Asignar puntos de estadísticas
3. Elegir habilidades iniciales
4. Personalizar inventario inicial

### Sistema de Niveles
- Nivel 1-2: Habilidades básicas
- Nivel 3-5: Primer anillo de poder
- Nivel 6-8: Segundo anillo de poder
- Nivel 9-10: Tercer anillo de poder

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor, lee las guías de contribución antes de enviar un PR.

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 🙋‍♂️ Soporte

Si tienes alguna pregunta o sugerencia, no dudes en:
1. Abrir un issue
2. Enviar un pull request
3. Contactar al equipo de desarrollo
