import babel from 'rollup-plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import typescript from '@rollup/plugin-typescript';

/**多入口打包*/ 
const INPUTS = [
  'components',
  'pagenote'
]

const configList = INPUTS.map(function(filename){
  return {
    input: `src/${filename}.ts`,
    output: [{
      file: `dist/${filename}.js`,
      format: 'cjs',
    },{
      file: `dist/${filename}.esm.js`,
      format: 'esm',
    },{
      file: `dist/${filename}.umd.js`,
      name: filename.split('/')[0],
      format: 'umd',
    }],
    plugins: [
      resolve(),
      typescript(),
      babel({
        exclude: 'node_modules/**',
      }),
      commonjs(),
      postcss({
        extract: false, // 不提取CSS文件
        plugins: [
          require('tailwindcss'),
          require('autoprefixer'),
        ],
        inject: true,
      }),
    ],
    external: ['react', 'react-dom'],
  }
})

export default configList;