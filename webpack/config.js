/* --------关于webpack此脚手架可DIY的一些配置--------*/
const path = require('path');
const config = {
    proPublicPath: '', // 生产环境下，编译后的资源访问的绝对路径（可以放cdn路径什么的）
    proResFileName: 'assets', // 生产环境打包后，js\css\media\img 放入assets文件夹，dist包根目录只留html文件，方便部署
    outCssFileName: 'css', // 导出的 css 文件夹名字
    outImageFileName: 'img', // 导出的 图片 文件夹名字
    outFontFileName: 'font', // 导出的 字体 文件夹名字
    outMediaFileName: 'media', // 导出的 媒体 文件夹名字
    outJsFileName: 'js', //  导出的 js 文件夹名字
    staticFileName: 'public', // dev模式访问的静态资源，生产环境，要直接copy到根目录
    outDistFileName: 'dist', // 存放打包出来的文件夹名
    hashNum: 5, // 打包文件几位哈希值
    port: 8088, // dev模式的端口
    devOutPutPath: '/', // 开发环境下，编译后的资源访问的路径


    // 页面配置
    pageConfig: [
        {
            name: 'index',
            path: path.resolve(__dirname, `../src/entry/index.js`),
            title: 'index'
        },
        {
            name: 'share',
            path: path.resolve(__dirname, `../src/entry/share.js`),
            title: 'share'
        }
    ]
};

module.exports = config;