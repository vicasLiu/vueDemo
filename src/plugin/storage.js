import storage from 'lib/storage'

export default {
    name: 'storage',
    methods: {
        // 存取storage数据
        storage: function(key, val){

            if(typeof key === 'undefined') {
                throw 'storage() method need param "key"';
            };

            if(arguments.length < 2){
                return storage.get(key);
            }else{
                storage.set(key, val);
            };

            return this;
        },
    }
}