const path = require('path');
const fs = require('fs');
const os = require("os");

// 返回页面配置的entry
const getPageEntry = pageConfig => {
    const entryConfig = {};
    pageConfig.forEach(item => {
        const entryName = item.name;
        const entryPath = item.path;

        entryConfig[entryName] = entryPath;
    });
    // console.log(entryConfig);
    return entryConfig;
};

// 判断staticFileName文件夹存不存在，不存在就创建
const createStaticFile = fileName => {
    const 
    myPath = path.resolve(__dirname, `../${fileName}`);
    content = '# Description\nWhen you initialize the project for the first time and set the staticFileName configuration, but there is no staticFileName folder locally, the staticFileName folder will be generated, along with this file.  \n\n\n**The folder staticFileName will not be compiled by the webpack.**',
    creatingFileName = '[common.js]',
    createText = [`${creatingFileName} Create a`, 'folder']

    // 文件不存在，创建
    if (fileName && !fs.existsSync(myPath)) {
        const
        white = '\033[37m<i>\033[0m',
        yellow1 = '\033[33m'+createText[0]+'\033[0m',
        green2 = '\033[32m'+fileName+'\033[0m',
        yellow2 = '\033[33m'+createText[1]+'\033[0m';
        
        fs.mkdirSync(myPath);

        fs.writeFileSync(path.resolve(__dirname, `../${fileName}/README.md`), content);

        console.log(white, yellow1, green2, yellow2);
    }
};


const getProPublicPath = config => {
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
}

// 获取需要把js\css 放入proResFileName文件夹的移动列表
const getMoveList = config => {
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
}

const getOnEndConfig = config => {
    let 
    { staticFileName, outDistFileName} = config,
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
}


module.exports = {
    getPageEntry,
    createStaticFile,
    getProPublicPath,
    getMoveList,
    getOnEndConfig,
};