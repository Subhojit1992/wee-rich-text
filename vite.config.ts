// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: 'src/components/WeeRichText.tsx', // Path to your component
      name: 'WeeRichText',
      fileName: (format) => `wee-rich-text.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom'], // Exclude React and ReactDOM from the bundle
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
});
