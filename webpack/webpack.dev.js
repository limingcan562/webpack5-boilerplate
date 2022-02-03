// dev版
const 
webpack = require('webpack'),
path = require('path'),
webpackBaseConfig = require('./webpack.base'),
{
    port,
    staticFileName,
    devOutPutPath,
} = webpackBaseConfig;

const webpackDevConfig = {
    mode: 'development',
    devtool: 'inline-source-map',
    output: {
        publicPath: devOutPutPath,
    },
    devServer: {
        // public的文件会被映射到根目录下，访问http://localhost:8080，实际访问的就是public文件夹下的文件
        static: {
            directory: path.resolve(__dirname, `../${staticFileName}`),
        },

        /**
         * 表示打包生成的静态文件所在的位置，意思是url访问的路径
         * 改变dist访问的路径，outpath需要跟他一致，启动访问的url为http://localhost:8080/devdir/index.html
         */
        devMiddleware: {
            publicPath: devOutPutPath,
        },

        // 让服务器可以被外部访问
        host: '0.0.0.0',

        port: port
    },

    module: {
        rules: [
            // 编译css文件
            {
                test: /\.(css|less)$/i,
                use: 
                [
                    'style-loader',
                    'css-loader',
                    'less-loader'
                ]
            }
        ]
    },

    plugins: [
        // 注入项目中可以访问的全局变量
        new webpack.DefinePlugin({
            'DEBUG': 1
        })
    ]
};
module.exports = webpackDevConfig;