const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const finalConfig = require('./webpack.config');


const compiler = Webpack(finalConfig);
const devServerOptions = { ...finalConfig.devServer};
const server = new WebpackDevServer(devServerOptions, compiler);

const localIPv4 = WebpackDevServer.internalIPSync('v4');
const localIPv6 = WebpackDevServer.internalIPSync('v6');

const readline = require('readline');

const runServer = async () => {
    // console.log('Starting server...');
    // await server.start();
    // console.clear();
};


server.startCallback(() => {
    console.clear();
    console.log(`=> Your project runs on:\n${localIPv4}`);
});

runServer();
