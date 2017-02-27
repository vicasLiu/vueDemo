import extend from 'lib/extend';
import dfp from 'lib/dfp'
import xhr from 'lib/xhr'
import config from 'config'
import storage from 'lib/storage'

xhr.use(config.ajax);

var {finger, token: deviceToken} = dfp.getDeviceInfo();

// 使用Symbol做data的key，避免被外部修改
var pluginData = {}, loading = 'loading'; Symbol('loading');

// 设置pluginData的初始值
//pluginData[loading] = false;

function ajax (type) {
    return function (url, data, success){
        var opt;
        
        if(typeof url === 'object'){
            opt = url;
        }else{
            opt = {
                url: url,
                data: data,
                success: success,
            };
        };

        opt = extend(true, {
            type: type || 'post',
            finish: opt.silence ? null : function(){
                this[loading] = false; // 隐藏loading图标
            }.bind(this),
            headers: {
                'ihome-deviceFinger': finger,
                'ihome-deviceToken': deviceToken,
                'ihome-imei': '1C52632E36DF49D4B79D070828BEA515',
                'ihome-os': 2,
            },
            adapter: function(json){
                return json || {};
            },
            error: function(err, json){
                this.error(err || json.message);
            },
            success: function(){}
        }, opt);

        opt.success = opt.success.bind(this);
        opt.error = opt.error.bind(this);
        opt.adapter = opt.adapter.bind(this);

        if(opt.token === true){
            opt.headers['ihome-token'] = storage.get('token') || '';
        };

        if(!opt.silence){
            this[loading] = true; // 显示loading图标
        };

        xhr(opt).then(function(json){
            var rst;

            if(typeof this.adapter === 'function'){
                json = this.adapter(json);
            };
            
            if(json.code == 0){
                // success
                rst = this.success(json.data, json);
                // 异常处理
                if(false === rst){
                    this.error('', json);
                }else if(typeof rst === 'string'){
                    this.error(rst, json);
                };
            }else{
                // 异常处理
                this.error(json.message || '网络繁忙，请稍后重试', json);
            };
        }.bind(opt)).catch(function(err){
            console.log(err);
            this.error(err || '网络繁忙，请稍后重试');
        });

        return this;
    }
};

export default {
    name: 'ajax',
    dependencies: [],
    data: pluginData,
    methods: {
        post: ajax('post'),
        get: ajax('get'),
    }
}