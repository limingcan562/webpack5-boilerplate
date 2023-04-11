const webpackDevConfig = require('./dev');
const webpackProdConfig = require('./prod');
const webpackCommonConfig = require('./common');
const envMode = process.argv.findIndex(item => item.includes('production'));
const is_pro = envMode !== -1; // 判断当前是生产环境，还是开发环境
const {merge} = require('webpack-merge');

const webpackFinalConfig = is_pro ? merge(webpackCommonConfig, webpackProdConfig) : merge(webpackCommonConfig, webpackDevConfig);
module.exports = webpackFinalConfig;

