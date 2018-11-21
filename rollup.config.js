import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
  input: 'assets/js/app.js',
  plugins: [
    nodeResolve({ jsnext: true }),
    commonjs()
  ],
  output: {
    format: 'iife',
    sourceMap: true,
    file: 'bundle.js'
  }
}
