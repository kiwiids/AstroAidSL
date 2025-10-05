import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  base: '/AstroAidSL/', // crucial for GitHub Pages
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Keep other aliases if absolutely necessary, but they might break GitHub Pages if they rely on npm versions
    },
  },
  build: {
    target: 'esnext',
    outDir: 'docs', // <-- changed from 'dist' to 'docs'
    sourcemap: true, // optional, helpful for debugging
  },
  server: {
    port: 3000,
    open: true,
  },
});