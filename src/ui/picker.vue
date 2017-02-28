<style>

</style>
<template>
    <tap @tap="tap">
        <b>{{text}}</b>
        <!--下拉图标-->
        <ui-icon type="arrow-down"></ui-icon>
    </tap>
</template>
<script>
    import Picker from '../lib/picker';

    export default {
        components: {
            'tap': require('ui/tap.vue'),
            'ui-icon': require('./icon.vue'),
        },
        props: {
            title: {
                type: String,
                default: ''
            },
            list: {
                type: Array,
                default: []
            },
            value: {
                type: [String, Number],
                twoWay: true,
                default: ''
            },
            valueField: {
                type: String,
                default: 'value'
            },
            textField: {
                type: String,
                default: 'text'
            },
        },
        data: () => {
            return {
                picker: null,
                selected: null,
                show: false,
                text: '请选择',
            };
        },
        watch: {
            show: function(show){
                show ? this.showPicker() : this.hidePicker();
            },
            list: function(data){
                if(data && data.length && !this.inited){
                    this.inited = true;
                    this.init();
                }
            },
            value: function(val){
                this.$emit('change', val);
            }
        },
        methods: {
            tap: function(){
                this.togglePicker();
            },
            showPicker: function(){
                this.picker && this.picker.show();
            },
            hidePicker: function(){
                this.picker && this.picker.hide();
            },
            togglePicker: function(){
                this.show = !this.show;
            },
            findByVal: function(val){
                var list = JSON.parse(JSON.stringify(this.list)),
                    valField = this.valueField,
                    txtField = this.textField,
                    index,
                    text = this.text;
                    
                if(typeof val !== 'undefined' && Array.isArray(list) && list.length){
                    list.forEach(function(n, i){
                        if(typeof index === 'number') return;
                        if(typeof n === 'object'){
                            if(n[valField] === val){
                                index = i;
                                text = n[txtField] || text;
                            };
                        }else{
                            if(n === val){
                                index = i;
                            };
                            text = val;
                        }
                    }.bind(this));
                };

                this.text = text;
                this.value = val;
                
                return {
                    index: index || 0,
                    text: text || '请选择',
                    value: val,
                };
            },
            init: function(){
                var list = JSON.parse(JSON.stringify(this.list));
                var selected = this.selected = this.findByVal(this.value);
                var picker = this.picker = new Picker({
                    data: [list.map(n => {
                        return { value: n[this.valueField], text: n[this.textField]};
                    })],
                    selectedIndex: [selected.index],
                    title: this.title,
                });
                
                picker.on('picker.cancel', () => {
                    this.show = false;
                });
                
                picker.on('picker.select', (val, index) => {
                    this.selected = this.findByVal(list[index[0]][this.valueField]);
                    this.show = false;
                });

                if(this.show){
                    this.showPicker();
                };
            }
        },
        ready: function(){
            
        }
    }
</script>