<style>
    .detail-box{
        background: #FFF;
        border: 1px solid #DDD;
        border-left: 0;
        border-right: 0;
    }

	.detail-head{
        display: -webkit-box;
        display: box;

        -webkit-box-pack: justify;
        box-pack: justify;

        color: #999;
        padding: 15px 10px;
        border-bottom: 1px solid #DDD;
	}

    .detail-title{
        color: #333;
        font-size: 1.2em;
    }
    .detail-more{
        color: #0abfb9;
    }
    .detail-more:after{
        content: ' >';
        color: #999;
    }

    .detail-content{
        padding: 10px;
    }
</style>
<template>
    <div>
        <div class="detail-box">
            <div class="detail-head">
                <div class="detail-title">{{title}}</div>
                <ui-tap class="detail-more" v-if="more" @tap="tapMore">{{more}}</ui-tap>
            </div>
            <div class="detail-content">
                <slot></slot>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            'title': String,
            'more': String,
        },
        components: {
            'ui-tap': require('ui/tap.vue'),
        },
        methods: {
            tapMore: function(){
                this.$emit('more');
            }
        }
    }
</script>