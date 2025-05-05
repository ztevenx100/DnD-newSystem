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
    react()
  ],
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
  define: {
    'process.env.NEXT_PUBLIC_SUPABASE_URL': JSON.stringify(process.env.NEXT_PUBLIC_SUPABASE_URL),
    'process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src/"),
      "@assets": path.resolve(__dirname, "./src/assets/"),
      "@components": path.resolve(__dirname, "./src/shared/components/"),
      "@features": path.resolve(__dirname, "./src/features/"),
      "@shared": path.resolve(__dirname, "./src/shared/"),
      "@utils": path.resolve(__dirname, "./src/shared/utils/"),
      "@services": path.resolve(__dirname, "./src/shared/services/"),
      "@interfaces": path.resolve(__dirname, "./src/shared/interfaces/"),
      "@database": path.resolve(__dirname, "./src/database/"),
      "@types": path.resolve(__dirname, "./src/shared/utils/types/"),
      "@UI": path.resolve(__dirname, "./src/shared/components/UI/"),
      "@Icons": path.resolve(__dirname, "./src/shared/components/UI/Icons/")
    },
  },
})
