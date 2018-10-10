import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs';

export default {
  entry: 'assets/js/app.js',
  format: 'umd',
  plugins: [
    nodeResolve({
      // use "jsnext:main" if possible
      // see https://github.com/rollup/rollup/wiki/jsnext:main
      jsnext: true
    }),
    commonjs()
  ],
  sourceMap: true,
  dest: 'path/to/your/dest.js'
}
