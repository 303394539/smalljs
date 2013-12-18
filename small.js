typeof DEBUG === 'undefined' && (DEBUG = 1);
'use strict';
(function(WIN,DOM,OBJ,ARRAY){
	DEBUG && console.time('core');
	var small = (function(){
		var small = function(selector){
			return new small.fn.init(selector);
		};
		small.prototype = small.fn = {
			constructor : small,
			init : function(selector){
				if(!selector){
					return this;
				}
				else if(selector.isSmall){
					return  selector;
				}
				else{
					var doms = small.isString(selector)?small.getDOM(selector):small.isObject(selector)?doms=selector:[];
					doms = doms || [];
					doms.__proto__ = small.prototype;
					doms.selector = selector || '';
					return doms;
				};
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
			for(;i < length ;i++){
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
							}
							else{
								clone = src && small.isPlainObject(src) ? src : {};
							}
							target[name] = small.extend(deep,clone,copy);
						}
						else if(copy !== undefined){
							target[name] = copy;
						}
					}
				}
			}
			return target;
		};
		small.extend(OBJ.prototype,{
			each: function(fn, scope) {
				if (small.isArray(this)) {
					ARRAY.prototype.forEach.apply(this, arguments);
				}
				else {
					for (var key in this) if (small.hasOwnProperty(this, key)) {
						fn.call(scope, this[key], key, this);
					}
				}
			}
			,
			map: function(fn, scope) {
				if (small.isArray(this)) {
					return ARRAY.prototype.map.apply(this, arguments);
				}
				else {
					var result = {};
					this.each(function(value, key, object) {
						result[key] = fn.call(scope, value, key, object);
					});
					return result;
				}
			}
			,
			toArray: function(object, begin, end) {
				return ARRAY.prototype.slice.call(this, begin, end);
			}
		});
		DEBUG && console.timeEnd('core');
		DEBUG && console.time('selector');
		small.extend({
			getDOM : function(selector){
				selector = selector.trim();
				return small.query(DOM,selector);
			}
			,
			query : function(doms,selector){
				var _HTML = /^\s*<(\w+|!)[^>]*>/;
				var _CLASS = /^\.([\w-]+)$/;
				var _ID = /^#[\w\d-]+$/;
				var _TAG = /^[\w-]+$/;
				var elements;
				if(_CLASS.test(selector)){
					elements = doms.getElementsByClassName(selector.substring(1));
				}
				else if(_ID.test(selector)&&doms===DOM){
					elements = doms.getElementById(selector.substring(1));
				}
				else if(_TAG.test(selector)){
					elements = doms.getElementsByTagName(selector);
				}
				else{
					elements = doms.querySelectorAll(selector);
				}
				if(!elements)elements = [];
				return elements.nodeType ? [elements] : elements.toArray();
			}
		});
		DEBUG && console.timeEnd('selector');
		DEBUG && console.time('util');
		small.extend({
			hasOwnProperty : function(object,property){
				return OBJ.prototype.hasOwnProperty.call(object, property);
			}
			,
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
				if(this.isDefined(format)||format===''||format===null)format = 'yyyy-MM-dd hh-mm-ss'
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
			}
			,
			type : function(obj){
				return OBJ.prototype.toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
			}
			,
			isArray : ARRAY.isArray,
			isObject : function(obj){
				return small.type(obj) === 'object';
			}
			,
			isNumber : function(obj){
				return small.type(obj) === 'number';
			}
			,
			isString : function(obj){
				return small.type(obj) === 'string';
			}
			,
			isDefined : function(obj){
				return obj === undefined;
			}
			,
			isNull : function(obj){
				return obj === null;
			}
			,
			isBoolean : function(obj){
				return small.type(obj) === 'boolean';
			}
			,
			isTrue : function(obj){
				return obj === true;
			}
			,
			isFalse : function(obj){
				return obj === false;
			}
			,
			isElement : function(obj){
				return small.type(obj).indexOf('html')>=0&&small.type(obj).indexOf('element')>0;
			}
			,
			string : function(obj){
				return small.isString(obj)?obj:
				small.isObject(obj)?JSON.stringify(obj):
				String(obj);
			}
		});
		DEBUG && console.timeEnd('util');
		DEBUG && console.time('dom');
		small.extend({
			create : function(obj,parentNode){
				if(obj){
					var nodes = [];
					var elements = small.isObject(obj)?[obj]:small.isArray(obj)?obj:null;
					elements.each(function(item){
						if(item){
							var element = document.createElement(item.tag || 'div');
							item.each(function(value,key){
								switch(key){
									case 'tag':
									break;
									case 'style':
									element.style.cssText = value;
									break;
									case 'text':
									element.textContent = value;
									break;
									case 'html':
									element.innerHTML = value;
									break;
									case 'children':
									small.create(value,element);
									break;
									default:
									element.setAttribute(key,value?value:'');
									break;
								}
								if(parentNode){
									small.isString(parentNode)?$(parentNode)[0].appendChild(element):small.isElement(parentNode)?parentNode.appendChild(element):null;
								}
							});
						}
					});
				}
			}
			,
		
		});
		small.extend(small.fn,{
			isSmall : true,
			indexOf : ARRAY.prototype.indexOf,
			each : ARRAY.prototype.forEach,
			map : ARRAY.prototype.map,
			filter : ARRAY.prototype.filter,
			parent : function(selector){
				var parents = [];
				this.each(function(item){
					if(item.parentNode&&parents.indexOf(item.parentNode)<0&&item.parentNode!==document)parents.push(item.parentNode);
				});
				return $(!selector ? parents : parents.filter(function(item){
					return item.parentNode && item.parentNode!==document && small.query(item.parentNode,selector).indexOf(item)>=0;
				}));
			}
			,
			children : function(selector){
				return $(_concat(this.map(function(item){
					return !selector?item.children.toArray():item.children.toArray().filter(function(item){
						return item.parentNode && small.query(item.parentNode,selector).indexOf(item)>=0;
					});
				})));
			}
			,
			brother : function(selector){
				return $(_concat(this.map(function(item){
					var list = item.parentNode.children.toArray();
					return !selector ? list : list.filter(function(item){
						return item.parentNode && small.query(item.parentNode,selector).indexOf(item)>=0;
					});
				})));
			}
			,
			val : function(obj){
				if(!obj&&!small.isString(obj)){
					var result = [];
					this.each(function(item){
						result.push(item.value?item.value:null);
					});
					return result.length?(result.length===1?result[0]:result):null;
				}
				else{
					this.each(function(item){
						item.value = small.string(obj);
					});
					return this;
				}
			}
			,
			text : function(obj){
				if(!obj&&!small.isString(obj)){
					var result = [];
					this.each(function(item){
						result.push(item.textContent?item.textContent:null);
					});
					return result.length?(result.length===1?result[0]:result):null;
				}
				else{
					this.each(function(item){
						item.textContent = small.string(obj);
					});
					return this;
				}
			}
			,
			html : function(obj){
				if(!obj&&!small.isString(obj)){
					var result = [];
					this.each(function(item){
						result.push(item.innerHTML?item.innerHTML:null);
					});
					return result.length?(result.length===1?result[0]:result):null;
				}
				else{
					if(small.isString(obj)||small.isNumber(obj)){
						this.each(function(item){
							item.innerHTML = obj;
						});
					}
					else if(small.isArray(obj)){
						this.each(function(item){
							item.innerHTML = null;
							obj.each(function(child){
								item.appendChild(child);
							});
						});
					}
					else{
						this.each(function(item){
							item.innerHTML = null;
							item.appendChild(obj);
						});
					}
					return this;
				}
			}
			,
			css : function(property,value){
				var VENDORS = ['-webkit-', '-moz-', '-ms-', '-o-', ''];
				if(small.isString(property)){
					if(small.isString(value)){
						this.each(function(item){
							VENDORS.each(function(vendor){
								item.style[vendor+property] = value;
							});
						});
					}
					else{
						var result = [];
						this.each(function(item){
							result.push(item.style[property]||document.defaultView.getComputedStyle(item,'')[property]);
						});
						return result.length?(result.length===1?result[0]:result):null;
					}
				}
				else if(small.isObject(property)){
					var items = this;
					property.each(function(value,key){
						items.css(key,value);
					});
				}
				return this;
			}
			,
			attr : function(property,value){
				if(small.isString(property)){
					if(!value){
						var result = [];
						this.each(function(item){
							result.push(item.getAttribute(property));
						});
						return result.length?(result.length===1?result[0]:result):null;
					}
					else{
						this.each(function(item){
							item.setAttribute(property,small.string(value));
						});
					}
				}
				else if(small.isObject(property)){
					var items = this;
					property.each(function(value,key){
						items.attr(key,value);
					});
				}
				return this;
			}
			,
			removeAttr : function(property){
				if(small.isString(property)){
					this.each(function(item){
						item.removeAttribute(property);
					});
				}
				return this;
			}
			,
			hide : function(){
				this.css('display','none');
				return this;
			}
			,
			show : function(){
				this.css('display','block');
				return this;
			}
		});
		function _concat(array) {
			return array.length ? [].concat.apply([], array) : array;
		}
		DEBUG && console.timeEnd('dom');
		DEBUG && console.time('env');
        var platforms = [
            // Android 2 - 4
            {n: 'android', g: 0, r: /Android (\d+)/},
            // iOS 3 - 7 / iPhone
            {n: 'ios', g: 0, r: /iPhone OS (\d+)/, x:{iphone: 1}},
            // iOS 3 - 7 / iPad
            {n: 'ios', g: 0, r: /iPad;(?: U;)? CPU OS (\d+)/, x:{ipad: 1}},
            // Windows Phone 7 - 8
            {n: 'wpos', g: 0, r: /Windows Phone (?:OS )?(\d+)[.\d]+/},
            // Kindle Fire
            {n: 'android', g: 0, r: /Silk\/1./, v: 2, x:{silk: 1}},
            // Kindle Fire HD
            {n: 'android', g: 0, r: /Silk\/2./, v: 4, x:{silk: 2}},
            // webOS 1 - 3
            {n: 'webos', g: 0, r: /(?:web|hpw)OS\/(\d+)/},
            // webOS 4 / OpenWebOS
            {n: 'webos', g: 0, r: /WebAppManager|Isis/, v: 4},
            // FirefoxOS
            {n: 'ffos', g: 0, r: /Mobile;.*Firefox\/(\d+)/},
            // Blackberry Playbook
            {n: 'blackberry', g: 0, r: /PlayBook/i, v: 2},
            // Blackberry 10+
            {n: 'blackberry', g: 0, r: /BB1\d;.*Version\/(\d+\.\d+)/},
            // Tizen
            {n: 'tizen', g: 0, r: /Tizen (\d+)/},
            // Safari
            {n: 'safari', g: 1, r: /Version\/(\d+)[.\d]+.+Safari/},
            // Chrome on iOS
            {n: 'chrome', g: 1, r: /CriOS\/(\d+)[.\d]+.+Safari+/},
            // Chrome
            {n: 'chrome', g: 1, r: /Chrome\/(\d+)[.\d]+/},
            // IE 8 - 10
            {n: 'ie', g: 1, r: /MSIE (\d+)/},
            // IE 11
            {n: 'ie', g: 1, r: /Trident\/.*; rv:(\d+)/},
            // desktop Firefox
            {n: 'firefox', g: 1, r: /Firefox\/(\d+)/}
        ];
        var env = {
            touch : (('ontouchstart') in window || !!WIN.navigator.userAgent),
            gesture : (('ongesturestart') in window || !!WIN.navigator.userAgent),
            online : WIN.navigator.onLine,
            userAgent : WIN.navigator.userAgent,
            msPointEnabled : !!WIN.navigator.userAgent,
            screenWidth : window.innerWidth,
            screenHeight : window.innerHeight
        };
        var status = [0,0];
        var matches,browser = {};
        platforms.each(function(item){
            if(!status[item.g]&&(matches=item.r.exec(WIN.navigator.userAgent))){
                status[item.g] = browser['version'] = item.v || +matches[1];
                browser['name'] = item.n;
                if(item.x){
                    small.extend(env,item.x);
                }
            }
        });
        env.mobile = !!(status[0]);
        env.browser = browser.name;
        env.version = browser.version;
        small.extend({
            env:env
        });
		DEBUG && console.timeEnd('env');
		DEBUG && console.time('event');
        small.extend(small.fn,{
            listen : function(){},
            removeListen : function(){},
            trigger : function(){}
        });
		DEBUG && console.timeEnd('event');
		return small;
	})();
	WIN.small = WIN.$ = small;
})(window,document,Object,Array);
