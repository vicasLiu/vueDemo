<style scoped>
	 
	.ui-price-button{
        display: -webkit-box;
        display: box;

        -webkit-box-pack: justify;
        box-pack: justify;
	}
	 
	.ui-price{
		color: #ff5555;
	    font-size: 18px;
	    font-weight: bold;
	}
</style>

<template>
    <div :class="'ui-price-button ' + class">

        <div class="ui-price" v-if="typeof price == 'number'">￥{{price}}</div>

        <ui-button v-if="buttonText" style="display:inline-block" :disabled="disabled" @tap="tap">
            {{buttonText}}
        </ui-button>

    </div>
</template>

<script>
	export default {
		props: {
            'price': [String, Number],
            'buttonText': {
				type: String
            },
			'disabled': Boolean,
            'class': {
                type: String,
				default: ''
            }
		},
		methods: {
			tap: function(){
				this.$emit('tap');
			},
		},
        components: {
            'ui-button': require('./button.vue')
        }
	}
</script>
