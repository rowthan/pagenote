import {defineConfig} from 'dumi';

export default defineConfig({
  outputPath: 'docs-dist',
  themeConfig: {
    name: 'pagenote',
  },
  externals:{
   //  react: 'React',
   // 'react-dom': 'ReactDOM'
  },
  chainWebpack: (config) => {
     // config.module
     //   .rule('sheet')
     //    .test(/\.style\.scss/)
     //    .use('raw-loader')
     //      .loader('raw-loader')
      // .use('sass-loader')
      // .loader('sass-loader')
      // .end()
      // .use('postcss-loader')
      // .loader('postcss-loader')
      // .end();

    // config.module
    //   .rule('css')
    //   .oneOf('inline')
    //   .resourceQuery(/inline/)
    //   .end()
    //   .use('raw-loader')
    //   .loader('raw-loader')
    //   .end()
    //   .use('css-loader')
    //   .loader('css-loader')
    //   .end()
    //   .use('sass-loader')
    //   .loader('sass-loader')
    //   .end()
    //   .use('postcss-loader')
    //   .loader('postcss-loader')
    //   .end();

    // config.module
    //   .rule('sass')
    //   .oneOf('inline')
    //     .resourceQuery('inline')
    //     .use('raw-loader')
    //       .loader('raw-loader')
    //       .end()
      // .use('sass-loader')
      // .loader('sass-loader')
      // .end()
      // .use('postcss-loader')
      // .loader('postcss-loader')
      // .end()
      // .end()



  },
});
