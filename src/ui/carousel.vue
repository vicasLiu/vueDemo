<style lang="stylus" scoped>
	$dotted-width = 4px

    .container {
        margin: 0 auto;
        position relative;
    }

    .panes.wrapper {
        background: #CCC;
    }

    .panes {
        width: 100%;
        height: 200px;
        overflow: hidden;
        position: relative;
    }
    
    .animate .pane {
        transition: all .3s;
        -webkit-transition: all .3s;
    }

    .pane {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        text-align: center;
        color: #fff;
    }

    .panes.animate > .pane {
        transition: all .3s;
        -webkit-transition: all .3s;
    }
    
    .pane .panes{
		background-size: cover;
		background-repeat no-repeat;
		background-position 50% 50%;
    }
    
    .dotteds{
    	position absolute;
    	bottom 0;
    	right 5px;
    	z-index 9
    }
    .dotted{
    	width $dotted-width;
    	height $dotted-width;
    	border-radius 50%;
    	background #FFF;
		opacity: .3;
    	display inline-block
    	margin 5px
    }
    .dotted.active{
    	opacity: .7;
    }
    .dotted:before{
        text-shadow: 0 0 1px #fff;
    }
    .carousel-title{
        font-size 15px;
        position absolute;
        left 10px;
        bottom 10px;
        text-shadow: 0 0 15px #000;
    }
</style>

<template>
	<div class="container">
	    <div class="panes wrapper" :style="'height:' + height">
	        <div class="pane" v-for="item in data">
	            <div class="panes" :style="itemStyle(item)" v-tap="tap(item)">
                    <div class="carousel-title" v-if="item.title">{{item.title}}</div>
	            </div>
	        </div>
	    </div>
        <div class="dotteds">
        	<span class="dotted iconfont icon-dot {{index == itemIndex ? 'active w3-text-theme' : ''}}" 
                v-for="(itemIndex, item) in data"></span>
        </div>
	</div>
</template>

<script>
	import Hammer from '../lib/hammer'
	import HammerCarousel from '../lib/hammer-carousel'
	import VueTap from 'v-tap'
	import Vue from 'vue'

	Vue.use(VueTap);
	
	var vmData = {
		index: 0
	}, carousel, carouselIndex = 0, timer, resume = false;

    function renderCarousel(len, time){
        var vm = this;
        if(!len) return;
        
        carouselIndex = 0;
        clearInterval(timer);

        timer = setInterval(function(){
            if(resume) return;
            if(carouselIndex < len - 1){
                carouselIndex += 1;
            }else{
                carouselIndex = 0;
            };
            
            carousel.show(carouselIndex, 0, true);
			vmData.index = carouselIndex;
        }, time);
        
        carousel = new HammerCarousel(
            this.$el.querySelector(".panes.wrapper"), 
            Hammer.DIRECTION_HORIZONTAL,
            {
                onPan: function(index){
                    
                    index = Math.max(0, Math.min(index, vm.data.length - 1));

                	carouselIndex = index;
					vmData.index = index;
                    //
                    resume = true;
                    setTimeout(function(){
                        resume = false;
                    }, time);
                }
            }
        );
    };

	export default {
		props: ['data', 'time', 'height', 'disabled'],
		data: function(){
			return vmData
		},
		methods: {
			itemStyle: function(item){
				var style = '';
				if(item.image) style += 'background-image: url(' + item.image + ');';
				if(item.bgcolor) style += 'background-color: ' + item.bgcolor + ';';
                if(this.height) style += 'height:' + this.height;
				return style;
			},
            render: function(){
                var vm = this;
                // 如果只有一幅图时，不可滑动
                if(this.data.length > 1){
                    // 等待dom更新，然后初始化
                    vm.$nextTick(function () {
                        renderCarousel.call(vm, vm.data.length, vm.time);
                    });
                };
            },
			tap: function(item){
				if(typeof item.tap === 'function'){
					item.tap();
				}else if(typeof item.url === 'string'){
					location.href = item.url;
				};
			}
		},
		created: function(){
            var vm = this;
			
			vm.$watch('data', function(e){
                vm.render();
			});
		}
	};
</script>