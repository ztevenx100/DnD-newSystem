import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import UnoCSS from 'unocss/vite'
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    UnoCSS({
      configFile: '../uno.config.ts',
    }),
    react()  // Eliminamos la configuración incorrecta del plugin
  ],
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src/"),
      "@assets": `${path.resolve(__dirname, "./src/assets/")}`,
      "@img": `${path.resolve(__dirname, "./src/assets/img/")}`,
      "@components": `${path.resolve(__dirname, "./src/components/")}`,
      "@UI": `${path.resolve(__dirname, "./src/components/UI/")}`,
      "@Icons": `${path.resolve(__dirname, "./src/components/UI/Icons/")}`,
      "@pages": `${path.resolve(__dirname, "./src/components/pages/")}`,
      "@services": `${path.resolve(__dirname, "./src/services/")}`,
      "@database": `${path.resolve(__dirname, "./src/services/database/")}`,
      "@interfaces": `${path.resolve(__dirname, "./src/components/interfaces/")}`,
      "@utils": `${path.resolve(__dirname, "./src/components/utils/")}`,
    },
  },
})
