var ls = window.localStorage,
    cookie = require('js-cookie'),
    storage = {},
    atob = function(val){
        if(typeof val === 'string' && val){
            try{
                return window.atob(val);
            }catch(e){};
        };
        return null;
    },
    parse = function(val){
        if(typeof val === 'string' && val){
            try{
                return JSON.parse(val);
            }catch(e){};
        };
        return val;
    },
    stringify = function(val){
        if(typeof val !== 'string'){
            val = JSON.stringify(val);
        };
        return val;
    };

if(ls){
    storage.get = function(name){
        var val = ls.getItem(btoa(name));
        return atob(val);
    };

    storage.getJSON = function(name){
        var val = ls.getItem(btoa(name));
        return parse(atob(val));
    };

    storage.set = function(name, val){
        val = stringify(val);
        return ls.setItem(btoa(name), btoa(val));
    };

    storage.remove = function(name){
        ls.removeItem(btoa(name));
    };
}else{
    storage.get = function(name){
        var val = cookie.get(btoa(name));
        return atob(val);
    };

    storage.getJSON = function(name){
        var val = cookie.get(btoa(name));
        return parse(atob(val));
    };

    storage.set = function(name, val){
        val = stringify(val);
        return cookie.set(btoa(name), btoa(val));
    };

    storage.remove = function(name){
        cookie.remove(btoa(name));
    };
};

module.exports = storage;