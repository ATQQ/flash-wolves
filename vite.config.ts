// vite.config.js
import path from 'path'

module.exports = {
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'index.js'
    },
    rollupOptions: {
      
    }
  }
}