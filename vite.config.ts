import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react"; // Importar el plugin de React para Vite

export default defineConfig({
  base: '/', // Añadir base relativa
  plugins: [tailwindcss(), react(), tsconfigPaths()], // Usar el plugin de React
  preview: {
    allowedHosts: ['ig04co8gcs4owogcs4occcgc.46.62.225.65.sslip.io', 'localhost', '0.0.0.0']
  }
});
