'use strict';
(function(win){
    var small = (function(){
        var small = function(selector){
            return new small.fn.init(selector);
        };
        small.prototype = small.fn = {
            constructor : small,
            init : function(selector){
                return this;
            }
        };
        small.fn.init.prototype = small.fn;
        small.extend = small.fn.extend = function(){
            var options,name,src,copy,copyIsArray,clone,
                target = arguments[0] || {},
                i = 1,
                length = arguments.length,
                deep = false;
            if(typeof target === 'boolean'){
                deep = target;
                target = arguments[1] || {};
                i = 2;
            }
            if(typeof target !== 'object' && !small.isFunction(target)){
                target = {};
            }
            if(length === i){
                target = this;
                --i;
            }
            for(;i < length ; i++){
                if((options=arguments[i]) != null){
                    for(name in options){
                        src = target[name];
                        copy = options[name];
                        if(target === copy){
                            continue;
                        }
                        if(deep&&copy&&(small.isPlainObject(copy) || (copyIsArray = small.isArray(copy)))){
                            if(copyIsArray){
                                copyIsArray = false;
                                clone = src && small.isArray(src) ? src : [];
                            }else{
                                clone = src && small.isPlainObject(src) ? src : {};
                            }
                            target[name] = small.extend(deep,clone,copy);
                        }else if(copy !== undefined){
                            target[name] = copy;
                        }
                    }
                }
            }
            return target;
        };
        small.extend({
            time : function(format){
                var time = new Date();
                var o = { 
                  "M+" : time.getMonth()+1, //month 
                  "d+" : time.getDate(), //day 
                  "h+" : time.getHours(), //hour 
                  "m+" : time.getMinutes(), //minute 
                  "s+" : time.getSeconds(), //second 
                  "q+" : Math.floor((time.getMonth()+3)/3), //quarter 
                  "S" : time.getMilliseconds() //millisecond 
                } 
                if(this.isDefined(format))format = 'yyyy-MM-dd hh-mm-ss'
                if(this.isString(format)){
                    if(/(y+)/.test(format)) { 
                      format = format.replace(RegExp.$1, (time.getFullYear()+"").substr(4 - RegExp.$1.length)); 
                    } 
                    for(var k in o) { 
                      if(new RegExp("("+ k +")").test(format)) { 
                        format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
                      } 
                    }
                }
                return format; 
            },
            type : function(obj){
                return typeof obj;
            },
            isNumber : function(obj){
                return typeof obj === 'number';
            },
            isString : function(obj){
                return typeof obj === 'string';
            },
            isDefined : function(obj){
                return typeof obj === 'undefined';
            }
        });
        return small;
    })();
    win.small = win.$ = small;
})(window);
