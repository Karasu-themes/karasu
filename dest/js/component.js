(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){
"use strict";

var _dropdown = require("./module/dropdown.js");

var _modal = require("./module/modal.js");

var _snack = require("./module/snack.js");

var _collapse = require("./module/collapse.js");

var raven = {};
raven.component = {
  "dropdown": _dropdown.dropdown,
  "modal": _modal.modal,
  "snackbar": _snack.snackbar,
  "collapse": _collapse.collapse
};
global.raven = raven;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./module/collapse.js":2,"./module/dropdown.js":3,"./module/modal.js":4,"./module/snack.js":5}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.collapse = void 0;

var _each = require("../../utils/module/each");

var _click = require("../../utils/module/click");

var _merge = require("../../utils/module/merge");

var _css = require("../../utils/module/css");

var collapse = function collapse(config) {
  // Variables
  var collapse = document.querySelectorAll('.collapse-content'),
      trigger = document.querySelectorAll('.collapse-trigger'); // Config

  var _OPTION = (0, _merge.merge)({
    animation: {
      name: 'ani-fadeInTop',
      origin: 'mt'
    }
  }, config);

  (0, _each.each)(trigger, function (index, el) {
    var self = el,
        parent = el.parentNode,
        parentItem = el.nextElementSibling;

    _css.css.add(parentItem, 'ani', 'ani-' + _OPTION.animation.origin);

    (0, _click.click)(el, function (e) {
      if (_css.css.has(parent, 'is-collapsible')) {
        _css.css.clean(collapse, 'is-active');

        _css.css.clean(collapse, _OPTION.animation.name);

        _css.css.add(parentItem, 'is-active');

        _css.css.add(parentItem, _OPTION.animation.name);
      } else {
        _css.css.toggle(parentItem, 'is-active');

        _css.css.toggle(parentItem, _OPTION.animation.name);
      }
    });
  });
};

exports.collapse = collapse;

},{"../../utils/module/click":6,"../../utils/module/css":7,"../../utils/module/each":8,"../../utils/module/merge":10}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dropdown = void 0;

var _each = require("../../utils/module/each");

var _click = require("../../utils/module/click");

var _merge = require("../../utils/module/merge");

var _css = require("../../utils/module/css");

var dropdown = function dropdown(config) {
  // Variable
  var selector = document.querySelectorAll('.dropdown'); // Config

  var _OPTION = (0, _merge.merge)({
    align: "rt",
    animation: 'ani-fadeInScale'
  }, config); // Seteamos la posicion en base a las propiedades top y left de css


  var setPosition = function setPosition(content, parentContent, align) {
    switch (align) {
      case 'lt':
        content.style.left = 0 + 'px';
        content.style.top = 0 + 'px';
        break;

      case 'rt':
        content.style.right = 0 + 'px';
        content.style.top = 0 + 'px';
        break;

      case 'rb':
        content.style.right = 0 + 'px';
        content.style.top = 100 + '%';
        break;

      case 'lb':
        content.style.left = 0 + 'px';
        content.style.top = 100 + '%';
        break;
    }
  };
  /*
  	Seteamos el origen de la transformacion, esto para poder 
  	tener una animacion mas acorde a cada posicion.
  */


  var setOriginTransform = function setOriginTransform(align) {
    switch (align) {
      case 'lt':
        return 'ani-lt';
        break;

      case 'rt':
        return 'ani-rt';
        break;

      case 'rb':
        return 'ani-rt';
        break;

      case 'lb':
        return 'ani-lt';
        break;
    }
  };

  (0, _each.each)(selector, function (index, el) {
    var trigger = el.querySelector('.dropdown-trigger'),
        list = el.querySelector('.dropdown-list');
    var currentAlign = el.getAttribute('data-align') ? el.getAttribute('data-align') : false;
    var align = currentAlign ? currentAlign : _OPTION.align; // Seteamos la posicion en el lugar dado

    setPosition(list, trigger, align); // Seteamos las clases para mostrar la animacion

    _css.css.add(list, 'ani-05s', setOriginTransform(align));

    (0, _click.click)(trigger, function (e) {
      // Prevenimos eventos no deseados (enlace, botones, etc)
      e.preventDefault();
      e.stopPropagation(); // let cleanCss = document.querySelectorAll('.dropdown .dropdown-list');
      // css.clean(cleanCss, 'is-active');
      // css.clean(cleanCss, _OPTION.animation);

      _css.css.toggle(list, 'is-active');

      _css.css.toggle(list, _OPTION.animation);
    });
  }); // Cerramos dropdown activos

  (0, _click.click)(document.body, function () {
    (0, _each.each)(selector, function (index, el) {
      var list = el.querySelector('.dropdown-list');

      _css.css.remove(list, 'is-active');

      _css.css.remove(list, _OPTION.animation);
    });
  });
};

exports.dropdown = dropdown;

},{"../../utils/module/click":6,"../../utils/module/css":7,"../../utils/module/each":8,"../../utils/module/merge":10}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.modal = void 0;

var _each = require("../../utils/module/each");

var _click = require("../../utils/module/click");

var _merge = require("../../utils/module/merge");

var _css = require("../../utils/module/css");

var modal = function modal(config) {
  // Variables
  var trigger = document.querySelectorAll('.modal-trigger'); // Config

  var _OPTION = (0, _merge.merge)({
    animation: 'ani-fadeInTop'
  }, config); // Creamos html para mostrar el render


  var modalRender = function modalRender(headline, content, animation) {
    var modalOuter = document.createElement('div'),
        modal = document.createElement('div'),
        modalHeadline = document.createElement('div'),
        modalContent = document.createElement('div'),
        modalClose = document.createElement('span'); // Agregamos los css correspondiente

    _css.css.add(modalOuter, 'modal-outer', 'd-flex', 'a-item-center', 'j-content-center'), _css.css.add(modal, 'modal', headline ? null : 'is-compact', 'ani', animation), _css.css.add(modalHeadline, 'modal-headline'), _css.css.add(modalContent, 'modal-content'), _css.css.add(modalClose, 'modal-close'); // Insertamos el contenido correspondiente

    modalClose.innerHTML = '<i className="fas fa-times"></i>', modalHeadline.innerHTML = headline ? "<span>".concat(headline, "</span><span class=\"modal-close\"><i class=\"fas fa-times\"></i></span>") : "<span class=\"modal-close\"><i class=\"fas fa-times\"></i></span>", modalContent.innerHTML = content; // Apilamos todo,

    modal.appendChild(modalHeadline);
    modal.appendChild(modalContent);
    modal.appendChild(modalClose);
    modalOuter.appendChild(modal); // Creamos las acciones para eliminar el modal activo

    (0, _click.click)(modal, function (e) {
      return e.stopPropagation();
    });
    (0, _click.click)(modalOuter, function () {
      return modalOuter.remove();
    }); // Creamos la accion para eliminar el modal al presionar sobre la "X"

    (0, _click.click)(modalHeadline.querySelector('.modal-close'), function (e) {
      return modalOuter.remove();
    });
    return modalOuter;
  };

  (0, _each.each)(trigger, function (index, el) {
    var body = document.body,
        hash = el.getAttribute('data-content'),
        content = document.getElementById(hash).innerHTML,
        title = el.getAttribute('data-headline');
    (0, _click.click)(el, function (e) {
      e.preventDefault();
      var modalHTML = modalRender(title ? title : '', content, _OPTION.animation),
          closeModal = modalHTML;
      body.appendChild(modalHTML);
    });
  });
};

exports.modal = modal;

},{"../../utils/module/click":6,"../../utils/module/css":7,"../../utils/module/each":8,"../../utils/module/merge":10}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.snackbar = void 0;

var _each = require("../../utils/module/each");

var _click = require("../../utils/module/click");

var _merge = require("../../utils/module/merge");

var _css = require("../../utils/module/css");

var snackbar = function snackbar(config) {
  // Variables
  var body = document.body,
      trigger = document.querySelectorAll('.snackbar-trigger'); // Config

  var _OPTION = (0, _merge.merge)({
    animation: 'ani-fadeInTop',
    dir: 'rt',
    dur: 600
  }, config);

  var snackContainer = function snackContainer(direction) {
    var container = document.createElement('div');

    _css.css.add(container, direction ? 'is-' + direction : 'is-rb', 'snack-container');

    return container;
  };

  var snackItem = function snackItem(content, color, animation) {
    var item = document.createElement('div');

    _css.css.add(item, color ? color : null, 'snack', 'ani', animation);

    item.innerHTML = content;
    setTimeout(function () {
      item.remove();
    }, _OPTION.dur);
    return item;
  };

  (0, _each.each)(trigger, function (index, el) {
    var text = el.getAttribute('data-text'),
        dir = el.getAttribute('data-dir'),
        color = el.getAttribute('data-color');
    var container = snackContainer(dir ? dir : _OPTION.dir);
    body.appendChild(container);
    (0, _click.click)(el, function (e) {
      e.preventDefault();
      container.appendChild(snackItem(text, "is-" + color, _OPTION.animation));
    });
  });
};

exports.snackbar = snackbar;

},{"../../utils/module/click":6,"../../utils/module/css":7,"../../utils/module/each":8,"../../utils/module/merge":10}],6:[function(require,module,exports){
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

},{"./helper":9}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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

},{}]},{},[1]);
