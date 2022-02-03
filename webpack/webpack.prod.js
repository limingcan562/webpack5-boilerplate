// webpack生产环境配置
const 
webpack = require('webpack'),
MiniCssExtractPlugin = require("mini-css-extract-plugin"),
FileManagerPlugin = require('filemanager-webpack-plugin'),
CssMinimizerPlugin = require("css-minimizer-webpack-plugin"),
webpackBaseConfig = require('./webpack.base'),
{
    outDistFileName,
    outCssFileName,
    staticFileName,
} = webpackBaseConfig;

const webpackProConfig = {
    mode: 'production',
    devtool: 'source-map',
    output: {
        publicPath: webpackBaseConfig.getProPublicPath(), 
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
        /* new webpack.BannerPlugin({
            banner: 
            '----------------------------------\n'+
            '@author：-lMC燦\n'+
            '@date：'+new Date().getFullYear()+'.'+parseInt(new Date().getMonth()+1)+'.'+new Date().getDate()+'\n'+
            '@contact：leemimgcan@gmail.com\n'+
            '----------------------------------',
            entryOnly: true,
        }), */

        // 分离css
        new MiniCssExtractPlugin({
            filename: `${outCssFileName}[name].css`,
            chunkFilename: `${outCssFileName}[id].css`
        }),

        // 注入项目中可以访问的全局变量
        new webpack.DefinePlugin({
            'DEBUG': 0
        }),

        // 将资源移动到 assets 文件夹下
        new FileManagerPlugin({
            events: {
                onEnd: {
                    move: webpackBaseConfig.getMoveList(),
                    
                    // 拷贝不经过webpack打包的静态资源
                    copy: [
                        {
                            source: `./${staticFileName}/`, 
                            destination: `./${outDistFileName}/`
                        },
                    ],
                },
            }
        }),
    ],

    // 优化
    optimization: {
        minimizer: [
            // 压缩css
            new CssMinimizerPlugin(),

            // '...' 来访问默认值。（不加的话，js不会压缩）
            '...'
        ],
    },
}

module.exports = webpackProConfig;