<style scoped>
    .ui-tap{
        opacity: 1;
    }
    .ui-tap.active{
        opacity: .7;
    }
</style>

<template>
    <div :class="getCssCls()" :style="style" v-tap="tap">
        <slot></slot>
    </div>
</template>

<script>
	import $ from 'tethys';
    import Vue from 'vue'
    import vueTap from 'v-tap'

    Vue.use(vueTap);

    export default {
        props: {
            // 自定义样式，作用于组件的容器上
            'style': String,
            // 自定义class，作用于组件的容器上
            'class': String,
            // 是否不可用
            'disabled': Boolean,
        },
        data: function(){
            return {
                // 是否按下状态
                active: false
            };
        },
        methods: {
            // 动态计算按钮的 class
            getCssCls: function(){
                var cls = ['ui-tap'];
                
                // active时的class
                if(this.active) cls.push('active');
                
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
            var vm = this;

            // 按下按钮/放开按钮时，改变active状态
			$(this.$el).on('touchstart, mousedown', function(e){
                if(!vm.disabled){
				    vm.active = true;
                };
			});
			$(document.body).on('touchend, mouseup', function(e){
				vm.active = false;
			});
        }
    }
</script>