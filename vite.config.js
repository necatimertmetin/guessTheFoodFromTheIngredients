import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Tüm IP adreslerinden erişimi sağlamak için
    port: 5173, // Geliştirme sunucusu için kullanılacak port
    strictPort: true, // Eğer port meşgulse başka bir port deneme
    cors: true, // CORS ayarlarını açmak için
  },
});
