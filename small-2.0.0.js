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

		SMALLOBJECT = 'SMALLOBJECT',

		small = function(selector, context) {

			return small.fn.init(selector, context);

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
		},
		bind: function(scope) {
			var method = this;
			var args = arguments.toArray(1);
			return function() {
				return method.apply(scope, args.concat(arguments));
			};
		},
		defer: function(millis) {
			return this._job = setTimeout.apply(null, [this].concat(arguments.toArray()));
		},
	});

	small.extend({
		nop: function() {},

		isSmall: function(obj) {
			return small.isUndefind(obj) ? false : (obj.isSmall ? obj.isSmall === SMALLOBJECT : false);
		},

		isDocument: function(obj) {
			return !small.isSmall(obj) && obj.nodeType ? true : false;
		},

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

		isEmptyString: function(obj) {
			return obj === '';
		},

		isNumber: function(obj) {
			return small.type(obj) === 'number' && !isNaN(obj);
		},

		isObject: function(obj) {
			return small.type(obj) === 'object';
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

		isNull: function(obj) {
			return obj === null;
		},

		isTrue: function(obj) {
			return obj === true;
		},

		isFalse: function(obj) {
			return obj === false;
		},

		isPlainObject: function(obj) {

			if (!small.isObject(obj) || obj.nodeType || small.isWindow(obj)) {
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

		isUndefind: function(obj) {
			return typeof obj === 'undefined';
		},
		toString: function(obj) {
			return small.isTrue(obj) ? 'yes' : small.isFalse(obj) ? 'no' : small.isObject(obj) ? JSON.stringify(obj) : obj;
		},
		query: function(selector, context) {

			var doms;

			var dom = context || document;

			if (small.isString(selector) && !small.isEmptyString(selector)) {

				if (small.isHTML(selector)) {

				} else if (small.isClass(selector)) {

					doms = dom.getElementsByClassName(selector.substring(1));

				} else if (small.isID(selector) && dom === document) {

					doms = dom.getElementById(selector.substring(1));

				} else if (small.isTag(selector)) {

					doms = dom.getElementsByTagName(selector);

				}
			} else {
				doms = [];
			}

			return doms;
		},
		uniqueSort: function(obj) {
			var hasDuplicate = false,
				duplicates = [],
				elem,
				j = 0,
				i = 0;
			if (!small.isArray(obj)) {
				return [];
			} else {
				obj.sort(function(a, b) {
					if (a === b) {
						hasDuplicate = true;
					}
					return 0;
				});

				if (hasDuplicate) {
					while ((elem = obj[i++])) {
						if (elem === obj[i]) {
							j = duplicates.push(i);
						}
					}
					while (j--) {
						obj.splice(duplicates[j], 1);
					}
				}
				return obj;
			}
		}
	});

	/*
		选择器
	*/

	var S = function(dom, selector, context) {

		dom = dom ? (dom.nodeType ? [dom] : dom.toArray() || []) : [];

		dom.selector = selector || '';

		dom.context = context || [];

		dom.__proto__ = small.fn;

		small.extend(dom.__proto__, {
			isSmall: SMALLOBJECT
		});

		return dom;

	};

	small.fn.init = function(selector, context) {

		if (small.isUndefind(selector) || (small.isEmptyString(selector) && small.isUndefind(context))) {

			return S();

		} else {
			if (small.isString(selector) && !small.isEmptyString(selector)) {

				if (small.isUndefind(context)) {

					return S(small.query(selector, document), selector, document);

				} else if (small.isDocument(context)) {

					return S(small.query(selector, context), selector, context);

				} else if (small.isSmall(context)) {

					return S(small.query(selector, context[0]), selector, context[0]);

				}

			} else if (!small.isString(selector) || small.isEmptyString(selector)) {

				if (small.isSmall(selector) || small.isSmall(context)) {

					context = small.isEmptyString(selector) ? context : selector;

					return context;

				} else if (small.isDocument(selector) || small.isDocument(context)) {

					context = small.isEmptyString(selector) ? context : selector;

					return S(context);

				} else if (small.isArray(selector) || small.isArray(context)) {

					context = small.isEmptyString(selector) ? context : selector;

					return S(context);

				}

			}
		}

	};

	/*
		small给document装备方法
	 */
	small.fn.extend({

		indexOf: array.prototype.indexOf,

		forEach: array.prototype.forEach,

		map: array.prototype.map,

		filter: array.prototype.filter,

		html: function(obj) {
			if (small.isUndefind(obj)) {
				return this[0].innerHTML;
			} else {
				this.forEach(function(dom) {
					if (small.isString(obj) || small.isNumber(obj)) {
						dom.innerHTML = obj;
					} else {
						dom.innerHTML = null;
						if (small.isArray(obj)) {
							obj.forEach(function(item) {
								dom.appendChild(item);
							});
						} else {
							dom.appendChild(obj);
						}
					}
				});
			}
		},

		text: function(obj) {
			if (small.isUndefind(obj)) {
				return this[0].textContent;
			} else {
				this.forEach(function(dom) {
					dom.textContent = obj;
				});
			}
		},

		empty: function() {
			this.forEach(function(dom) {
				dom.innerHTML = null;
			});
		},

		remove: function() {
			this.forEach(function(dom) {
				if (dom.parentNode) {
					dom.parentNode.removeChild(dom);
				}
			});
		},

		find: function(selector) {
			return small.fn.init(selector, this);
		},

		attr: function(name, value) {
			if (small.isUndefind(value)) {
				return this[0].getAttribute(name);
			} else {
				this.forEach(function(dom) {
					dom.setAttribute(name, small.toString(value));
				});
				return this;
			}
		},

		removeAttr: function(name) {
			this.forEach(function(dom) {
				dom.removeAttribute(name);
			});
			return this;
		},

		data: function(name, value) {
			var datas = [];
			if (small.isUndefind(name)) {
				var data = {};
				this.forEach(function(dom) {
					dom.dataset.forEach(function(value, key) {
						data[key] = value;
					});
					datas.push(data);
				});
			} else if (small.isUndefind(value)) {
				this.forEach(function(dom) {
					datas.push(dom.dataset[name]);
				});
			} else {
				this.forEach(function(dom) {
					dom.dataset[name] = value;
				});
				return this;
			}

			return datas.length == 1 ? datas[0] : datas;
		},

		removeData: function(name) {
			if (!small.isUndefind(name)) {
				this.removeAttr('data-' + name);
			}
			return this;
		},

		val: function(value) {
			if (small.isUndefind(value)) {
				return this.length ? this[0].value : null;
			} else {
				this.forEach(function(dom) {
					dom.value = small.toString(value);
				});
				return this;
			}
		},

		css: function(property, value) {
			if (small.isUndefind(value)) {
				if (small.isObject(property)) {
					property.forEach(function(value, key) {
						this.css(key, value);
					}.bind(this));
					return this;
				} else {
					return this[0].style[property] || document.defaultView.getComputedStyle(this[0], '')[property];
				}
			} else {
				this.forEach(function(dom) {
					dom.style[property] = value;
				});
				return this;
			}
		},

		addClass: function(name) {
			this.forEach(_addClass(name));
			return this;
		},

		removeClass: function(name) {
			this.forEach(_removeClass(name));
			return this;
		},

		show: function() {
			this.style('display', 'block');
			return this;
		},

		hide: function() {
			this.style('display', 'none');
			return this;
		},

		first: function() {
			return S(this[0]);
		},

		last: function() {
			return S(this[this.length - 1])
		},

		parents: function(obj) {
			if (small.isUndefind(obj)) {
				return S(small.uniqueSort(this.map(function(dom) {
					return dom.parentNode;
				})));
			} else {
				var ancestors = [];
				var nodes = this;

				while (nodes.length) {
					nodes = nodes.filter(function(node) {
						if (node && (node = node.parentNode) &&
							node !== document && ancestors.indexOf(node) < 0) {
							return ancestors.push(node);
						}
					});
				}

				return _filtered(ancestors, obj);
			}
		},

		siblings: function(obj) {
			return _filtered(_flatten(this.map(function(dom) {
				return dom.parentNode.children.toArray().filter(function(child) {
					return child !== dom;
				});
			})), obj);
		},

		children: function(obj) {
      return _filtered(_flatten(this.map(function(dom) {
        return dom.children.toArray();
      })), obj);
		}
	});

	function _existsClass(el, name) {
		return el.classList ? el.classList.contains(name) : (el.className.split(/\s+/g).indexOf(name) >= 0);
	};

	function _addClass(name) {
		return function(dom) {
			if (!_existsClass(dom, name)) {
				if (dom.classList) {
					dom.classList.add(name);
				} else {
					dom.className = (dom.className + ' ' + name).trim();
				}
			}
		};
	};

	function _removeClass(name) {
		return function(dom) {
			var className = dom.className;
			if (name && name != className) {
				if (_existsClass(dom, name)) {
					if (dom.classList) {
						dom.classList.remove(name);
					} else {
						var exp = new RegExp('^' + [name, name, name].join(' | ') + '$',
							'g');
						dom.className = className.replace(exp, ' ')
							.replace(/\s+/g, ' ')
							.trim();
					}
				}
			} else {
				dom.className = '';
			}
		};
	};

	function _flatten(array) {
		return S(array.length ? [].concat.apply([], array) : array);
	}

	function _filtered(nodes, selector) {
		return S(small.isUndefind(selector) ? nodes : nodes.filter(function(dom) {
			return dom.parentNode &&
				S(small.query(selector, dom.parentNode)).indexOf(dom) >= 0;
		}));
	};

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