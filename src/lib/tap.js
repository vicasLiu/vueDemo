/*!
 * tap.js
 * Copyright (c) 2015 Alex Gibson 
 * https://github.com/alexgibson/tap.js/
 * Released under MIT license
 */
/* global define, module */
(function(global, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(function() {
            return (global.Tap = factory(global, global.document));
        });
    } else if (typeof exports === 'object') {
        module.exports = factory(global, global.document);
    } else {
        global.Tap = factory(global, global.document);
    }
}(typeof window !== 'undefined' ? window : this, function(window, document) {
    'use strict';

    function Tap(el) {
        this.el = typeof el === 'object' ? el : document.getElementById(el);
        this.moved = false; //flags if the finger has moved
        this.startX = 0; //starting x coordinate
        this.startY = 0; //starting y coordinate
        this.hasTouchEventOccured = false; //flag touch event
        this.bind('touchstart,mousedown');
    }

    Tap.prototype.bind = function(events, type){
        events.split(/,/).forEach(function(event){
            this.el[(type || 'add') + 'EventListener'](event, this, false);
        }.bind(this));
    }

    // return true if left click is in the event, handle many browsers
    Tap.prototype.leftButton = function(event) {
        // modern & preferred:  MSIE>=9, Firefox(all)
        if ('buttons' in event) {
            // https://developer.mozilla.org/docs/Web/API/MouseEvent/buttons
            return event.buttons === 1;
        } else {
            return 'which' in event ?
                // 'which' is well defined (and doesn't exist on MSIE<=8)
                // https://developer.mozilla.org/docs/Web/API/MouseEvent/which
                event.which === 1 :
                // for MSIE<=8 button is 1=left (0 on all other browsers)
                // https://developer.mozilla.org/docs/Web/API/MouseEvent/button
                event.button === 1;
        }
    };

    Tap.prototype.start = function(e) {
        if (e.type === 'touchstart') {
            this.hasTouchEventOccured = true;
            this.bind('touchmove,touchend,touchcancel');
        } else if (e.type === 'mousedown' && this.leftButton(e)) {
            this.bind('mousemove,mouseup');
        }
        this.moved = false;
        this.startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        this.startY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
    };

    Tap.prototype.move = function(e) {
        //if finger moves more than 10px flag to cancel
        var x = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        var y = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
        if (Math.abs(x - this.startX) > 10 || Math.abs(y - this.startY) > 10) {
            this.moved = true;
        }
    };
    Tap.prototype.end = function(e) {
        var evt;
        
        this.bind('touchmove,touchend,touchcancel,mouseup,mousemove', 'remove');

        if (!this.moved) {
            //create custom event
            try {
                evt = new window.CustomEvent('tap1', {
                    bubbles: true,
                    cancelable: true
                });
            } catch (e) {
                evt = document.createEvent('Event');
                evt.initEvent('tap1', true, true);
            }
            //prevent touchend from propagating to any parent
            //nodes that may have a tap.js listener attached
            e.stopPropagation();
            // dispatchEvent returns false if any handler calls preventDefault,
            if (!e.target.dispatchEvent(evt)) {
                // in which case we want to prevent clicks from firing.
                e.preventDefault();
            }
        }
    };
    Tap.prototype.cancel = function() {
        this.hasTouchEventOccured = false;
        this.moved = false;
        this.startX = 0;
        this.startY = 0;
    };
    
    Tap.prototype.destroy = function() {
        this.bind('touchstart,touchmove,touchend,touchcancel,mousedown,mouseup,mousemove', 'remove');
    };

    Tap.prototype.handleEvent = function(e) {
        switch (e.type) {
            case 'touchstart':
            case 'mousedown':
                this.start(e);
                break;
            case 'touchmove':
            case 'mousemove':
                this.move(e);
                break;
            case 'touchend':
            case 'mouseup':
                this.end(e);
                break;
            case 'touchcancel':
                this.cancel(e);
                break;
        }
    };
    
    return Tap;
}));