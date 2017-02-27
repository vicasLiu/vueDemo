<style scoped>
    .ui-button{
        display: block;
        border-radius: 3px;
        text-align: center;
        background: #eb4a19;
        color: #fff;
	    padding: .5em 1em;
    }
    .ui-button-submit{
        font-size: 18px;
    }
    .ui-tap.disabled{
        background: rgba(0,0,0,.2);
    }
</style>

<template>
        <ui-tap :class="getCssCls()" 
            :style="style" :disabled="disabled" @tap="tap">
            <slot></slot>
        </ui-tap>
</template>

<script>
    import Vue from 'vue'
    import vueTap from 'v-tap'

    Vue.use(vueTap);

    export default {
        components: {
            'ui-tap': require('ui/tap.vue')
        },
        props: {
            // 按钮类型，可为空或submit
            'type': {
                default: ''
            },
            // 自定义样式，作用于组件的容器上
            'style': String,
            // 自定义class，作用于组件的容器上
            'class': {
                type: String,
				default: ''
            },
            // 是否不可用
            'disabled': Boolean,
        },
        data: function(){
            return {
            };
        },
        methods: {
            // 动态计算按钮的 class
            getCssCls: function(){
                var cls = ['ui-button'];

                if(this.type) cls.push('ui-button-' + this.type);
                
                // disabled时的class
                if(this.disabled) cls.push('disabled');

                // 传入的自定义class
                if(this['class']) cls.push(this['class']);
                
                return cls.join(' ');
            },
            // 触发点击事件
            tap: function(){
                if(!this.disabled){
                    this.$emit('tap');
                };
            }
        },
		ready: function(){
            
        }
    }
</script>