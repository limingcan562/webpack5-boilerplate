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
{getProPublicPath, getMoveList, getOnEndConfig} = require('./tool');


const webpackProConfig = {
    mode: 'production',
    devtool: 'source-map',
    output: {
        publicPath: getProPublicPath(config), 
        clean: true
    },

    // stats: {
        // assets: true,
        // colors: true,
        // modules: true,
        // entrypoints: false,
    // },

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