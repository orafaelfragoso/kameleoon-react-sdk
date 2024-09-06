import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: {
    entry: 'src/index.ts',
    resolve: true,
  },
  outDir: 'dist',
  sourcemap: true,
  minify: true,
  clean: true,
  external: ['react', 'react-dom'],
})
