<style lang="stylus" scoped>

	.prodict-item
		padding 5px 0
		overflow hidden
		position relative
		
	.item-img
		width 120px
		height 90px
		background #F8F8F8
		border-radius 3px
		float left
		background-size cover
		background-repeat no-repeat
		background-position 50% 50%
		
	.item-main
		margin-left 140px
		position relative
		
	.item-title{
	    font-size: 15px;
	    line-height: 25px;
	    display: -webkit-box;
	    overflow: hidden;
	    text-overflow: ellipsis;
	    -webkit-line-clamp: 2;
	    -webkit-box-orient: vertical;
	    margin-bottom: 16px;
	    font-weight: normal;
	}

</style>

<template>
	<div>
		<ui-tap :class="getCssCls()" :style="itemStyle()" :disabled="disabled" @tap="tap">
			<div class="item-img" v-bind:style="imgStyle()"></div>
			<div class="item-main">
				<div class="item-title">{{title}}</div>
				<p v-if="desc" class="item-desc">{{{desc}}}</p>
				<ui-price-button style="background: #FFF;" :price="price" 
					:button-text="buttonText" @tap="tap">
				</ui-price-button>
			</div>
		</ui-tap>
	</div>
</template>

<script>
	import Vue from 'vue';
	import Tap from 'v-tap';

	Vue.use(Tap);

	export default {
		props: {
            'image': String, 
            'title': String, 
            'price': [String, Number], 
            'desc': String, 
            'disabled': Boolean,
			'id': String,
            'buttonText': {
				type: String
            }
		},
		data: function(){
			return {
				
			};
		},
		methods: {
			itemStyle: function(){
                var s = [];
                //s.push('min-height: ' + this.height + 'px');
                return s.join(';');
			},
			imgStyle: function(){
                var s = [];
                if(this.image) 
                    s.push('background-image: url(' + this.image + ')');
                return s.join(';');
			},
			tap: function(){
				this.$emit('tap', this.id);
			},
            // 动态计算按钮的 class
            getCssCls: function(){
                var cls = [ 'prodict-item' ];
				
                // 传入的自定义class
                if(this['class']) cls.push(this['class']);
                
                return cls.join(' ');
            },
		},
        components: {
            'ui-button': require('./button.vue'),
            'ui-price-button': require('./price-button.vue'),
			'ui-tap': require('./tap.vue')
        },
		ready: function(){
			
        }
	}
</script>
