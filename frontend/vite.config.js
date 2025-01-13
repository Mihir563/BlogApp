import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'frontend/dist',  // Ensure this is the correct output directory
  },
  publicDir: 'public',  // Ensure the public directory is correctly set
});
