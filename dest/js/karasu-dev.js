(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){
"use strict";

var _utils = require("./utils/utils.js");

global.raven = {
  "utils": _utils.utils
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./utils/utils.js":7}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clickEach = exports.toggle = exports.click = void 0;

var _helper = require("./helper");

var click = function click(nodeElement, action) {
  var selector = (0, _helper.isNode)(nodeElement) ? nodeElement : document.querySelector(nodeElement);
  selector.addEventListener('click', function (event) {
    return action(event);
  });
};

exports.click = click;

var toggle = function toggle(nodeElement, even, odd) {
  var selector = (0, _helper.isNode)(nodeElement) ? nodeElement : document.querySelector(nodeElement),
      control = 0;
  selector.addEventListener('click', function (event) {
    if (control == 0) {
      even(event);
      control = 1;
    } else {
      odd(event);
      control = 0;
    }
  });
};

exports.toggle = toggle;

var clickEach = function clickEach(nodeElements, action) {
  var selector = (0, _helper.isNode)(nodeElement) ? nodeElements : document.querySelectorAll(nodeElements);

  for (var i = 0; i < selector.length; i++) {
    selector[i].addEventListener('click', function (event) {
      return action(event);
    });
  }
};

exports.clickEach = clickEach;

},{"./helper":5}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.css = void 0;

var _ADD_CLASS_CSS = function _ADD_CLASS_CSS(element) {
  for (var _len = arguments.length, className = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    className[_key - 1] = arguments[_key];
  }

  var getClass = [].concat(className);

  for (var i = getClass.length - 1; i >= 0; i--) {
    element.classList.add(getClass[i]);
  }
};

var _TOGGLE_CLASS_CSS = function _TOGGLE_CLASS_CSS(element, className) {
  element.classList.toggle(className);
};

var _REMOVE_CLASS_CSS = function _REMOVE_CLASS_CSS(element, className) {
  element.classList.remove(className);
  return className;
};

var _HAS_CLASS_CSS = function _HAS_CLASS_CSS(element, className) {
  var getClassName = element.getAttribute('class');

  if (getClassName) {
    var reg = new RegExp(className, 'g'),
        checkCSS = reg.test(getClassName);
    return checkCSS ? true : false;
  }

  return '';
};

var _CLEAN_ALL_CSS = function _CLEAN_ALL_CSS(array, className) {
  for (var i = 0; i < array.length; i++) {
    array[i].classList.remove(className);
  }
};

var css = {
  "add": _ADD_CLASS_CSS,
  "remove": _REMOVE_CLASS_CSS,
  "has": _HAS_CLASS_CSS,
  "clean": _CLEAN_ALL_CSS,
  "toggle": _TOGGLE_CLASS_CSS
};
exports.css = css;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.each = void 0;

var each = function each(array, callback) {
  for (var i = 0; i < array.length; i++) {
    callback.call(array[i], i, array[i]);
  }
};

exports.each = each;

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isNode = void 0;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var isNode = function isNode(checkElement) {
  var check = _typeof(checkElement);

  return check == 'object' ? true : false;
};

exports.isNode = isNode;

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.merge = void 0;

var merge = function merge(source, properties) {
  var property;

  for (property in properties) {
    if (properties.hasOwnProperty(property)) {
      source[property] = properties[property];
    }
  }

  return source;
};

exports.merge = merge;

},{}],7:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.utils = void 0;

var _click = require("./module/click");

var _css = require("./module/css");

var _each = require("./module/each");

var _merge = require("./module/merge");

var utils = {
  "click": _click.click,
  "clickEach": _click.clickEach,
  "toggle": _click.toggle,
  "css": _css.css,
  "each": _each.each,
  "merge": _merge.merge
};
exports.utils = utils;
global.utils = utils;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./module/click":2,"./module/css":3,"./module/each":4,"./module/merge":6}]},{},[1]);
