<style lang="stylus">
	
</style>

<template>
	<slot></slot>
</template>

<script>
	var showLoading = window.showLoading || function(){};
	var hideLoading = window.hideLoading || function(){};

	export default {
		props: {
			loading: {
				type: Boolean,
				default: true
			}
		},
		watch: {
			loading: function(val){
				if(val){
					showLoading();
				}else{
					hideLoading();
				}
			}
		},
		events: {
			loading: showLoading,
			loaded: hideLoading
		}
	}
</script>