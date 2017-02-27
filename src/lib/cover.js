import Vue from 'vue'
import $ from 'tethys'

const Modal = Vue.extend({
    components: {
        modal: require('ui/modal.vue')
    },
    template: `<modal :visible="visible" :message="message"></modal>`,
    data: function(){
        return {
            visible: false,
            message: '',
        };
    },
    methods: {
        show: function(msg){
            if(msg){
                this.message = msg;
            };
            this.visible = true;
        },
        hide: function(){
            this.visible = false;
        },
    }
});

var modal;

var Cover = {};

Cover.show = function(msg){
    if(!modal){
        var id = (Math.random()+'').replace('0.', 'modal');
        var el = $(`<div class="${id}"></div>`).hide();
        $('body').append(el);
        modal = new Modal({
            el: '.' + id
        });
    };
    modal.show(msg);
};

Cover.hide = function(){
    if(modal){
        modal.hide();
    };
};

export default Cover;