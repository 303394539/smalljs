'use strict';
(function(global, factory) {

	if (typeof module === "object" && typeof module.exports === "object") {
		module.exports = global.document ?
			factory(global, true) :
			function(w) {
				if (!w.document) {
					throw new Error("small框架需要window对象和document对象");
				}
				return factory(w);
		};
	} else {
		factory(global);
	}

}(typeof window !== "undefined" ? window : this, function(window, noGlobal) {

	/*
		core,small框架核心
	*/
	var
	document = window.document,

		version = "2.0.0",

		object = Object,

		array = Array,

		strundefined = typeof undefined,

		small = function(selector, context) {

			var Q = new small.fn.init(selector, context);
			Q.__proto__ = small.fn;
			return Q;

		};

	small.fn = small.prototype = {

		version: version,

		constructor: small,

		selector: '',

	};

	small.extend = small.fn.extend = function() {
		var options, name, src, copy, copyIsArray, clone,
			target = arguments[0] || {},
			i = 1,
			length = arguments.length,
			deep = false;

		if (typeof target === "boolean") {
			deep = target;

			target = arguments[i] || {};
			i++;
		}

		if (typeof target !== "object" && !small.isFunction(target)) {
			target = {};
		}

		if (i === length) {
			target = this;
			i--;
		}

		for (; i < length; i++) {
			if ((options = arguments[i]) != null) {
				for (name in options) {
					src = target[name];
					copy = options[name];

					if (target === copy) {
						continue;
					}

					if (deep && copy && (small.isPlainObject(copy) || (copyIsArray = small.isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && small.isArray(src) ? src : [];

						} else {
							clone = src && small.isPlainObject(src) ? src : {};
						}

						target[name] = small.extend(deep, clone, copy);

					} else if (copy !== undefined) {
						target[name] = copy;
					}
				}
			}
		}

		return target;
	};

	/*
		small框架基础方法
	*/
	small.extend(object.prototype, {
		forEach: function(fn, scope) {
			if (small.isArray(this)) {
				array.prototype.forEach.apply(this, arguments);
			} else {
				for (var key in this)
					if (small.hasOwn(this, key)) {
						fn.call(scope, this[key], key, this);
					}
			}
		},
		map: function(fn, scope) {
			if (small.isArray(this)) {
				return array.prototype.map.apply(this, arguments);
			} else {
				var result = {};
				this.forEach(function(value, key, object) {
					result[key] = fn.call(scope, value, key, object);
				});
				return result;
			}
		},
		toArray: function(object, begin, end) {
			return array.prototype.slice.call(this, begin, end);
		}
	});

	small.extend({
		//获取对象类型
		type: function(obj) {
			return object.prototype.toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
		},
		//是否是window对象
		isWindow: function(obj) {
			return obj != null && obj === obj.window;
		},
		//是否是function对象
		isFunction: function(obj) {
			return small.type(obj) === "function";
		},
		//判断对象是否有某属性名属性
		hasOwn: function(obj, property) {
			return object.prototype.hasOwnProperty.call(obj, property);
		},
		//判断是否是字符串
		isString: function(obj) {
			return small.type(obj) === 'string';
		},

		isNumber: function(obj){
			return small.type(obj) === 'number' && !isNaN(obj);
		},

		isObject: function(obj){
			return small.type(obj) === 'obj';
		},

		isHTML: function(obj) {
			return /^\s*<(\w+|!)[^>]*>/.test(obj);
		},

		isClass: function(obj) {
			return /^\.([\w-]+)$/.test(obj);
		},

		isID: function(obj) {
			return /^#[\w\d-]+$/.test(obj);
		},

		isTag: function(obj) {
			return /^[\w-]+$/.test(obj);
		},

		//是否是
		isPlainObject: function(obj) {

			if (small.type(obj) !== "object" || obj.nodeType || small.isWindow(obj)) {
				return false;
			}

			try {
				if (obj.constructor && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
					return false;
				}
			} catch (e) {
				return false;
			}

			return true;
		},
		//判断是否是数组对象
		isArray: array.isArray,

		isUndefind: function(obj){
			return typeof obj === 'undefined';
		},
		toString: function(obj){
	    return obj === true 
        ? 'yes' : obj === false 
                  ? 'no' : small.isObject(obj) 
                           ? JSON.stringify(obj) : obj;
		}
	});

	/*
		选择器
	*/
	small.fn.init = function(selector, context) {

		var doms;

		if (!selector) {
			return this;
		}

		if (small.isString(selector)) {
			if (small.isHTML(selector)) {

			} else if (small.isClass(selector)) {

				doms = document.getElementsByClassName(selector.substring(1));

			} else if (small.isID(selector)) {

				doms = document.getElementById(selector.substring(1));

			} else if (small.isTag(selector)) {

				doms = document.getElementsByTagName(selector);

			} else {

				doms = document.querySelectorAll(selector);

			}
		}

		doms = doms.nodeType ? [doms] : doms.toArray();

		if (doms) {
			doms.context = document;
			doms.selector = selector || '';
		}else{
			doms = [];
		}

		return doms;
	};

	/*
		small给document方法
	 */
	small.fn.extend({

		indexOf: array.prototype.indexOf,

    forEach: array.prototype.forEach,

    map: array.prototype.map,

    filter: array.prototype.filter,

		html: function(obj) {
			if(small.isUndefind(obj)){
				return this[0].innerHTML;
			}else{
				this.forEach(function(dom){
					if(small.isString(obj) || small.isNumber(obj)){
						dom.innerHTML = obj;
					}else{
						dom.innerHTML = null;
						if(small.isArray(obj)){
							obj.forEach(function(item){
								dom.appendChild(item);
							});
						}else{
							dom.appendChild(obj);
						}
					}
				});
			}
		},

		text: function(obj){
			if(small.isUndefind(obj)){
				return this[0].textContent;
			}else{
				this.forEach(function(dom){
					dom.textContent = obj;
				});
			}
		},

		empty: function(){
			this.forEach(function(dom){
				item.innerHTML = null;
			});
		}
	});

	/*
		在环境中装配small对象
	*/
	var
	_small = window.small,

		_$ = window.$;

	small.noConflict = function(deep) {
		if (window.$ === small) {
			window.$ = _$;
		}

		if (deep && window.small === small) {
			window.small = _small;
		}

		return small;
	};

	if (typeof noGlobal === strundefined) {
		window.small = window.$ = small;
	};

	return small;

}));