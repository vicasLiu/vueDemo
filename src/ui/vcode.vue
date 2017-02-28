<style scoped>
    div.ui-vcode-container{
        width: 100%;
        display: flex;
    }
    .ui-vcode-text{
        border: none;
        outline: none;
        flex: 1;
        position: relative;
        overflow: hidden;
    }
    span.iconfont{
        position: absolute;
        right: 10px;
        top: 2px;
    }
    div.ui-vcode-button{
        margin-left: 1em;
        width: 7em;
        background: #3eabfc;
        border-radius: 5px;
    }
</style>

<template>
    <div class="ui-vcode-container">

        <!--验证码输入框--> 
        <ui-text class="ui-vcode-text" :valid.sync="valid" type="tel" :maxlength="maxlength" 
            :pattern="pattern" :valid-pattern="validPattern"
            :placeholder="placeholder" :value.sync="value" ></ui-text> 

        <!--倒计时/重新发送-->
        <ui-button @tap="tap" class="ui-vcode-button" :disabled="surplus > 0">
            {{surplus > 0 ? (surplus + 's后重发') : '发送验证码'}}
        </ui-button>
    </div>
</template>

<script>
    import 'iconfont';
    import Vue from 'vue';
    import Interval from 'real-interval';
    import toast from 'ui/toast.js';
    
    export default {
        props: {
            placeholder: {
                default: '请输入验证码'
            },
            value: {
                type: String,
                default: '',
                twoWay: true
            },
            valid: {
                type: Boolean,
                default: false,
                twoWay: true
            },
            maxlength: {
                default: 6
            },
            validPattern: {
                default: '^.{6}$'
            },
            pattern: {
                default: '^\\d*$'
            },
            beforeSend: {
                type: Function,
                required: true
            },
            autoStart: {
                type: Boolean,
                default: true
            },
            time: {
                type: Number,
                default: 60
            }
        },
        data: function(){
            return {
                surplus: 0
            };
        },
        methods: {

            tap: function(){
                this.$emit('tap');
            },

            // 重设计时器
            start: function(){
                var vm = this;

                this.surplus = this.time;

                this.$emit('start');

                new Interval(function(pass, surplus){
                    if(surplus > 0){
                        vm.surplus = surplus;
                    }else{
                        this.stop();
                        vm.surplus = 0;
                    };
                }, 1000, this.time, true);
            },

            // 清空
            clear: function(){
                this.value = '';
            }
        },
        components: {
            'ui-button': require('./button.vue'),
            'ui-text': require('./text.vue'),
        },
        ready: function(){
            if(this.autoStart){
                this.start();
            };
        }
    }
</script>