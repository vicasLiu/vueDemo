var path = require('path');
var webpack = require('webpack');
var argv = require('yargs').argv;
var plugins = [];

// 非开发模式下要对代码进行压缩
if(argv.dev !== 'true'){
    plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: true,
        },
        output: {
            comments: false,
        },
    }))
};

module.exports = {
    entry: {
        vendor: ['vue/dist/vue.min.js', 'v-tap', 'babel-polyfill']
    },
    output: {
        path: path.join(__dirname, '../debug'),
        filename: '[name].dll.js',
        /**
         * output.library
         * 将会定义为 window.${output.library}
         * 在这次的例子中，将会定义为`window.vendor_library`
         */
        library: '[name]_library'
    },
    plugins: plugins.concat([
        new webpack.DllPlugin({
            /**
             * path
             * 定义 manifest 文件生成的位置
             * [name]的部分由entry的名字替换
             */
            path: path.join(__dirname, '../debug', '[name]-manifest.json'),
            /**
             * name
             * dll bundle 输出到那个全局变量上
             * 和 output.library 一样即可。 
             */
            name: '[name]_library'
        })
    ]),

    module: {
        // noParse: ['vue', 'vue/dist/vue.min.js'],
        //加载器配置 
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: argv.dev ? function(path) {
                    // 开发模式
                    // 排除 node_modules
                    return !!path.match(/node_modules/);
                } : function(path) {
                    // 非开发模式
                    // 排除 node_modules
                    return !!path.match(/node_modules/);
                },
                query: {
                    presets: ['es2015'],
                    plugins: ["transform-object-assign"]
                }
            }
        ]
    }
};