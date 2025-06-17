// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts', // Updated entry point
  output: [
    {
      file: 'dist/index.cjs.js', // CommonJS output for Node.js environments
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/index.esm.js', // ES module output for modern bundlers
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    resolve(), // Resolve modules from node_modules
    commonjs(), // Convert CommonJS modules to ES6
    typescript({ 
      tsconfig: './tsconfig.build.json'
    }), // TypeScript support with declaration files
  ],
  external: ['react', 'react-dom'], // Mark React and ReactDOM as external
};
