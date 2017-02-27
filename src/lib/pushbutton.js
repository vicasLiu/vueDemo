! function (t, n) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = n() : "function" == typeof define && define.amd ? define(n) : t.Pushbutton = n()
}(this, function () {
    "use strict";

    function t(t, n) {
        if ("undefined" == typeof document) return n;
        t = t || "";
        var e = document.head || document.getElementsByTagName("head")[0],
            s = document.createElement("style");
        return s.type = "text/css", s.styleSheet ? s.styleSheet.cssText = t : s.appendChild(document.createTextNode(t)), e.appendChild(s), n
    }

    function n(t, n, e) {
        var s, a = {},
            i = t[0],
            o = t[1];
        if ("object" == typeof i) a = i;
        else {
            if (1 === t.length) return this[0] ? n(this[0]) : null;
            a[i] = o
        }
        return s = Object.keys(a), this.each(function (t) {
            s.forEach(function (n) {
                e(t, n, a)
            })
        })
    }

    function e(t, n) {
        var s = [];
        return s = "string" == typeof t ? (n || document).querySelectorAll(t) : [t], e.extend(s, e.fn), s
    }

    function s(t, n) {
        this.ele = e(t);
        var s = this.ele.attr("id");
        s || (s = "pushbutton" + Math.random().toString().replace("0.", ""), this.ele.attr("id", s)), this.id = e("#" + s), this.init(n)
    }
    return e.extend = function () {
        var t, n = arguments,
            e = !1,
            s = Array.prototype;
        return "boolean" == typeof n[0] && (e = s.shift.call(n)), t = s.shift.call(n), s.forEach.call(n, function (n) {
            Object.keys(n).forEach(function (s) {
                e && "object" == typeof n[s] && "object" == typeof t[s] ? extend(!0, t[s], n[s]) : "undefined" != typeof n[s] && (t[s] = n[s])
            })
        }), t
    }, e.fn = {
        each: function (t) {
            return Array.prototype.forEach.call(this || [], t), this
        },
        on: function (t, n) {
            return t = t.split(/\s*\,\s*/), this.each(function (e) {
                n = n.bind(e), t.forEach(function (t) {
                    e.addEventListener(t, n)
                })
            })
        },
        css: function (t, e) {
            var s = function (t) {
                return t.replace(/(-([a-z]))/g, function (t, n, e) {
                    return e.toUpperCase()
                })
            };
            return n.call(this, arguments, function (n) {
                return n.style[s(t)]
            }, function (t, n, e) {
                t.style[s(n)] = e[n] + ""
            })
        },
        attr: function (t, e) {
            return n.call(this, arguments, function (n) {
                return n.getAttribute(t)
            }, function (t, n, e) {
                t.setAttribute(n, e[n] + "")
            })
        },
        hasClass: function (t) {
            var n = !1,
                e = new RegExp("\\b" + t + "\\b");
            return this.each(function (t) {
                n = n || !!t.className.match(e)
            }), n
        },
        addClass: function (t, n) {
            var e = new RegExp("\\b" + t + "\\b");
            return this.each(function (s) {
                var a = s.className;
                "string" == typeof a && ("remove" === n ? a.match(e) && (s.className = a.replace(e, "")) : a.match(e) || (s.className += " " + t))
            })
        },
        removeClass: function (t) {
            return this.addClass(t, "remove")
        },
        html: function (t) {
            return this.each(function (n) {
                n.innerHTML = t
            })
        },
        show: function () {
            return this.each(function (t) {
                "none" === t.style.display && (t.style.display = t.getAttribute("o-d") || "")
            })
        },
        hide: function () {
            return this.each(function (t) {
                "none" !== t.style.display && (t.setAttribute("o-d", t.style.display), t.style.display = "none")
            })
        },
        toggle: function () {
            return this.each(function (t) {
                var n = $(t);
                "none" == n.css("display") ? n.show() : n.hide()
            })
        }
    }, t(".widget-ui-pushbutton{\n\tposition:absolute;\n\ttop:0;\n\tleft:0;\n\tz-index:100;\n\twidth:100%;\n\theight:100%;\n}\n.widget-ui-pushbutton-list{\n\tposition:absolute;\n\tleft: 0;\n\tbottom: 0; \n\tz-index:101;\n\twidth: 100%; \n\toverflow-y:auto;\n\tbackground: #fff; \n\ttext-align: center; \n\tcolor: #333;\n}\n.widget-ui-pushbutton-list>a.pushbutton-cancel,\n.widget-ui-pushbutton-list>a.list-a{\n\tdisplay:block;\n\tpadding:15px; \n\tborder-top:1px solid #d4d4d4; \n\tfont-size: 16px;\n\tcolor:#333;\n\tcursor:pointer;\n\twhite-space:nowrap;\n    text-overflow:ellipsis;\n    overflow:hidden;\n}\n.widget-ui-pushbutton-list>a.pushbutton-cancel:active,\n.widget-ui-pushbutton-list>a.list-a:active{\n\tbackground:#ccc;\n\tcolor:#fff;\n}\n.widget-ui-pushbutton-list>a.list-a:first-child{\n\tborder:none;\n}\n.widget-ui-pushbutton-list>a.pushbutton-cancel{\n\tcolor:#6DA0F6;\t\n}\n.pushbutton-in{\n\tdisplay:block;\n\tanimation:pushbuttonIn .35s forwards;\n\t-webkit-animation:pushbuttonIn .35s forwards;\n}\n@keyframes pushbuttonIn{\n\tfrom {\n\t\tbackground:rgba(0,0,0,0);\n\t}\n\tto {\n\t\tbackground:rgba(0,0,0,0.5);\n\t}\n}\n@-webkit-keyframes pushbuttonIn{\n\tfrom {\n\t\tbackground:rgba(0,0,0,0);\n\t}\n\tto {\n\t\tbackground:rgba(0,0,0,0.5);\n\t}\n}\n.pushbutton-out{\n\tanimation:pushbuttonOut .35s forwards;\n\t-webkit-animation:pushbuttonOut .35s forwards;\n}\n@keyframes pushbuttonOut{\n\tfrom {\n\t\tbackground:rgba(0,0,0,0.5);\n\t}\n\tto {\n\t\tbackground:rgba(0,0,0,0);\n\t}\n}\n@-webkit-keyframes pushbuttonOut{\n\tfrom {\n\t\tbackground:rgba(0,0,0,0.5);\n\t}\n\tto {\n\t\tbackground:rgba(0,0,0,0);\n\t}\n}\n.pushbutton-in .widget-ui-pushbutton-list{\n    animation:pushbuttonUlIn .35s forwards;\n    -webkit-animation:pushbuttonUlIn .35s forwards;\n}\n@keyframes pushbuttonUlIn{\n\tfrom {\n\t\t-webkit-transform: translate(0, 100%) translateZ(0);\n\t\ttransform: translate(0, 100%) translateZ(0);\n\t}\n\tto {\n\t\t-webkit-transform: translate(0, 0) translateZ(0);\n\t\ttransform: translate(0, 0) translateZ(0);\n\t}\n}\n@-webkit-keyframes pushbuttonUlIn{\n\tfrom {\n\t\t-webkit-transform: translate(0, 100%) translateZ(0);\n\t\ttransform: translate(0, 100%) translateZ(0);\n\t}\n\tto {\n\t\t-webkit-transform: translate(0, 0) translateZ(0);\n\t\ttransform: translate(0, 0) translateZ(0);\n\t}\n}\n.pushbutton-out .widget-ui-pushbutton-list{\n    animation:pushbuttonUlOut .35s forwards;\n    -webkit-animation:pushbuttonUlOut .35s forwards;\n}\n@keyframes pushbuttonUlOut{\n\tfrom {\n\t\t-webkit-transform: translate(0, 0) translateZ(0);\n\t\ttransform: translate(0, 0) translateZ(0);\n\t}\n\tto {\n\t\t-webkit-transform: translate(0, 100%) translateZ(0);\n\t\ttransform: translate(0, 100%) translateZ(0);\n\t}\n}\n@-webkit-keyframes pushbuttonUlOut{\n\tfrom {\n\t\t-webkit-transform: translate(0, 0) translateZ(0);\n\t\ttransform: translate(0, 0) translateZ(0);\n\t}\n\tto {\n\t\t-webkit-transform: translate(0, 100%) translateZ(0);\n\t\ttransform: translate(0, 100%) translateZ(0);\n\t}\n}", void 0), s.prototype = {
        version: "1.0.0",
        init: function (t) {
            this.options = {}, 
            this.options.maxHeight = 240, 
            this.options.animateIn = "pushbutton-in", 
            this.options.animateOut = "pushbutton-out", 
            e.extend(this.options, t), 
            this.render()
        },
        render: function () {
            this.id.hide().addClass("widget-ui-pushbutton").html(this.createTpl());
            if(this.options.isShow) { this.show(); };
            this.event()
        },
        destroy: function () {
            this.id.remove()
        },
        refresh: function (t) {
            t ? e.extend(this.options, t) : t = this.options, this.init(t)
        },
        forInAttr: function (t) {
            var n, e = "";
            for (n in t) e += n + '="' + t[n] + '" ';
            return e
        },
        createTpl: function () {
            var t, n, e, s, a, i = 0,
                o = 0,
                r = 0,
                u = this.options,
                l = u.data;
            this.id;
            Array.isArray(l) || (l = []);
            for (var h = l.length, c = '<div class="widget-ui-pushbutton-list" style="max-height:' + u.maxHeight + 'px;">'; i < h; i++) {
                if (t = l[i], n = t.cls || "", e = t.text || "", a = t.attr, s = "", "object" != typeof a || Array.isArray(a)) {
                    if (Array.isArray(a))
                        for (r = a.length, o = 0; o < r; o++) s += this.forInAttr(a[o])
                } else s += this.forInAttr(a);
                c += '<a href="javascript:void(0);" tabIndex="' + i + '" class="list-a ' + n + '" ' + s + ">" + e + "</a>"
            }
            return c += '<a href="javascript:void(0);" class="pushbutton-cancel">取消</a>                </div>'
        },
        event: function () {
            var t = this.id,
                n = this.options,
                s = n.data || [],
                a = n.onClick,
                i = !1,
                o = "";
            t.on("click", function (t) {
                o = t.target || t.srcElement, i = !1, t.index = t.target.tabIndex, t.data = s[t.index], "function" == typeof a ? (i = a(t), i && e(o).hasClass("list-a") || this.hide()) : this.hide()
            }.bind(this))
        },
        show: function () {
            var t = this.options.animateIn;
            this.id.show().addClass(t);
        },
        hide: function () {
            var t = this.options,
                n = t.animateIn,
                e = t.animateOut,
                s = this.id;
            s.addClass(e), setTimeout(function () {
                s.removeClass(e + " " + n).hide()
            }, 351)
        }
    }, s
});