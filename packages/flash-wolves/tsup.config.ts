import { defineConfig } from 'tsup'

export default defineConfig({
  splitting: false,
  sourcemap: false,
  clean: true,
  dts: true,
  outDir: 'dist',
  entryPoints: ['src/index.ts'],
})
