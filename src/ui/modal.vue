<style scoped>
    .ui-modal-container{
        position: fixed;
        left: 0;
        top: 0;
        background: #f2f2f2;
        width: 100vw;
        height: 100vh;
        z-index: 999999;
        opacity: 0;
        
        display: -webkit-flex;
        -webkit-align-items: center;
        -webkit-justify-content: center;

        display: flex;
        align-items: center;
        justify-content: center;
    }

    .modal-show{
        -webkit-animation: ui-modal-show .3s ease forwards;
        animation: ui-modal-show .3s ease forwards;
        opacity: 0;
    }

    .modal-hide{
        -webkit-animation: ui-modal-hide .3s ease forwards;
        animation: ui-modal-hide .3s ease forwards;
    }

    @keyframes ui-modal-show{
        0%{
            opacity: 0;
        }
        100%{
            opacity: 1;
        }
    }

    @keyframes ui-modal-hide{
        0%{
            opacity: 1;
        }
        100%{
            opacity: 0;
        }
    }
</style>

<template>
    <div class="ui-modal-container" :style="style()">
        <slot v-show="!message"></slot>
        <span v-show="!!message">{{message}}</span>
    </div>
</template>

<script>
    import Vue from 'vue';
    import $ from 'tethys';
    
    export default {
        props: {
            visible: {
                type: Boolean,
                default: false,
                twoWay: true
            },
            message: {
                type: String,
                default: ''
            }
        },
        data: {
            style: ''
        },
        watch: {
            visible: function(visible){
                if(visible){
                    this.show();
                }else{
                    this.hide();
                };
            }
        },
        methods: {
            style: function(){
                var docEl = document.documentElement, 
                    vw = docEl.clientWidth, 
                    vh = docEl.clientHeight;

                return `width: ${vw}px; height: ${vh}px;`;
            },
            show: function(message){
                if(message){
                    this.message = message;
                };
                $(this.$el).show().removeClass('modal-hide').addClass('modal-show');
            },
            hide: function(){
                $(this.$el).removeClass('modal-show').addClass('modal-hide').delay(300, function(){
                    this.hide();
                });
            }
        },
        components: {
            'ui-tap': require('ui/tap.vue'),
        }
    }
</script>