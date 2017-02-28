<style scoped>
    div.ui-password-container{
        width: 100%;
        display: flex;
        position: relative;
    }
    input{
        border: none;
        outline: none;
        flex: 1;
    }
    .ui-password-clear,
    .ui-password-eye{
        padding: 0 0 0 10px;
        position: absolute;
        top: 0;
    }
    .ui-password-clear{
        right: 30px;
    }
    .ui-password-eye{
        right: 0px;
    }
</style>

<template>
    <div class="ui-password-container">

        <!--密码输入框-->
        <input type="password" v-show="showpwd == false"
            maxlength="{{maxlength}}" placeholder="{{placeholder}}" v-model="value" />
        <input type="text" v-show="showpwd == true"
            maxlength="{{maxlength}}" placeholder="{{placeholder}}" v-model="value" />

        <!--清除按钮-->
        <ui-icon type="clear" class="ui-password-clear"
            v-show="value.length > 0"
            @tap="clear"></ui-icon>

        <!--密码可见/不可见按钮-->
        <ui-icon type="pwd-hide" class="ui-password-eye"
            v-show="showpwd == false"
            @tap="show"></ui-icon>
        <ui-icon type="pwd-show" class="ui-password-eye"
            v-show="showpwd == true"
            @tap="hide"></ui-icon>
    </div>
</template>

<script>
    import Vue from 'vue';
    
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
                default: '请输入密码'
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
        data: function(){
            return {
                showpwd: false
            };
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
            },
            show: function(){
                this.showpwd = true;
            },
            hide: function(){
                this.showpwd = false;
            },
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