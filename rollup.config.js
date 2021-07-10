import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: [
    { 
      file:'dist/index.js',
      name:'fw',
      format: 'cjs',
    },
    // { 
    //   file:'dist/index.es.js',
    //   name:'fw',
    //   format: 'es',
    // },
    // { 
    //   file:'dist/index.cjs.js',
    //   name:'fw',
    //   format: 'cjs',
    // },
  ],
  plugins: [
    resolve(),
    commonjs(), // 将 CommonJS 转换成 ES2015 模块供 Rollup 处理
    typescript({
        target: 'es5',
        include: ['src/**/*.ts'],
        esModuleInterop: true,
        "module":'esnext'
      }) // 解析TypeScript
  ]
}; 