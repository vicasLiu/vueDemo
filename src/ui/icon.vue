<style scoped>
    .ui-icon{
        opacity: 1;
        font-size: 24px;
        vertical-align: middle;
    }
    .ui-icon.active{
        opacity: .7;
    }
</style>

<template>
    <span :class="getCssCls()" :style="style" v-tap="tap"></span>
</template>

<script>
	import $ from 'tethys';
    import 'iconfont';
    import Vue from 'vue';
    import vueTap from 'v-tap';

    Vue.use(vueTap);

    export default {
        props: {
            // 按钮类型，可为空或submit
            'type': {
                default: ''
            },
            // 自定义样式，作用于组件的容器上
            'style': String,
            // 自定义class，作用于组件的容器上
            'class': String,
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
                var cls = [ 'ui-icon', 'iconfont' ];

                // 按钮type的class
                if(this.type) cls.push('icon-' + this.type);

                // active时的class
                if(this.active) cls.push('active');
                
                // 传入的自定义class
                if(this['class']) cls.push(this['class']);
                
                return cls.join(' ');
            },
            // 触发点击事件
            tap: function(){
                this.$emit('tap');
            },
        },
		ready: function(){
            var vm = this;

            // 按下按钮/放开按钮时，改变active状态
			$(this.$el).on('touchstart, mousedown', function(e){
				vm.active = true;
			});

			$(document.body).on('touchend, mouseup', function(e){
				vm.active = false;
			});
        }
    }
</script>