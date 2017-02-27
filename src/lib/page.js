import '../style/base.styl'
import 'babel-polyfill'

import Vue from 'vue';
import extend from './extend.js';
import urls from 'lib/urls.js'
import toast from 'ui/toast.js'
import storage from 'lib/storage'
import config from 'config';

// 以下是默认插件
import ajaxPlugin from 'plugin/ajax'
import userPlugin from 'plugin/user'
import storagePlugin from 'plugin/storage'
import coverPlugin from 'plugin/cover'

// URL参数
let params = urls.parse().query;

// 页面的默认状态和方法
let defaults = {
    data: {
        loading: true,
        params: params
    },
    methods: {
        // 弹出提示信息
        toast: toast,
        //
        error: function(err){
            this.toast(err || '网络繁忙，请稍后重试');
            return this;
        },

    }
};

// 页面类
class Page{
    
    // 添加公共插件
    static plugin(plugin){

        if(!plugin) return;

        // 当参数是一个数组
        if(Array.isArray(plugin)){
            plugin.forEach((p) => {
                Page.plugin(p);
            });
            return Page;
        }

        // 防止重复加载
        if(plugin.name){
            if(Page._plugins[plugin.name]){
                return;
            };
            //console.log(`plugin ${plugin.name} is loaded`);
            Page._plugins[plugin.name] = plugin;
        };

        // 加载依赖
        if(Array.isArray(plugin.dependencies)){
            plugin.dependencies.forEach((depend) => {
                Page.plugin(depend);
            });
        };

        // 加载插件
        ['data', 'methods'].forEach((prop) => {
            let dest = defaults[prop], src = plugin[prop];
            if(typeof src === 'object') Object.keys(src).forEach((key) => {
                if(key in dest) {
                    console.log(`警告：Page.${prop}.${key} 被插件 ${plugin.name} 覆盖`);
                };
                dest[key] = src[key];
            });
        });

        // 记录中间件
        if(Array.isArray(plugin.use)){
            Page._middleware = Page._middleware.concat(plugin.use);
        };

        return Page;
    }

    // 页面的构造函数
    constructor(opt){

        var page, options = opt.options || {};

        // 设置页面标题
        if(options.title){
            document.title = options.title;
        };

        // 加载插件
        if(Array.isArray(options.plugins)){
            Page.plugin(options.plugins);
        };
        
        // 创建页面Vue实例
        page = new Vue(extend(true, {}, defaults, opt, {
            data: {
                // 中间件数组
                middlewareList: [].concat(Page._middleware),
            },
            methods: {
                // 添加中间件，在created方法中可以使用
                use: function(obj){
                    this.middlewareList.push(obj);
                }
            },
            // 在调用真正的created之前，添加options.use带来的中间件数组到middlewareList
            created: function(){

                // 把opt.middlewares定义的中间件数组插入middlewareList
                if(Array.isArray(options.use)){
                    this.middlewareList = this.middlewareList.concat(options.use);
                };
                
                // 最后执行真正的created
                if(typeof opt.created === 'function'){
                    opt.created.apply(this, arguments);
                };
            },
            // 串行执行 use() 方法添加到 middlewareList 中的所有函数，然后再执行原来的 ready()
            ready: function(){

                // 先执行所有中间件
                // 最后执行真正的ready
                let list = this.middlewareList.concat([() => {
                    if(typeof opt.ready === 'function'){
                        opt.ready.apply(this, arguments);
                    };
                }]);

                // 实现异步串行调用
                let loop = () => {
                    let fn = list.shift();
                    if(typeof fn === 'function'){
                        fn.call(this, loop);
                    };
                };

                // 开始循环
                loop();
            }
        }));

        // 暴露 storage 方法用于调试
        window.storage = (...args) => {
            return page.storage.apply(page, args);
        };
    }
};

// 公共插件
Page._plugins = {};

// 公共中间件
Page._middleware = [];

// 内置中间件：检查token和channelId
Page._middleware.push(function(next){
    
    // 保存url参数中的token
    if(params.token){
        storage.set('token', params.token);
    };

    // 保存url参数中的channelId
    if(params.channelId){
        storage.set('channelId', params.channelId);
    };
        
    // 如果storage中找不到channelId的话，提示用户地址错误
    if(!this.storage('channelId')){
        return this.showCover('页面地址有误，请重新扫描二维码');
    };

    next();
});

// 加载默认插件
Page.plugin([
    // 本地存储
    storagePlugin, 
    // ajax
    ajaxPlugin, 
    // 用户相关
    userPlugin, 
    // 遮罩层
    coverPlugin,
]);

export default Page;