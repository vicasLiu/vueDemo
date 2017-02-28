<style>
    .code-container{
        text-align: center;
        margin: 0 auto;
        width: 280px;
        height: 280px;
        background: #FFF;
        overflow: hidden;
        padding: 10px;
    }
    canvas{
        margin: 0 auto;
        display: block;
        width: 200px;
        height: 200px;
    }
    svg{
        display: block;
        width: 100%;
        margin: 0 auto;
        margin-bottom: 10px;
    }
</style>
<template>
    <div :class="'code-container ' + class">
        <svg name="bar"></svg>
        <div name="qr"></div>
    </div>
</template>
<script>
    import qrcode from 'lib/qrcode'
    import barcode from 'jsbarcode'

    export default {
        props: {
            text: {
                default: '',
                type: String
            },
            class: {
                default: '',
                type: String
            },
            image: {
                default: '',
                type: String
            },
            size: {
                default: 100,
                type: Number
            }
        },
        watch: {
            text: function(val){
                this.render();
            }
        },
        methods: {
            render: function(){
                if(!this.text) return;

                var bar = this.$el.querySelector('[name=bar]');
                var qr = this.$el.querySelector('[name=qr]');
                
                barcode(bar, this.text, {
                    background: '',
                    textPosition: 'top'
                });

                qr.innerHTML = '';
                qr.appendChild(new qrcode({
                    text: this.text,
                    image: this.image,
                    size: this.size,
                    imageSize: this.size/3
                }));
            }
        },
        ready: function(){
            this.render();
        }
    }
</script>