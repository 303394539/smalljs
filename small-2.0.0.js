typeof DEBUG === 'undefined' && (DEBUG = 1);
'use strict';

DEBUG && console.time('core');
(function(global) {
	var
	document = window.document,

		version = "2.0.0",

		object = Object,

		array = Array,

		EMPTY_ARRAY = [],

		SMALLOBJECT = 'SMALLOBJECT';


	var $ = function(selector, children) {

		if ($.isUndefind(selector)) {
			return S();
		} else if ($.isSmall(selector) && $.isUndefind(children)) {
			return selector;
		} else {
			return S($.getDOMObject(selector, children), selector);
		}

	};

	var S = function(dom, selector) {

		dom = dom || EMPTY_ARRAY;

		dom.__proto__ = S.prototype;

		dom.selector = selector || '';

		return dom;
	};

	S.prototype = $.fn = {

		isS: SMALLOBJECT,

		indexOf: array.prototype.indexOf,

		forEach: array.prototype.forEach,

		map: array.prototype.map,

		filter: array.prototype.filter

	};


	$.extend = $.fn.extend = function() {
		var options, name, src, copy, copyIsArray, clone,
			target = arguments[0] || {},
			i = 1,
			length = arguments.length,
			deep = false;

		if (_type(target) === "boolean") {
			deep = target;

			target = arguments[i] || {};
			i++;
		}

		if (_type(target) !== "object" && _type(target) !== 'function') {
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

					if (deep && copy && (_isPlainObject(copy) || (copyIsArray = array.isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && array.isArray(src) ? src : [];

						} else {
							clone = src && _isPlainObject(src) ? src : {};
						}

						target[name] = $.extend(deep, clone, copy);

					} else if (copy !== undefined) {
						target[name] = copy;
					}
				}
			}
		}

		return target;
	};

	function _type(obj) {
		return object.prototype.toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
	};

	function _isWindow(obj) {
		return obj != null && obj === obj.window;
	};

	function _isPlainObject(obj) {
		if (_type(obj) !== "object" || obj.nodeType || _isWindow(obj)) {
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
	};

	$.extend(object.prototype, {
		forEach: function(fn, scope) {
			if (array.isArray(this)) {
				array.prototype.forEach.apply(this, arguments);
			} else {
				for (var key in this)
					if (object.prototype.hasOwnProperty.call(this, key)) {
						fn.call(scope, this[key], key, this);
					}
			}
		},
		map: function(fn, scope) {
			if (array.isArray(this)) {
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

	$.extend(Function.prototype, {
		bind: function(scope) {
			var method = this;
			var args = arguments.toArray(1);
			return function() {
				return method.apply(scope, args.concat(arguments));
			};
		},

		defer: function(millis) {
			return this._job = setTimeout.apply(null, [this].concat(arguments.toArray()));
		}
	});

	$.extend($, {
		nop: function() {},

		isSmall: function(obj) {
			return $.isUndefind(obj) ? false : (obj.isS ? obj.isS === SMALLOBJECT : false);
		},

		isDocument: function(obj) {
			return !$.isSmall(obj) && obj.nodeType ? true : false;
		},

		type: _type,

		isWindow: _isWindow,

		isFunction: function(obj) {
			return $.type(obj) === "function";
		},

		hasOwn: function(obj, property) {
			return object.prototype.hasOwnProperty.call(obj, property);
		},

		isString: function(obj) {
			return $.type(obj) === 'string';
		},

		isEmptyString: function(obj) {
			return obj === '';
		},

		isNumber: function(obj) {
			return $.type(obj) === 'number' && !isNaN(obj);
		},

		isObject: function(obj) {
			return $.type(obj) === 'object';
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

		isPlainObject: _isPlainObject,

		isArray: array.isArray,

		isUndefind: function(obj) {
			return typeof obj === 'undefined';
		},
		toString: function(obj) {
			return $.isTrue(obj) ? 'yes' : $.isFalse(obj) ? 'no' : $.isObject(obj) ? JSON.stringify(obj) : obj;
		},
		uniqueSort: function(obj) {
			var hasDuplicate = false,
				duplicates = [],
				elem,
				j = 0,
				i = 0;
			if (!$.isArray(obj)) {
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
		},
		getDOMObject: function(selector, children) {
			var nodeTypes = [1, 9, 11],
				doms = null;
			if ($.isString(selector)) {
				doms = $.query(document, selector);
				if (!$.isUndefind(children) && $.isString(children)) {
					if (doms.length === 0) {
						doms = null;
					} else if (doms.length === 1) {
						doms = $.query(doms[0], children);
					} else {
						doms = doms.map(function(dom) {
							return $.query(dom, children);
						});
					}
				}
			} else if ($.isDocument(selector) && nodeTypes.indexOf(selector.nodeType) >= 0 || $.isWindow(selector)) {
				doms = [selector];
			} else if ($.isArray(selector)) {
				doms = selector.filter(function(dom) {
					return !$.isNull(dom);
				});
			}
			return doms;
		},
		query: function(dom, selector) {
			var doms,

				selector = selector.trim();

			if ($.isClass(selector)) {
				doms = dom.getElementsByClassName(selector.substring(1));
			} else if ($.isID(selector)) {
				doms = document.getElementById(selector.substring(1));
				if (!doms) {
					doms = [];
				}
			} else if ($.isTag(selector)) {
				doms = dom.getElementsByTagName(selector);
			} else {
				doms = dom.querySelectorAll(selector);
			}
			return doms.nodeType ? [doms] : doms.toArray();
		}
	});

	global.Small = $;

	'$' in global || (global.$ = $);

	var
	_Small = global.Small,

		_$ = global.$;

	$.noConflict = function(deep) {
		if (global.$ === $) {
			global.$ = _$;
		}

		if (deep && global.Small === $) {
			global.Small = _small;
		}

		return $;
	}
})(this);
DEBUG && console.timeEnd('core');
DEBUG && console.time('dom');
(function($) {
	$.extend($.fn, {
		html: function(obj) {
			if ($.isUndefind(obj)) {
				return this[0].innerHTML;
			} else {
				this.forEach(function(dom) {
					if ($.isString(obj) || $.isNumber(obj)) {
						dom.innerHTML = obj;
					} else {
						dom.innerHTML = null;
						if ($.isArray(obj)) {
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
			if ($.isUndefind(obj)) {
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
		},

		attr: function(name, value) {
			if ($.isUndefind(value)) {
				return this[0].getAttribute(name);
			} else {
				this.forEach(function(dom) {
					dom.setAttribute(name, $.toString(value));
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
			if ($.isUndefind(name)) {
				var data = {};
				this.forEach(function(dom) {
					dom.dataset.forEach(function(value, key) {
						data[key] = value;
					});
					datas.push(data);
				});
			} else if ($.isUndefind(value)) {
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
			if (!$.isUndefind(name)) {
				this.removeAttr('data-' + name);
			}
			return this;
		},

		val: function(value) {
			if ($.isUndefind(value)) {
				return this.length ? this[0].value : null;
			} else {
				this.forEach(function(dom) {
					dom.value = $.toString(value);
				});
				return this;
			}
		},

		css: function(property, value) {
			if ($.isUndefind(value)) {
				if ($.isObject(property)) {
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
			if ($.isUndefind(obj)) {
				return S($.uniqueSort(this.map(function(dom) {
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
		return S($.isUndefind(selector) ? nodes : nodes.filter(function(dom) {
			return dom.parentNode &&
				S($.query(selector, dom.parentNode)).indexOf(dom) >= 0;
		}));
	};
})(Small);
DEBUG && console.timeEnd('dom');