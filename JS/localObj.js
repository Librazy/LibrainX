//http://www.cnblogs.com/mapping/archive/2013/01/19/2867992.html
//借用一下= =
var localObj = function (name) {
    var ls = window.localStorage, lo = ls.getItem(name) || '{}';
    try {
        lo = JSON.parse(lo);
        //判断lo是否是对象
        lo = Object(lo) === lo ? lo : {};
    } catch (e) {
        lo = {};
    }
    return {
        has: function (attr) {
            return !!lo[attr];
        },
        get: function (attr) {
            return lo[attr];
        },
        set: function (attr, val) {
            lo[attr] = val;
            return this;
        },
        remove: function (attr) {
            delete lo[attr];
            return this;
        },
        clear: function () {
            lo = {};
            return this;
        },
        save: function () {
            //lo为空时则删除localStorage
            if (this.size() > 0) {
                ls.setItem(name, JSON.stringify(lo));
            } else {
                ls.removeItem(name);
            }
            return this;
        },
        size: function () {
            return Object.keys(lo).length;
        },
        toJSON: function () {
            var o = {}, i;
            for (i in lo) {
                o[i] = lo[i];
            }
            return o;
        },
        toString: function () {
            return JSON.stringify(lo);
        }
    };
};