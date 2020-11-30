import { terser } from 'rollup-plugin-terser'
import babel from '@rollup/plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'

export default {
  input: 'src/main.ts',
  output: [
    {
      file: 'dist/bundle.umd.js',
      format: 'umd',
      name: 'Toolkit'
    },
    {
      file: 'dist/bundle.es.js',
      format: 'es',
    },
    {
      file: 'dist/bundle.common.js',
      format: 'cjs',
    }
  ],
  plugins: [
    typescript(),
    babel({
      babelHelpers: 'bundled',
      include: 'src/**',
      extensions: ['.js']
    }),
    nodeResolve(),
    // terser()
  ]
}