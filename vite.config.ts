import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://music-gen-demo-cuowj29hg-omars-projects-b5a3697e.vercel.app',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
