// import { terser } from 'rollup-plugin-terser'

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
    // terser()
  ]
}