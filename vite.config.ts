// vite.config.js
import path from 'path'

module.exports = {
  build: {
    target: 'es2015',
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'fw',
      formats: ['es', 'cjs', 'umd', 'iife'],
      fileName: 'index',
    },
  },
}
