<style lang="stylus" scoped>

	.list
		background-color #FFF
		color #333
		
	.list-item
		border-bottom 1px solid #e5e5e5
		padding 20px 15px
		overflow hidden
		position relative
		
	.item-img
		width 120px
		height 90px
		background #F8F8F8
		border-radius 3px
		float left
		background-size 100%
		background-repeat no-repeat
		background-position 50% 50%
		
	.item-main
		height 90px
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
	.item-buttons{
	    position absolute
	    bottom 0
	    right 0
	    width 100%
	}
	    
	.item-price{
		color: #ff5555;
	    font-size: 18px;
	    font-weight: bold;
	    margin-right 2em
	    float left
	    bottom 0
	}
		
	.item-button{
		display: inline-block;
	    height: 2.5em;
	    line-height: 2.5em;
	    border-radius: 3px;
	    background: #f55;
	    text-align: center;
	    font-size: 1.2em;
	    color: #fff;
	    padding: 0 .8em;
	    float right
	    
	    &[disabled]{
	    	background #CCC
	    }
	}

</style>

<template>

	<div class="list">
		<div class="list-item" 
			v-for="item in data" 
			@click="item.onclick"
			:style="'min-height:' + height + 'px'">
			<div class="item-img" v-bind:style="imageUrl(item)"></div>
			<div class="item-main">
				<div class="item-title">{{item.title}}</div>
				<p v-if="item.desc" class="item-desc">{{{item.desc}}}</p>
				<div class="item-buttons">
					<span class="item-price" v-if="typeof item.price == 'number'">￥{{item.price}}</span>
					<a onclick="javascript:;" class="item-button" 
						v-for="(buttonName, button) in item.buttons" 
						:disabled="button.disabled"
						@click="button.disabled ? null : button.onclick()"
					>{{buttonName}}</a>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			data: {
				type: Array,
				default: function(){
					return [];
				}
			},
			height: {
				type: Number,
				default: 100
			}
		},
		data: function(){
			return {};
		},
		methods: {
			imageUrl: function(item){
				return 'background-image: url(' + item.image.url + ');';
			}
		},
		created: function(){
			
		}
	}
</script>
