const SUBREGEX = /\{\s*([^|}]+?)\s*(?:\|([^}]*))?\s*\}/g;
    
const isUndefined = function(o) {
    return typeof o === 'undefined';
};

const sub = function(s, o) {
    return s.replace ? s.replace(SUBREGEX, function (match, key) {
        return isUndefined(o[key]) ? match : o[key];
    }) : s;
};

const toDateString = function(s){
    if(!s) return '';

    if(typeof s === 'number'){
        s = new Date(s);
    }else if(typeof s === 'string'){
        s = s.replace(/^\s*|\s*$/, '');
        if(!s){
            return ''; 
        };
        if(!isNaN(s)){
            s = Number(s);
        };
        s = new Date(s);
    }else if(!s instanceof Date){
        return '';
    };
    
    return s.getFullYear() + '-' + (s.getMonth()+1) + '-' + s.getDate();
};

const ns = function(obj, path){
    obj = obj || {};
    path = path.split('.');
    path.forEach(function(n, i){
        obj = obj[n];
        if(i < path.length - 1){
            obj = obj || {};
        };
    });
    return obj;
}

export {
    isUndefined,
    sub,
    ns
};