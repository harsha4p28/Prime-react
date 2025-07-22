import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['fd3ab4ce-1bc4-4625-b4a6-fc03e2cbc74f-00-1am65vvuhto1p.pike.replit.dev'],
  },
});