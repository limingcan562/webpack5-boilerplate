// 关于webpack的一些基本配置
const path = require('path');

const baseConfig = {
    proPublicPath: '', // 生产环境下，编译后的资源访问的路径（可以放cdn什么的）
    devOutPutPath: '/', // 开发环境下，编译后的资源访问的路径

    proResFileName: '', // 生产环境打包后，js\css\media\img 放入assets文件夹，dist包根目录只留html文件，方便部署
    outCssFileName: 'css', // 导出的 css 文件夹名字
    outImageFileName: 'img', // 导出的 图片 文件夹名字
    outFontFileName: 'font', // 导出的 字体 文件夹名字
    outMediaFileName: 'media', // 导出的 媒体 文件夹名字
    outJsFileName: 'js', //  导出的 js 文件夹名字
    staticFileName: 'public', // dev模式访问的静态资源，生产环境，要直接copy到根目录
    outDistFileName: 'dist', // 存放打包出来的文件夹名
    hashNum: 5, // 打包文件几位哈希值
    port: 8088, // dev模式的端口
    

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
    ],

    // 返回页面配置的entry
    getPageEntry() {
        const entryConfig = {};
        this.pageConfig.forEach(item => {
            const entryName = item.name;
            const entryPath = item.path;

            entryConfig[entryName] = entryPath;
        });
        // console.log(entryConfig);
        return entryConfig;
    },

    // 获取生产环境的publicPath
    getProPublicPath() {
        let proPublicPath = '';

        // 直接是cdn地址
        if (this.proPublicPath && !this.proResFileName) {
            proPublicPath = `${this.proPublicPath}/`;
        } 
        // 有cdn绝对路径 && 把js\css\media\img 放入proResFileName文件夹
        else if (this.proPublicPath && this.proResFileName) {
            proPublicPath = `${this.proPublicPath}/${this.proResFileName}/`;
        }
        // 打包出来后需要js\css\media\img 放入proResFileName文件夹
        else if (this.proResFileName) {
            proPublicPath = `./${this.proResFileName}/`;
        }
        // 不需要把js\css\media\img 放入proResFileName文件夹
        else if (!this.proResFileName) {
            proPublicPath = './';
        }
        return proPublicPath;
    },

    // 获取需要把js\css 放入proResFileName文件夹的移动列表
    getMoveList() {
        let 
        {
            outDistFileName,
            outJsFileName,
            outCssFileName,
            proResFileName
        } = this,
        moveList = [];

        if (this.proResFileName) {
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
    }
}

module.exports = baseConfig;