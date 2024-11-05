import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['firebase/auth', 'firebase/app', 'firebase/firestore', 'firebase/storage'] // add other Firebase modules if needed
    }
  }
});
