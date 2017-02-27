<style scoped>
    .ui-field{
        display: -webkit-box;
        display: -moz-box;
        display: box;
        width: 100%;
        -webkit-box-align: center;
        -moz-box-align: center;
        background: #fff;
        line-height: 2.5em
    }
    .ui-field-label{
        padding-right: 1em;
        display: inline-block;
    }
    .ui-field-content{
        -moz-box-flex: 1;
        -webkit-box-flex: 1;
        box-flex: 1;
    }
</style>

<template>
    <div class="ui-field w3-padding">
        <span class="ui-field-label" :style="getStyle()">{{label}}</span>
        <div class="ui-field-content">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['label', 'labelWidth'],
        methods: {
            getStyle: function(){
                var s = [];
                if(this.labelWidth){
                    s.push('width:' + this.labelWidth);
                };
                return s.join(';');
            }
        }
    }
</script>