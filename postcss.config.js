/* 
    Postcss 的配置
    PostCSS 是基于 Node js 运行的一个处理 css 的工具
    所以他的配置文件也是运行在Node.js中的
 */

module.exports = {
  // 要使用的相关插件
  plugins: {
    // 自动添加浏览器厂商声明浅醉 用来兼容不同的浏览器
    // vue@cli 已经默认 配置了 autoprefixer 不用自己配置
    /* autoprefixer: {
      // 要兼容到的系统环境 要配置这个 可以写到  .browserslistrc 配置文件中
      browsers: ["Android >= 4.0", "iOS >= 8"]
    }, */

    // 把 px 转换为 rem
    "postcss-pxtorem": {
      rootValue: 37.5,
      propList: ["*"]
    }
  }
};
