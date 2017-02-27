var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var fs = require('fs');
var argv = require('yargs').argv,
    path = require('path');
var extend = require('../src/lib/extend.js');

var each = function(obj, fn){
    if(typeof fn !== 'function') return;
    if(Array.isArray(obj)){
        Array.prototype.forEach.call(obj, fn);
    }else if(typeof obj === 'object'){
        Object.keys(obj).forEach(function(key){
            fn(obj[key], key);
        });
    };
}

// 根据 src/page 目录生成html插件配置
var plugins = [],
    entry = {},
    rootDir = path.join(__dirname, '../'),
    pagesDir = path.join(rootDir, '/src/page');

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

// 遍历api目录，读取每一个文件
// 遍历文件中定义的每一个路由，以 /api/文件名/路由名 为路径加载路由
fs.readdirSync(pagesDir).forEach(function(name) {
    
    var pageDir = path.join(pagesDir, name),
        templatePath,
        opts,
        tplName;

    if(!fs.statSync(pageDir).isDirectory()) return;

    opts = {
        chunks: [name],
        filename: name + '.html'
    };

    // 尝试从index.js中读取模板名称
    tplName = getTplName(fs.readFileSync(path.join(pageDir, '/index.js'), 'utf-8'));
    if(tplName){
        templatePath = path.join(rootDir, '/src/template/' + tplName + '.html');
    }else{
        templatePath = path.join(pageDir, '/index.html');
    };

    // 检查模板文件是否存在
    if(fs.existsSync(templatePath)) {
        opts.template = templatePath;
    }else{
        opts.template = path.join(rootDir, '/src/template/default.html');
    };
    plugins.push(new HtmlWebpackPlugin(opts));
    entry[name] = pageDir;
});

function getTplName(text){
    var tpl = text.match(/template\[([a-z0-9\-]+)\]/) || [];
    return tpl[1] || '';
}

// verdor.dll.js 配置
var manifest = require('../debug/vendor-manifest.json');
// 因为目录层次的关系，所以在使用vendor-manifest.json之前需要对其内容的路径进行一些处理
each(manifest.content, function(val, key){
    delete manifest.content[key];
    manifest.content['.' + key] = val;
});

// 导出 webpack 配置
var config = {

    // 插件
    plugins: [
        new ExtractTextPlugin("[name].css"),
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: manifest
        })
    ].concat(plugins),

    // 入口文件
    entry: extend({}, entry),

    // 输出文件
    output: {
        path: path.join(rootDir, '/debug/'),
        filename: '[name].[chunkhash].js',
        libraryTarget: 'umd'
    },

    module: {
        // noParse: ['vue', 'vue/dist/vue.min.js'],
        //加载器配置 
        loaders: [
            { 
                test: /\.js$/, 
                loader: 'babel-loader',
                // include: [
                //     // 只去解析运行目录下的 src 和 demo 文件夹
                //     path.join(process.cwd(), './src')
                // ],
                exclude: argv.dev ? function(path) {
                    // 开发模式
                    // 排除 node_modules
                    return !!path.match(/node_modules/);
                } : function(path){
                    // 非开发模式
                    // 排除 node_modules
                    return !!path.match(/node_modules/);
                },
                query: {
                    presets: ['es2015'],
                    plugins: ["transform-object-assign"]
                }
            },
            { 
                test: /\.css$/, 
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.woff(2)?(\?|\=|\#|\&|\w|\d)*$/,
                loader: "url-loader?limit=1024&minetype=application/font-woff"
            }, {
                test: /\.(ttf|eot|svg)(\?|\=|\#|\&|\w|\d)*$/,
                loader: "file-loader"
            },
            {   
                test: /\.styl$/, 
                loader: 'style-loader!css-loader!stylus-loader' 
            },
            {   
                test: /\.less$/, 
                loader: 'style-loader!css-loader!less-loader' 
            },
            { 
                test: /\.json$/, 
                loader: 'json-loader'
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                    'file-loader'
                ]
            }
        ]
    },

    resolve: {
        root: path.join(rootDir, '/src/'),
        modulesDirectories: ['node_modules'],
        // 别名
        alias: {
            vue: 'vue/dist/vue.min.js',
            iconfont: 'font/iconfont.css',
            config: 'config/config.js'
        }
    }
};

module.exports = config;
