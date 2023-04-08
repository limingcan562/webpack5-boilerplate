// webpack生产环境配置
const 
webpack = require('webpack'),
MiniCssExtractPlugin = require("mini-css-extract-plugin"),
FileManagerPlugin = require('filemanager-webpack-plugin'),
CssMinimizerPlugin = require("css-minimizer-webpack-plugin"),
config = require('../webpack.config'),
TerserPlugin = require("terser-webpack-plugin"),
{
    outDistFileName,
    outCssFileName,
    staticFileName,
    hashNum,
} = config,
// 获取生产环境的publicPath
getProPublicPath = config => {
    let proPublicPath = '';

    // 直接是cdn地址
    if (config.proPublicPath && !config.proResFileName) {
        proPublicPath = `${config.proPublicPath}/`;
    } 
    // 有cdn绝对路径 && 把js\css\media\img 放入proResFileName文件夹
    else if (config.proPublicPath && config.proResFileName) {
        proPublicPath = `${config.proPublicPath}/${config.proResFileName}/`;
    }
    // 打包出来后需要js\css\media\img 放入proResFileName文件夹
    else if (config.proResFileName) {
        proPublicPath = `./${config.proResFileName}/`;
    }
    // 不需要把js\css\media\img 放入proResFileName文件夹
    else if (!config.proResFileName) {
        proPublicPath = './';
    }
    return proPublicPath;
},
// 获取需要把js\css 放入proResFileName文件夹的移动列表
getMoveList = config => {
    let 
    {
        outDistFileName,
        outJsFileName,
        outCssFileName,
        proResFileName
    } = config,
    moveList = [];

    if (config.proResFileName) {
        moveList = [
            {
                source: `./${outDistFileName}/${outJsFileName}`, 
                destination: `./${outDistFileName}/${proResFileName}/${outJsFileName}`
            },
            {
                source: `./${outDistFileName}/${outCssFileName}`, 
                destination: `./${outDistFileName}/${proResFileName}/${outCssFileName}`
            }
        ];
    }

    return moveList;
},

getOnEndConfig = config => {
    let 
    { staticFileName} = config,
    onEndConfig = {
        move: getMoveList(config)
    };

    if (staticFileName) {
        onEndConfig.copy = [
            {
                source: `./${staticFileName}/`, 
                destination: `./${outDistFileName}/`
            },
        ];
    };
    
    return onEndConfig;
};


const webpackProConfig = {
    mode: 'production',
    devtool: 'source-map',
    output: {
        publicPath: getProPublicPath(config), 
        clean: true
    },
    module: {
        rules: [
            // 编译css文件，分离css代码
            {
                test: /\.(css|less)$/i,
                use: 
                // 生产
                [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options:{   
                            publicPath: '../',
                        }
                    },
                    'css-loader',
                    'less-loader'
                ]
            },
        ]
    },
    
    plugins: [
        // 添加banner说明
        new webpack.BannerPlugin({
            banner: 
            '----------------------------------\n'+
            '@author：-lMC燦\n'+
            '@date：'+new Date().getFullYear()+'.'+parseInt(new Date().getMonth()+1)+'.'+new Date().getDate()+'\n'+
            '@contact：leemimgcan@gmail.com\n'+
            '----------------------------------',
            entryOnly: true,
        }),

        // 分离css
        new MiniCssExtractPlugin({
            filename: `${outCssFileName}/[name]-[contenthash:${hashNum}].css`,
            chunkFilename: `${outCssFileName}/[id]-[contenthash:${hashNum}].css`
        }),

        // 注入项目中可以访问的全局变量
        new webpack.DefinePlugin({
            'DEBUG': 0
        }),

        // 将资源移动到 assets 文件夹下
        new FileManagerPlugin({
            events: {
                onEnd: {
                    ...getOnEndConfig(config)
                },
            }
        }),
    ],

    // 优化
    optimization: {
        minimizer: [
            // 压缩css
            new CssMinimizerPlugin(),

            // 去掉生成的LICENSE.txt，将版权信息置于banner内
            new TerserPlugin({
                extractComments: false
            }),

            // '...' 来访问默认值。（不加的话，js不会压缩，一定要放最后）
            '...'
        ],
    },
}

module.exports = webpackProConfig;