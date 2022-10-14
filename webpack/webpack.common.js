// 开发环境与生产环境公用的配置
const 
fs = require('fs'),
path = require('path'),
webpackDevConfig = require('./webpack.dev'),
webpackProdConfig = require('./webpack.prod'),
config = require('./config'),
HtmlWebpackPlugin = require('html-webpack-plugin'),
{merge} = require('webpack-merge'),
envMode = process.argv.findIndex(item => item.includes('production')),
is_pro = envMode !== -1, // 判断当前是生产环境，还是开发环境
{
    outFontFileName,
    outMediaFileName,
    outImageFileName,
    outDistFileName,
    outJsFileName,
    hashNum,
    proResFileName,
    staticFileName,
    pageConfig,
} = config,
// 返回页面配置的entry
getPageEntry = pageConfig => {
    const entryConfig = {};
    pageConfig.forEach(item => {
        const entryName = item.name;
        const entryPath = item.path;

        entryConfig[entryName] = entryPath;
    });
    // console.log(entryConfig);
    return entryConfig;
},
// 判断staticFileName文件夹存不存在，不存在就创建
createStaticFile = fileName => {
    const 
    myPath = path.resolve(__dirname, `../${fileName}`);
    content = 'This file is created for the first time and will not be compiled by webpack.',
    creatingFileName = '[webpack.common.js]',
    createText = [`${creatingFileName} Create a`, 'folder']

    // 文件不存在，创建
    if (fileName && !fs.existsSync(myPath)) {
        const
        white = '\033[37m<i>\033[0m',
        yellow1 = '\033[33m'+createText[0]+'\033[0m',
        green2 = '\033[32m'+fileName+'\033[0m',
        yellow2 = '\033[33m'+createText[1]+'\033[0m';
        
        fs.mkdirSync(myPath);

        fs.writeFileSync(path.resolve(__dirname, `../${fileName}/test.txt`), content);

        console.log(white, yellow1, green2, yellow2);
    }
};

// 生成staticFileName目录
createStaticFile(staticFileName);


const webpackCommonConfig = {
    // 入口
    entry: getPageEntry(pageConfig),
    output: {
        path: path.resolve(__dirname, `../${outDistFileName}`),
        filename: `${outJsFileName}/[name]-[contenthash:${hashNum}].js`,

        // 控制的是import() 出来的js，默认与filename一样
        chunkFilename: `${outJsFileName}/[name]-[contenthash:${hashNum}].js`, 
    },

    // 快速引入对应模块
    resolve: {
        alias: {
            plugins: path.resolve(__dirname, '../src/assets/plugins/'),
        },
    },

    // loader编译
    module: {
        rules: [
            // 编译图片
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset',
                // 设置图片导出大小，如果小于预设的值，则会被转化成base64
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024 // 4kb
                    }
                },

                // 设置导出的路径为 img
                generator: {
                    filename:  `${outImageFileName}/[name]-[hash:${hashNum}][ext][query]`,
                    outputPath: is_pro ? proResFileName : ''
                }
            },

            // 编译字体
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset',

                // 设置字体导出大小，如果小于预设的值，则会被转化成base64
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024 // 10kb
                    }
                },

                // 设置导出的路径为 font
                generator: {
                    filename:  `${outFontFileName}/[name]-[hash:${hashNum}][ext][query]`,
                    outputPath: is_pro ? proResFileName : ''
                }
            },

            // 编译音乐 || 视频
            {
                test: /\.(mp4|mp3)$/,
                type: 'asset/resource',
                // 设置导出的路径为 font
                generator: {
                    filename:  `${outMediaFileName}/[name]-[hash:${hashNum}][ext][query]`,
                    outputPath: is_pro ? proResFileName : ''
                }
            },

            // babal编译js文件
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    },

    // 分割代码
    optimization: {
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                /**
                 * ---- 关于 chunks 值说明 -----
                 * @initial 代表只有直接在入口import进来会被分割
                 * @async 代表只有异步加载的模块会被分割
                 * @all 代表前两者都会被分割
                 **/

                // 分割自己写的插件代码
                /* myplugin: {
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
                }, */
    
                // 将 node_modules 里面的插件再分割出来
                // jquery: {
                //     name: 'jquery',
                //     test: /[\\/]node_modules[\\/]jquery[\\/]/,
                //     priority: 6,  // 优先级要大于 vendors 不然会被打包进 vendors
                //     chunks: 'initial' // 将什么类型的代码块用于分割，三选一： "initial"：入口代码块 | "all"：全部 | "async"：按需加载的代码块
                // },

                // 公用的js，最少被引用了两次打包
                commons: {
                    name:  'commons',
                    minSize: 0, //表示在压缩前的最小模块大小,默认值是 30kb
                    minChunks: 2, // 最小公用次数
                    reuseExistingChunk: true, // 公共模块必开启
                    chunks: 'all',
                    priority: 1, // 优先级
                },
    
                // 打包 node_modules 里面的第三方插件
                defaultVendors: {
                    name: 'vendors',
                    test: /[\\/]node_modules[\\/]/,
                    reuseExistingChunk: true,
                    chunks: 'initial',  // 将什么类型的代码块用于分割，三选一： "initial"：入口代码块 | "all"：全部 | "async"：按需加载的代码块
                    priority: 5,
                },
            },
        },
    },
    
    // 插件
    plugins: []
}

// 多页面打包
pageConfig.forEach(item => {
    const name = item.name;
    const title = item.title;

    // 编译html模板
    const htmlWebpackPlugin = new HtmlWebpackPlugin({
        // 打包输出HTML
        title,
        minify: {
            // 压缩 HTML 文件
            removeComments: true, // 移除 HTML 中的注释
            collapseWhitespace: true, // 删除空白符与换行符
            minifyCSS: true // 压缩内联 css
        },
        inject: 'body',
        filename: `${name}.html`, // 生成后的文件名
        template: path.resolve(__dirname, `../src/pages/${name}.html`), // 根据此模版生成 HTML 文件
        chunks: [name]
    });

    webpackCommonConfig.plugins.push(htmlWebpackPlugin);
});

module.exports = (env, argv) => {
    let envConfig = argv.mode === 'production' ? webpackProdConfig : webpackDevConfig;
    // console.log(env, 0);
    // console.log(argv, 1);
    // console.log(envConfig, 111);
    // console.log(merge(webpackCommonConfig, envConfig));
    return merge(webpackCommonConfig, envConfig) // 合并 公共配置 和 环境配置
}