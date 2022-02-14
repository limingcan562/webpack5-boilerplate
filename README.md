# webpack5-boilerplate
Scaffolding based on webpack5 | webpack5-boilerplate

English | [中文](https://github.com/limingcan562/webpack5-boilerplate/blob/main/README_CN.md)

## Features
- Scaffolding based on `webpack5`
- Support for third-party code splitting
- Support `ES6` syntax compilation
- Compile `Less`
- Support own module code splitting
- Support multi-page packaging

## File Structure
```
├── package.json
├── public
│   └── favicon.ico
├── src
│   ├── assets
│   │   ├── font
│   │   ├── img
│   │   ├── media
│   │   └── styles
│   ├── entry
│   │   ├── index.js
│   │   └── share.js
│   └── pages
│       ├── index.html
│       └── share.html
└── webpack
    ├── webpack.base.js
    ├── webpack.common.js
    ├── webpack.dev.js
    └── webpack.prod.js
```  
- `package.json`: related dependencies
- `public`: files that will not be compiled by `webpack` will be directly output to the root directory of the package after packaging
- `src`: code during development, which will be compiled by `webpack`
- `entry`: entry file
- `pages`: the `html` template to be compiled
- `webpack`: related configuration about `webpack`
- `webpack.base.js`: some global variables, used in development and production
- `webpack.common.js`: shared configuration in `webpack` development and production configuration
- `webpack.dev.js`: Configuration for `development` mode (local development)
- `webpack.prod.js`: `production` mode configuration (production goes live)

## Usage  
- Install dependencies  
`npm i`  
- Enable development mode  
`npm start`  
- Packaging production  
`npm run build`  
- If you want to split your own code modules, just open the following code in `webpack.common.js`    
```javascript
myplugin: {
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
    minSize: 0,
    priority: 10,
    chunks: 'initial'
},
```

## Instruction
- During the local development process, `webpack-dev-server` is enabled, and the package file directory structure stored in memory:
    ```
    (http://localhost:8080/)
    ├── js
    ├── img
    ├── font
    ├── media
    ├── favicon.ico
    ├── index.html
    └── share.html
    ```  
    > In `dev` mode, `css` is directly rendered to the inline `<style></style>`, which is not separated, in order to speed up the development preview;  
    `js` does code splitting, because in `webpack`, I personally think that the code splitting module is more complicated, so the development environment and production environment are divided, so that problems can be found in the development environment in advance. Code splitting, just move `optimization` in `webpack.common.js` to `webpack.prod.js`
- The directory structure after packaging:  
    ```
    dist
    ├── css
    ├── js
    ├── img
    ├── font
    ├── media
    ├── favicon.ico
    ├── index.html
    └── share.html
    ```  
    > Will separate `css`, `js`, `img`, `media`   

## Attention  
- The `proPublicPath` field in `webpack.base.js` can be used to access the absolute path of `html` static resources after packaging. For example, if a static resource deploys `cdn`, you can set the value to the `cdn` path
- The `staticFileName` field in `webpack.base.js` indicates that the static resource directory that is not packaged by `webpack` **will be copied directly to the root directory of the packaging folder after production packaging**
- The `proResFileName` field in `webpack.base.js` indicates that static resources such as `js, css, media, img` are placed in the `proResFileName` folder, and only the `html` file or the `dist` package root directory is left. Other files for easy deployment. For example, when the value of `proResFileName` is `assets`, the packaged structure is:
    ```
    dist
    ├── assets
    │   ├── css
    │   ├── font
    │   ├── img
    │   ├── js
    │   └── media
    ├── favicon.ico
    ├── index.html
    └── share.html
    ```
- The file name in the `public` folder should not be the same as the file name under `src`, otherwise the packaged file under `src` will be overwritten after packaging  

## End
- For more analysis of this scaffolding, you can see my article [some experience on Webpack5 construction](https://limingcan562.github.io/posts/build-webpack5-feeling)
- Welcome to `Fork` to learn and exchange
- Notes are written in the scaffolding, if you find it useful, welcome to `Star`  
