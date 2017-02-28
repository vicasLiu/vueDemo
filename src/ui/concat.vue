<style scoped>
    .contact-box{
        display: -webkit-box;
        display: box;

        -webkit-box-pack: justify;
        box-pack: justify;
        
        border-bottom: 1px solid #EEE;
        padding: 10px 0;
	}
    .contact-box:last-child{
        border-bottom: none;
    }

    .contact-title{
        font-weight: bold;
        line-height: 2em;
    }
    .contact-address{
        font-size: .8em;
        color: #999;
    }
    
    .contact-tel{
        display: inline-block;
        border-left: 1px solid #EEE;
    }

    .contact-tel .contact-tel-icon{
        font-size: 30px;
        padding: 0 10px;
    }
</style>
<template>
    <div class="contact-box">
        <div>
            <div class="contact-title">{{title}}</div>
            <div class="contact-address">{{address}}</div>
        </div>
        <ui-tap class="contact-tel" @tap="tap">
            <ui-icon type="tel" class="contact-tel-icon"></ui-icon>
        </ui-tap>
    </div>
</template>
<script>
    export default {
        components: {
            'ui-tap': require('ui/tap.vue'),
            'ui-icon': require('ui/icon.vue'),
        },
        props: {
            'title': String,
            'address': String,
            'tel': [Number, String]
        },
        methods: {
            tap: function(){
                location.href= 'tel:' + this.tel;
            }
        }
    }
</script>