import { terser } from 'rollup-plugin-terser'
import babel from '@rollup/plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'

export default {
  input: 'src/main.js',
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
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      extensions: ['.js', '.ts']
    }),
    nodeResolve(),
    // terser()
  ]
}