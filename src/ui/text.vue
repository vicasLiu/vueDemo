<style scoped>
    div.ui-text-container{
        width: 100%;
        display: flex;
    }
    input.ui-text{
        border: none;
        outline: none;
        flex: 1;
        overflow: hidden;
    }
    span.iconfont{
        padding: 0 0 0 10px;
    }
</style>

<template>
    <div class="ui-text-container">

        <!--文本输入框-->
        <input class="ui-text" type="tel" pattern="[0-9]*" maxlength="{{maxlength}}" 
            placeholder="{{placeholder}}" v-model="value" />

        <!--清除按钮-->
        <ui-icon type="clear" 
            v-show="value.length > 0"
            @tap="clear"></ui-icon>
    </div>
</template>

<script>
    import 'iconfont';
    import Vue from 'vue';
    import vueTap from 'v-tap';

    Vue.use(vueTap);

    // 创建检测函数
    function createTester(pattern){
        var reg;
        
        if(typeof pattern === 'function'){
            return pattern;
        }else if(typeof pattern === 'string' && pattern !== ''){
            try{
                reg = new RegExp(pattern);

                if(reg){
                    return function(val){
                        return this.test(val);
                    }.bind(reg);
                }
            }catch(e){};
        };
        
        return null;
    };

    export default {
        components: {
            'ui-icon': require('./icon.vue'),
        },
        props: {
            placeholder: {
                default: '请输入文本'
            },
            value: {
                default: '',
                twoWay: true
            },
            maxlength: {
                default: '20'
            },
            valid: {
                type: Boolean,
                twoWay: true,
                default: '',
            },
            validPattern: {
                type: [String, Function],
                coerce: function(pattern){
                    return createTester(pattern);
                }
            },
            pattern: {
                type: [String, Function],
                coerce: function(pattern){
                    return createTester(pattern);
                }
            }
        },
        watch: {
            // 当value发生变化，用validPattern函数去检测，并设置组件的valid状态
            value: function(val){
                var test = this.validPattern;
                
                if(typeof test === 'function'){
                    this.valid = test(val);
                };
            }
        },
        methods: {
            clear: function(){
                this.value = '';
            }
        },
        ready: function(){
            var test = this.pattern;
            
            // 如果有设置pattern属性    
            // 当用户键入内容时，检查value是否符合规则，如果不符则删除最后一位
            if(typeof test === 'function'){
                this.$el.addEventListener('keyup', function(e){
                    var val = e.target.value;
                    if(!test(val)){
                        e.target.value = val.substr(0, val.length - 1);
                    };
                });
            };
            
        }
    }
</script>