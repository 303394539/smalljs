'use strict';
(function(window){
    var small = function(){
        small.fun.init.prototype = small.fun;
        return new small.fn.init(arguments);
    };
    small.fn = small.prototype  = {
        init : function(objs){
            this.id = objs;
            return this;
        },
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
            if(){
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
        isString : function(obj){
            return typeof obj === 'String';
        },
        isDefined : function(){
            return this === 'undefined';
        }
    };
    window.small = window.$ = small;
})(window);
