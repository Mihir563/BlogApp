import { defineConfig } from 'vite';  // Make sure this is imported!
import react from '@vitejs/plugin-react';
import React from 'react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Ensure the output directory is 'dist'
  },
});
