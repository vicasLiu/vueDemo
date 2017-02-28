<style scoped>
    div.ui-agreement-container{
        line-height: 24px;
        overflow: hidden;
    }
    .ui-agreement-icon{
        color: #eb4a19;
    }
    .ui-agreement-name{
        color: #F60;
        display: inline;
    }
    span{
        vertical-align: middle;
    }
</style>

<template>
    <div class="ui-agreement-container">

        <ui-icon class="ui-agreement-icon" :type="agree ? 'agree' : 'disagree'" 
            @tap="toggle"></ui-icon>

        <span v-tap="toggle">我同意</span>

        <ui-tap class="ui-agreement-name" @tap="showList">
            <slot><slot>
        </ui-tap>

    </div>
</template>

<script>
    import Vue from 'vue';
    import vueTap from 'v-tap';
    import $ from 'tethys';
    import ActionSheet from 'action-sheet';

    Vue.use(vueTap);
    
    export default {
        props: {
            agree: {
                type: Boolean,
                default: false,
                twoWay: true
            },
            list: {
                type: [Object],
                default: []
            }
        },
        data: function(){
            return {
            };
        },
        methods: {
            toggle: function(){
                this.agree = !this.agree;
            },
            createList: function(){
                this.pb = new ActionSheet({
                    buttons: {}
                });
            },
            showList: function(){
                if(this.pb){
                    this.pb.show();
                }
            }
        },
        watch: {
            list: function(data){
                this.pb.update(JSON.parse(JSON.stringify(data)));
            }
        },
        ready: function(){
            this.createList();
        },
        components: {
            'ui-icon': require('ui/icon.vue'),
            'ui-tap': require('ui/tap.vue'),
        }
    }
</script>