import { defineConfig } from 'vite';  // Make sure this is imported!
import React from 'react'
export default defineConfig({
  plugins: [React()],
  build: {
    outDir: 'dist', 
  },
});
