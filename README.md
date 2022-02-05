# webpack5-boilerplate
基于webpack5搭建的脚手架/webpack5-boilerplate

## Features
- 基于`webpack5`搭建的脚手架
- 支持第三方代码分割
- 支持`ES6`语法编译
- 编译`Less`
- 支持自己的模块代码分割
- 支持多页面打包

## File Structure
```
├── package.json
├── public
│   └── favicon.ico
├── src
│   ├── assets
│   │   ├── font
│   │   ├── img
│   │   ├── media
│   │   └── styles
│   ├── entry
│   │   ├── index.js
│   │   └── share.js
│   └── pages
│       ├── index.html
│       └── share.html
└── webpack
    ├── webpack.base.js
    ├── webpack.common.js
    ├── webpack.dev.js
    └── webpack.prod.js
```  
- `package.json`：相关依赖
- `public`： 不会被`webpack`编译的文件，打包后会直接输出到打包的根目录下
- `src`：开发过程中的代码，会被`webpack`编译
- `entry`: 入口文件
- `pages`：要被编译的`html`模板
- `webpack`：关于`webpack`的相关配置
- `webpack.base.js`：一些全局变量，作用于开发，生产中
- `webpack.common.js`：`webpack`开发跟生产配置中的共用配置
- `webpack.dev.js`：`development`模式的配置（本地开发）
- `webpack.prod.js`：`production`模式的配置（生产上线）

## Usage  
- 安装依赖  
`npm i`  
- 开启开发模式  
`npm start`  
- 打包  
`npm run build`  
- 如果要分割自己的代码模块，在`webpack.common.js`里面开启以下代码就可以了  
```javascript
myplugin: {
    name: 'myplugin',
    test(module) {
        // `module.resource` contains the absolute path of the file on disk.
        // Note the usage of `path.sep` instead of / or \, for cross-platform compatibility.
        // console.log(module.resource, 111);
        // console.log(module.resource && module.resource.includes(`${path.sep}Myplugins${path.sep}`));
        return(
            module.resource &&
            module.resource.includes(`${path.sep}plugins${path.sep}myplugin`)
        );
    },
    minSize: 0, //表示在压缩前的最小模块大小,默认值是 30kb
    priority: 10,  // 优先级要大于 vendors 不然会被打包进 vendors
    chunks: 'initial' // 将什么类型的代码块用于分割，三选一： "initial"：入口代码块 | "all"：全部 | "async"：按需加载的代码块
},
```

## Instruction
- 本地开发过程中，开启了`webpack-dev-server`，保存在内存中的打包文件目录结构：
    ```
    (http://localhost:8080/)
    ├── js
    ├── img
    ├── font
    ├── media
    ├── favicon.ico
    ├── index.html
    └── share.html
    ```  
    > `dev`模式下`css`直接渲染到内联`<style></style>`，没有分离出来，为了加快开发预览速度；  
    `js`是做了代码分割的，因为`webpack`里面，个人觉得代码分割模块比较复杂，所以开发环境生产环境都进行了分割，这样有问题可以提前在开发环境发现，如果不想在开发环境下代码分割，把`webpack.common.js`里面的`optimization`移到`webpack.prod.js`就好了
- 打包以后的目录结构：
    ```
    dist
    ├── css
    ├── js
    ├── img
    ├── font
    ├── media
    ├── favicon.ico
    ├── index.html
    └── share.html
    ```  
    > 会把`css`，`js`，`img`，`media`分离  

## Attention  
- `webpack.base.js`里面的`proPublicPath`字段，可用于打包后，`html`访问静态资源的绝对路径。例如静态资源部署了`cdn`，那就可以把值设置为`cdn`路径
- `webpack.base.js`里面的`staticFileName`字段，表示不经过`webpack`打包的静态资源目录，**生产打包后会直接拷贝到打包文件夹根目录下**
- `webpack.base.js`里面的`proResFileName`字段，表示将`js、css、media、img`等静态资源放入`proResFileName`文件夹，`dist`包根目录只留`html`文件或其他文件，方便部署。例如`proResFileName`的值为`assets`时，则打包后的结构为：  
    ```
    dist
    ├── assets
    │   ├── css
    │   ├── font
    │   ├── img
    │   ├── js
    │   └── media
    ├── favicon.ico
    ├── index.html
    └── share.html
    ```
- `public`文件夹里面的文件命名，避免跟`src`下的文件名相同，否则打包后会覆盖掉`src`下的打包出来的文件  

## End
- 对于这个脚手架的更多的分析，可以看看我这个文章[关于Webpack5搭建的一些体会](https://limingcan562.github.io/posts/build-webpack5-feeling)
- 欢迎大家`Fork`学习交流
- 脚手架里面都写了注释了，如果觉得好用，欢迎大家`Star`  
