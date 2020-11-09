/*!
* karasu-dev @ v0.1.15
* Copyright 2020 © Karasu themes
* Developed by Marcelo (github.com/MarceloTLD)
* MIT License
*/
var raven = (function (exports) {
	'use strict';

	const isNode = checkElement => {
	  let check = typeof checkElement;
	  return check == 'object' ? true : false;
	};

	const click = function (nodeElement, action) {
	  let selector = isNode(nodeElement) ? nodeElement : document.querySelector(nodeElement);
	  selector.addEventListener('click', event => action(event));
	};

	const toggle = (nodeElement, even, odd) => {
	  let selector = isNode(nodeElement) ? nodeElement : document.querySelector(nodeElement),
	      control = 0;
	  selector.addEventListener('click', event => {
	    if (control == 0) {
	      even(event);
	      control = 1;
	    } else {
	      odd(event);
	      control = 0;
	    }
	  });
	};

	const clickEach = (nodeElements, action) => {
	  let selector = isNode(nodeElement) ? nodeElements : document.querySelectorAll(nodeElements);

	  for (var i = 0; i < selector.length; i++) {
	    selector[i].addEventListener('click', event => action(event));
	  }
	};

	const _ADD_CLASS_CSS = (element, ...className) => {
	  let getClass = [...className];

	  for (var i = getClass.length - 1; i >= 0; i--) {
	    element.classList.add(getClass[i]);
	  }
	};

	const _TOGGLE_CLASS_CSS = (element, className) => {
	  element.classList.toggle(className);
	};

	const _REMOVE_CLASS_CSS = (element, className) => {
	  element.classList.remove(className);
	  return className;
	};

	const _HAS_CLASS_CSS = (element, className) => {
	  const getClassName = element.getAttribute('class');

	  if (getClassName) {
	    const reg = new RegExp(className, 'g'),
	          checkCSS = reg.test(getClassName);
	    return checkCSS ? true : false;
	  }

	  return '';
	};

	const _CLEAN_ALL_CSS = (array, className) => {
	  for (var i = 0; i < array.length; i++) {
	    array[i].classList.remove(className);
	  }
	};

	const css = {
	  "add": _ADD_CLASS_CSS,
	  "remove": _REMOVE_CLASS_CSS,
	  "has": _HAS_CLASS_CSS,
	  "clean": _CLEAN_ALL_CSS,
	  "toggle": _TOGGLE_CLASS_CSS
	};

	const each = (array, callback) => {
	  for (var i = 0; i < array.length; i++) {
	    callback.call(array[i], i, array[i]);
	  }
	};

	const merge = (source, properties) => {
	  var property;

	  for (property in properties) {
	    if (properties.hasOwnProperty(property)) {
	      source[property] = properties[property];
	    }
	  }

	  return source;
	};

	const createScript = (homeURL, attributes) => {
	  let scrpt = document.createElement('script');
	  scrpt.src = `${homeURL}/feeds/posts/${attributes}`;
	  return scrpt;
	};

	const format = (data, config) => {
	  function getID(id) {
	    let getID = id.match(/post-\d{1,}/g)[0];
	    return getID.replace('post-', '');
	  }

	  function getLink(link) {
	    let getLink = link,
	        result = "";

	    for (var i = 0; i < getLink.length; i++) {
	      if (getLink[i].rel == 'alternate') {
	        result = getLink[i].href;
	      }
	    }

	    return result;
	  }

	  function cleanHTML(html) {
	    return html.replace(/<[^>]*>?/g, '');
	  }

	  function summary(content) {
	    return config.summary ? cleanHTML(content).substr(0, config.summary) : cleanHTML(content).substr(0, 100);
	  }

	  function getThumbnail(content) {
	    let temp = document.createElement('div');
	    temp.innerHTML = content;
	    let getImage = temp.querySelector('img');
	    return getImage ? getImage.getAttribute('src') : "";
	  }

	  const content = data.content ? data.content.$t : data.summary.$t;
	  return {
	    id: getID(data.id.$t),
	    title: data.title ? data.title.$t : 'No title',
	    thumbnail: data.media$thumbnail ? data.media$thumbnail.url.replace(/s\B\d{2,4}-c/, config.img ? config.img : 's200') : getThumbnail(content),
	    label: data.category ? data.category.map(el => el.term) : '',
	    link: getLink(data.link),
	    content: content,
	    summary: summary(content),
	    published: data.published.$t,
	    update: data.updated.$t
	  };
	};

	const parser = (json, html) => {
	  return html.replace(/\{\w+\}/g, value => {
	    let objName = value.replace(/{|}/g, '');
	    return json[objName];
	  });
	};

	const dropdown = config => {
	  // Variable
	  let selector = document.querySelectorAll('.dropdown'); // Config

	  const _OPTION = merge({
	    align: "rt",
	    animation: 'ani-fadeInScale'
	  }, config); // Seteamos la posicion en base a las propiedades top y left de css


	  const setPosition = function (content, parentContent, align) {
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


	  const setOriginTransform = align => {
	    switch (align) {
	      case 'lt':
	        return 'ani-lt';

	      case 'rt':
	        return 'ani-rt';

	      case 'rb':
	        return 'ani-rt';

	      case 'lb':
	        return 'ani-lt';
	    }
	  };

	  each(selector, (index, el) => {
	    let trigger = el.querySelector('.dropdown-trigger'),
	        list = el.querySelector('.dropdown-list');
	    const currentAlign = el.getAttribute('data-align') ? el.getAttribute('data-align') : false;
	    const align = currentAlign ? currentAlign : _OPTION.align; // Seteamos la posicion en el lugar dado

	    setPosition(list, trigger, align); // Seteamos las clases para mostrar la animacion

	    css.add(list, 'ani-05s', setOriginTransform(align));
	    click(trigger, e => {
	      // Prevenimos eventos no deseados (enlace, botones, etc)
	      e.preventDefault();
	      e.stopPropagation(); // let cleanCss = document.querySelectorAll('.dropdown .dropdown-list');
	      // css.clean(cleanCss, 'is-active');
	      // css.clean(cleanCss, _OPTION.animation);

	      css.toggle(list, 'is-active');
	      css.toggle(list, _OPTION.animation);
	    });
	  }); // Cerramos dropdown activos

	  click(document.body, () => {
	    each(selector, (index, el) => {
	      let list = el.querySelector('.dropdown-list');
	      css.remove(list, 'is-active');
	      css.remove(list, _OPTION.animation);
	    });
	  });
	};

	const modal = config => {
	  // Variables
	  const trigger = document.querySelectorAll('.modal-trigger'); // Config

	  const _OPTION = merge({
	    animation: 'ani-fadeInTop'
	  }, config); // Creamos html para mostrar el render


	  const modalRender = (headline, content, animation) => {
	    let modalOuter = document.createElement('div'),
	        modal = document.createElement('div'),
	        modalHeadline = document.createElement('div'),
	        modalContent = document.createElement('div'),
	        modalClose = document.createElement('span'); // Agregamos los css correspondiente

	    css.add(modalOuter, 'modal-outer', 'd-flex', 'a-item-center', 'j-content-center'), css.add(modal, 'modal', headline ? null : 'is-compact', 'ani', animation), css.add(modalHeadline, 'modal-headline'), css.add(modalContent, 'modal-content'), css.add(modalClose, 'modal-close'); // Insertamos el contenido correspondiente

	    modalClose.innerHTML = '<i className="fas fa-times"></i>', modalHeadline.innerHTML = headline ? `<span>${headline}</span><span class="modal-close"><i class="fas fa-times"></i></span>` : `<span class="modal-close"><i class="fas fa-times"></i></span>`, modalContent.innerHTML = content; // Apilamos todo,

	    modal.appendChild(modalHeadline);
	    modal.appendChild(modalContent);
	    modal.appendChild(modalClose);
	    modalOuter.appendChild(modal); // Creamos las acciones para eliminar el modal activo

	    click(modal, e => e.stopPropagation());
	    click(modalOuter, () => modalOuter.remove()); // Creamos la accion para eliminar el modal al presionar sobre la "X"

	    click(modalHeadline.querySelector('.modal-close'), e => modalOuter.remove());
	    return modalOuter;
	  };

	  each(trigger, (index, el) => {
	    let body = document.body,
	        hash = el.getAttribute('data-content'),
	        content = document.getElementById(hash).innerHTML,
	        title = el.getAttribute('data-headline');
	    click(el, e => {
	      e.preventDefault();
	      let modalHTML = modalRender(title ? title : '', content, _OPTION.animation);
	      body.appendChild(modalHTML);
	    });
	  });
	};

	const snackbar = config => {
	  // Variables
	  let body = document.body,
	      trigger = document.querySelectorAll('.snackbar-trigger'); // Config

	  const _OPTION = merge({
	    animation: 'ani-fadeInTop',
	    dir: 'rt',
	    dur: 600
	  }, config);

	  const snackContainer = direction => {
	    let container = document.createElement('div');
	    css.add(container, direction ? 'is-' + direction : 'is-rb', 'snack-container');
	    return container;
	  };

	  const snackItem = (content, color, animation) => {
	    let item = document.createElement('div');
	    css.add(item, color ? color : null, 'snack', 'ani', animation);
	    item.innerHTML = content;
	    setTimeout(() => {
	      item.remove();
	    }, _OPTION.dur);
	    return item;
	  };

	  each(trigger, (index, el) => {
	    let text = el.getAttribute('data-text'),
	        dir = el.getAttribute('data-dir'),
	        color = el.getAttribute('data-color');
	    let container = snackContainer(dir ? dir : _OPTION.dir);
	    body.appendChild(container);
	    click(el, e => {
	      e.preventDefault();
	      container.appendChild(snackItem(text, "is-" + color, _OPTION.animation));
	    });
	  });
	};

	const collapse = config => {
	  // Variables
	  let collapse = document.querySelectorAll('.collapse-content'),
	      trigger = document.querySelectorAll('.collapse-trigger'); // Config

	  const _OPTION = merge({
	    animation: {
	      name: 'ani-fadeInTop',
	      origin: 'mt'
	    }
	  }, config);

	  each(trigger, (index, el) => {
	    let parent = el.parentNode,
	        parentItem = el.nextElementSibling;
	    css.add(parentItem, 'ani', 'ani-' + _OPTION.animation.origin);
	    click(el, e => {
	      if (css.has(parent, 'is-collapsible')) {
	        css.clean(collapse, 'is-active');
	        css.clean(collapse, _OPTION.animation.name);
	        css.add(parentItem, 'is-active');
	        css.add(parentItem, _OPTION.animation.name);
	      } else {
	        css.toggle(parentItem, 'is-active');
	        css.toggle(parentItem, _OPTION.animation.name);
	      }
	    });
	  });
	};

	const utils = {
	  "click": click,
	  "toggle": toggle,
	  "clickEach": clickEach,
	  "each": each,
	  "merge": merge,
	  "css": css,
	  "blogger": {
	    "createScript": createScript,
	    "format": format,
	    "parser": parser
	  }
	}; // Components module

	const components = {
	  "dropdown": dropdown,
	  "modal": modal,
	  "snackbar": snackbar,
	  "collapse": collapse
	};

	exports.components = components;
	exports.utils = utils;

	Object.defineProperty(exports, '__esModule', { value: true });

	return exports;

}({}));

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2FyYXN1LWRldi5qcyIsInNvdXJjZXMiOlsic291cmNlL2pzL3V0aWxzL21vZHVsZS9oZWxwZXIuanMiLCJzb3VyY2UvanMvdXRpbHMvbW9kdWxlL2NsaWNrLmpzIiwic291cmNlL2pzL3V0aWxzL21vZHVsZS9jc3MuanMiLCJzb3VyY2UvanMvdXRpbHMvbW9kdWxlL2VhY2guanMiLCJzb3VyY2UvanMvdXRpbHMvbW9kdWxlL21lcmdlLmpzIiwic291cmNlL2pzL3V0aWxzL21vZHVsZS9jcmVhdGVTY3JpcHQuanMiLCJzb3VyY2UvanMvdXRpbHMvbW9kdWxlL2Zvcm1hdC5qcyIsInNvdXJjZS9qcy91dGlscy9tb2R1bGUvcGFyc2VyLmpzIiwic291cmNlL2pzL2NvbXBvbmVudHMvbW9kdWxlL2Ryb3Bkb3duLmpzIiwic291cmNlL2pzL2NvbXBvbmVudHMvbW9kdWxlL21vZGFsLmpzIiwic291cmNlL2pzL2NvbXBvbmVudHMvbW9kdWxlL3NuYWNrLmpzIiwic291cmNlL2pzL2NvbXBvbmVudHMvbW9kdWxlL2NvbGxhcHNlLmpzIiwic291cmNlL2pzL2thcmFzdS1kZXYuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IGlzTm9kZSA9IChjaGVja0VsZW1lbnQpID0+IHtcblx0bGV0IGNoZWNrID0gdHlwZW9mIGNoZWNrRWxlbWVudDtcblx0cmV0dXJuIGNoZWNrID09ICdvYmplY3QnID8gdHJ1ZSA6IGZhbHNlXG59XG4iLCJpbXBvcnQgeyBpc05vZGUgfSBmcm9tICcuL2hlbHBlcic7XG5cbmNvbnN0IGNsaWNrID0gIGZ1bmN0aW9uIChub2RlRWxlbWVudCwgYWN0aW9uKSB7XG5cdGxldCBzZWxlY3RvciA9IGlzTm9kZShub2RlRWxlbWVudCkgPyBub2RlRWxlbWVudCA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Iobm9kZUVsZW1lbnQpO1xuXHRzZWxlY3Rvci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50PT5hY3Rpb24oZXZlbnQpKTtcbn1cblxuY29uc3QgdG9nZ2xlID0gKG5vZGVFbGVtZW50LCBldmVuLCBvZGQpPT57XG5cdGxldCBzZWxlY3RvciA9IGlzTm9kZShub2RlRWxlbWVudCkgPyBub2RlRWxlbWVudCA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Iobm9kZUVsZW1lbnQpLFxuXHRcdGNvbnRyb2wgPSAwO1xuXG5cdFx0c2VsZWN0b3IuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudD0+e1xuXHRcdFx0aWYgKGNvbnRyb2w9PTApIHtcblx0XHRcdFx0ZXZlbihldmVudCk7XG5cdFx0XHRcdGNvbnRyb2w9MTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG9kZChldmVudCk7XG5cdFx0XHRcdGNvbnRyb2w9MDtcblx0XHRcdH1cblx0XHR9KVxufVxuXG5jb25zdCBjbGlja0VhY2ggPSAobm9kZUVsZW1lbnRzLCBhY3Rpb24pPT57XG5cdGxldCBzZWxlY3RvciA9IGlzTm9kZShub2RlRWxlbWVudCkgPyBub2RlRWxlbWVudHMgOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKG5vZGVFbGVtZW50cyk7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgc2VsZWN0b3IubGVuZ3RoOyBpKyspIHtcblx0XHRzZWxlY3RvcltpXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50PT5hY3Rpb24oZXZlbnQpKTtcblx0fVxufVxuXG5leHBvcnQgeyBjbGljaywgdG9nZ2xlLCBjbGlja0VhY2ggfSIsImNvbnN0IF9BRERfQ0xBU1NfQ1NTID0gKGVsZW1lbnQsIC4uLmNsYXNzTmFtZSkgPT4ge1xuXHRsZXQgZ2V0Q2xhc3MgPSBbLi4uY2xhc3NOYW1lXTtcblx0Zm9yICh2YXIgaSA9IGdldENsYXNzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG5cdFx0ZWxlbWVudC5jbGFzc0xpc3QuYWRkKGdldENsYXNzW2ldKTtcblx0fVxuXHRcbn1cblxuY29uc3QgX1RPR0dMRV9DTEFTU19DU1MgPSAoZWxlbWVudCwgY2xhc3NOYW1lKSA9PiB7XG5cdGVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZShjbGFzc05hbWUpO1xufVxuXG5jb25zdCBfUkVNT1ZFX0NMQVNTX0NTUyA9IChlbGVtZW50LCBjbGFzc05hbWUpID0+IHtcblx0ZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XG5cdHJldHVybiBjbGFzc05hbWVcbn1cblxuY29uc3QgX0hBU19DTEFTU19DU1MgPSAoZWxlbWVudCwgY2xhc3NOYW1lKSA9PiB7XG5cdGNvbnN0IGdldENsYXNzTmFtZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdjbGFzcycpO1xuXG5cdGlmIChnZXRDbGFzc05hbWUpIHtcblx0XHRjb25zdCByZWcgPSBuZXcgUmVnRXhwKGNsYXNzTmFtZSwgJ2cnKSxcblx0XHRcdGNoZWNrQ1NTID0gcmVnLnRlc3QoZ2V0Q2xhc3NOYW1lKTtcblxuXHRcdHJldHVybiBjaGVja0NTUyA/IHRydWUgOiBmYWxzZTtcblx0fVxuXG5cdHJldHVybiAnJ1xufVxuXG5jb25zdCBfQ0xFQU5fQUxMX0NTUyA9IChhcnJheSwgY2xhc3NOYW1lKT0+e1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XG5cdFx0YXJyYXlbaV0uY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpXG5cdH1cbn1cblxuZXhwb3J0IGNvbnN0IGNzcyA9IHtcblx0XCJhZGRcIjogX0FERF9DTEFTU19DU1MsXG5cdFwicmVtb3ZlXCI6IF9SRU1PVkVfQ0xBU1NfQ1NTLFxuXHRcImhhc1wiOiBfSEFTX0NMQVNTX0NTUyxcblx0XCJjbGVhblwiOiBfQ0xFQU5fQUxMX0NTUyxcblx0XCJ0b2dnbGVcIjogX1RPR0dMRV9DTEFTU19DU1Ncbn07IiwiZXhwb3J0IGNvbnN0IGVhY2ggPSAoYXJyYXksIGNhbGxiYWNrKT0+e1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XG5cdFx0Y2FsbGJhY2suY2FsbChhcnJheVtpXSwgaSwgYXJyYXlbaV0pXG5cdH1cbn0iLCJleHBvcnQgY29uc3QgbWVyZ2UgPSAoc291cmNlLCBwcm9wZXJ0aWVzKSA9PiB7XG5cdHZhciBwcm9wZXJ0eTtcblx0Zm9yIChwcm9wZXJ0eSBpbiBwcm9wZXJ0aWVzKSB7XG5cdFx0aWYgKHByb3BlcnRpZXMuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKSB7XG5cdFx0XHRzb3VyY2VbcHJvcGVydHldID0gcHJvcGVydGllc1twcm9wZXJ0eV07XG5cdFx0fVxuXHR9XG5cdHJldHVybiBzb3VyY2U7XG59IiwiY29uc3QgY3JlYXRlU2NyaXB0ID0gKGhvbWVVUkwsIGF0dHJpYnV0ZXMpID0+IHtcblxuXHRsZXQgc2NycHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcblx0c2NycHQuc3JjID0gYCR7aG9tZVVSTH0vZmVlZHMvcG9zdHMvJHthdHRyaWJ1dGVzfWA7XG5cblx0cmV0dXJuIHNjcnB0O1xuXG59XG5cbmV4cG9ydCB7IGNyZWF0ZVNjcmlwdCB9IiwiY29uc3QgZm9ybWF0ID0gKGRhdGEsIGNvbmZpZykgPT4ge1xuXG5cdGZ1bmN0aW9uIGdldElEKGlkKSB7XG5cdFx0bGV0IGdldElEID0gaWQubWF0Y2goL3Bvc3QtXFxkezEsfS9nKVswXTtcblx0XHRyZXR1cm4gZ2V0SUQucmVwbGFjZSgncG9zdC0nLCAnJyk7XG5cdH1cblxuXHRmdW5jdGlvbiBnZXRMaW5rKGxpbmspIHtcblx0XHRsZXQgZ2V0TGluayA9IGxpbmssXG5cdFx0XHRyZXN1bHQgPSBcIlwiO1xuXHRcdFxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgZ2V0TGluay5sZW5ndGg7IGkrKykge1xuXHRcdFx0aWYgKGdldExpbmtbaV0ucmVsID09ICdhbHRlcm5hdGUnKSB7XG5cdFx0XHRcdHJlc3VsdCA9IGdldExpbmtbaV0uaHJlZjtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9XG5cblx0ZnVuY3Rpb24gY2xlYW5IVE1MIChodG1sKSB7XG5cdFx0cmV0dXJuIGh0bWwucmVwbGFjZSgvPFtePl0qPj8vZywgJycpXG5cdH1cblxuXHRmdW5jdGlvbiBzdW1tYXJ5IChjb250ZW50KSB7XG5cdFx0cmV0dXJuIGNvbmZpZy5zdW1tYXJ5ID8gY2xlYW5IVE1MKGNvbnRlbnQpLnN1YnN0cigwLCBjb25maWcuc3VtbWFyeSkgOiBjbGVhbkhUTUwoY29udGVudCkuc3Vic3RyKDAsIDEwMClcblx0fVxuXG5cdGZ1bmN0aW9uIGdldFRodW1ibmFpbCAoY29udGVudCkge1xuXHRcdGxldCB0ZW1wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdFx0dGVtcC5pbm5lckhUTUw9Y29udGVudDtcblxuXHRcdGxldCBnZXRJbWFnZSA9IHRlbXAucXVlcnlTZWxlY3RvcignaW1nJyk7XG5cblx0XHRyZXR1cm4gZ2V0SW1hZ2UgPyBnZXRJbWFnZS5nZXRBdHRyaWJ1dGUoJ3NyYycpIDogXCJcIjtcblx0fVxuXG5cdGNvbnN0IGNvbnRlbnQgPSBkYXRhLmNvbnRlbnQgPyBkYXRhLmNvbnRlbnQuJHQgOiBkYXRhLnN1bW1hcnkuJHQ7XG5cdFxuXHRyZXR1cm4ge1xuXHRcdGlkOiBnZXRJRChkYXRhLmlkLiR0KSxcblx0XHR0aXRsZTogZGF0YS50aXRsZSA/IGRhdGEudGl0bGUuJHQgOiAnTm8gdGl0bGUnLFxuXHRcdHRodW1ibmFpbDogZGF0YS5tZWRpYSR0aHVtYm5haWwgPyBkYXRhLm1lZGlhJHRodW1ibmFpbC51cmwucmVwbGFjZSgvc1xcQlxcZHsyLDR9LWMvLCBjb25maWcuaW1nID8gY29uZmlnLmltZyA6ICdzMjAwJykgOiBnZXRUaHVtYm5haWwoY29udGVudCksXG5cdFx0bGFiZWw6IGRhdGEuY2F0ZWdvcnkgPyBkYXRhLmNhdGVnb3J5Lm1hcChlbD0+ZWwudGVybSkgOiAnJyxcblx0XHRsaW5rOiBnZXRMaW5rKGRhdGEubGluayksXG5cdFx0Y29udGVudDogY29udGVudCxcblx0XHRzdW1tYXJ5OiBzdW1tYXJ5KGNvbnRlbnQpLFxuXHRcdHB1Ymxpc2hlZDogZGF0YS5wdWJsaXNoZWQuJHQsXG5cdFx0dXBkYXRlOiBkYXRhLnVwZGF0ZWQuJHRcblx0fVxufVxuXG5leHBvcnQgeyBmb3JtYXQgfSIsImNvbnN0IHBhcnNlciA9IChqc29uLCBodG1sKSA9PiB7XG5cdHJldHVybiBodG1sLnJlcGxhY2UoL1xce1xcdytcXH0vZywgdmFsdWU9Pntcblx0XHRsZXQgb2JqTmFtZSA9IHZhbHVlLnJlcGxhY2UoL3t8fS9nLCAnJyk7XG5cdFx0cmV0dXJuIGpzb25bb2JqTmFtZV07XG5cdH0pXG59XG5cbmV4cG9ydCB7IHBhcnNlciB9IiwiaW1wb3J0IHsgZWFjaCB9IGZyb20gJy4uLy4uL3V0aWxzL21vZHVsZS9lYWNoJztcbmltcG9ydCB7IGNsaWNrIH0gZnJvbSAnLi4vLi4vdXRpbHMvbW9kdWxlL2NsaWNrJztcbmltcG9ydCB7IG1lcmdlIH0gZnJvbSAnLi4vLi4vdXRpbHMvbW9kdWxlL21lcmdlJztcbmltcG9ydCB7IGNzcyB9IGZyb20gJy4uLy4uL3V0aWxzL21vZHVsZS9jc3MnO1xuXG5cbmV4cG9ydCBjb25zdCBkcm9wZG93biA9IChjb25maWcpID0+IHtcblx0Ly8gVmFyaWFibGVcblx0bGV0IHNlbGVjdG9yID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmRyb3Bkb3duJyk7XG5cblx0Ly8gQ29uZmlnXG5cdGNvbnN0IF9PUFRJT04gPSBtZXJnZSh7XG5cdFx0YWxpZ246IFwicnRcIixcblx0XHRhbmltYXRpb246ICdhbmktZmFkZUluU2NhbGUnXG5cdH0sIGNvbmZpZyk7XG5cblxuXHQvLyBTZXRlYW1vcyBsYSBwb3NpY2lvbiBlbiBiYXNlIGEgbGFzIHByb3BpZWRhZGVzIHRvcCB5IGxlZnQgZGUgY3NzXG5cdGNvbnN0IHNldFBvc2l0aW9uID0gZnVuY3Rpb24gKGNvbnRlbnQsIHBhcmVudENvbnRlbnQsIGFsaWduKSB7XG5cblx0XHRzd2l0Y2goYWxpZ24pIHtcblx0XHRcdGNhc2UgJ2x0Jzpcblx0XHRcdFx0Y29udGVudC5zdHlsZS5sZWZ0ID0gMCArICdweCc7XG5cdFx0XHRcdGNvbnRlbnQuc3R5bGUudG9wID0gMCArICdweCc7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAncnQnOlxuXHRcdFx0XHRjb250ZW50LnN0eWxlLnJpZ2h0ID0gMCArICdweCc7XG5cdFx0XHRcdGNvbnRlbnQuc3R5bGUudG9wID0gMCArICdweCc7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAncmInOlxuXHRcdFx0XHRjb250ZW50LnN0eWxlLnJpZ2h0ID0gMCArICdweCc7XG5cdFx0XHRcdGNvbnRlbnQuc3R5bGUudG9wID0gMTAwICsgJyUnO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgJ2xiJzpcblx0XHRcdFx0Y29udGVudC5zdHlsZS5sZWZ0ID0gMCArICdweCc7XG5cdFx0XHRcdGNvbnRlbnQuc3R5bGUudG9wID0gMTAwICsgJyUnO1xuXHRcdFx0XHRicmVhaztcblx0XHR9XG5cblx0fVxuXG5cblx0Lypcblx0XHRTZXRlYW1vcyBlbCBvcmlnZW4gZGUgbGEgdHJhbnNmb3JtYWNpb24sIGVzdG8gcGFyYSBwb2RlciBcblx0XHR0ZW5lciB1bmEgYW5pbWFjaW9uIG1hcyBhY29yZGUgYSBjYWRhIHBvc2ljaW9uLlxuXHQqL1xuXG5cdGNvbnN0IHNldE9yaWdpblRyYW5zZm9ybSA9IChhbGlnbikgPT4ge1xuXHRcdHN3aXRjaCAoYWxpZ24pIHtcblx0XHRcdGNhc2UgJ2x0Jzpcblx0XHRcdFx0cmV0dXJuICdhbmktbHQnO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgJ3J0Jzpcblx0XHRcdFx0cmV0dXJuICdhbmktcnQnO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgJ3JiJzpcblx0XHRcdFx0cmV0dXJuICdhbmktcnQnO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgJ2xiJzpcblx0XHRcdFx0cmV0dXJuICdhbmktbHQnO1xuXHRcdFx0XHRicmVhaztcblx0XHR9XG5cdH1cblxuXG5cdGVhY2goc2VsZWN0b3IsIChpbmRleCwgZWwpID0+IHtcblx0XHRsZXQgdHJpZ2dlciA9IGVsLnF1ZXJ5U2VsZWN0b3IoJy5kcm9wZG93bi10cmlnZ2VyJyksXG5cdFx0XHRsaXN0ID0gZWwucXVlcnlTZWxlY3RvcignLmRyb3Bkb3duLWxpc3QnKTtcblxuXHRcdGNvbnN0IGN1cnJlbnRBbGlnbiA9IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1hbGlnbicpID8gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLWFsaWduJykgOiBmYWxzZTtcblx0XHRjb25zdCBhbGlnbiA9IGN1cnJlbnRBbGlnbiA/IGN1cnJlbnRBbGlnbiA6IF9PUFRJT04uYWxpZ247XG5cdFx0XG5cdFx0Ly8gU2V0ZWFtb3MgbGEgcG9zaWNpb24gZW4gZWwgbHVnYXIgZGFkb1xuXHRcdHNldFBvc2l0aW9uKGxpc3QsIHRyaWdnZXIsIGFsaWduKTtcblxuXHRcdC8vIFNldGVhbW9zIGxhcyBjbGFzZXMgcGFyYSBtb3N0cmFyIGxhIGFuaW1hY2lvblxuXHRcdGNzcy5hZGQobGlzdCwgJ2FuaS0wNXMnLCBzZXRPcmlnaW5UcmFuc2Zvcm0oYWxpZ24pKTtcblxuXHRcdGNsaWNrKHRyaWdnZXIsIChlKSA9PiB7XG5cdFx0XHQvLyBQcmV2ZW5pbW9zIGV2ZW50b3Mgbm8gZGVzZWFkb3MgKGVubGFjZSwgYm90b25lcywgZXRjKVxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblxuXHRcdFx0Ly8gbGV0IGNsZWFuQ3NzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmRyb3Bkb3duIC5kcm9wZG93bi1saXN0Jyk7XG5cblx0XHRcdC8vIGNzcy5jbGVhbihjbGVhbkNzcywgJ2lzLWFjdGl2ZScpO1xuXHRcdFx0Ly8gY3NzLmNsZWFuKGNsZWFuQ3NzLCBfT1BUSU9OLmFuaW1hdGlvbik7XG5cblx0XHRcdGNzcy50b2dnbGUobGlzdCwgJ2lzLWFjdGl2ZScpO1xuXHRcdFx0Y3NzLnRvZ2dsZShsaXN0LCBfT1BUSU9OLmFuaW1hdGlvbik7XG5cblx0XHR9KVxuXHR9KTtcblxuXHQvLyBDZXJyYW1vcyBkcm9wZG93biBhY3Rpdm9zXG5cblx0Y2xpY2soZG9jdW1lbnQuYm9keSwgKCk9Pntcblx0XHRcblx0XHRlYWNoKHNlbGVjdG9yLCAoaW5kZXgsIGVsKSA9PiB7XG5cdFx0XHRsZXQgbGlzdCA9IGVsLnF1ZXJ5U2VsZWN0b3IoJy5kcm9wZG93bi1saXN0Jyk7XG5cdFx0XHRjc3MucmVtb3ZlKGxpc3QsICdpcy1hY3RpdmUnKTtcblx0XHRcdGNzcy5yZW1vdmUobGlzdCwgX09QVElPTi5hbmltYXRpb24pO1xuXHRcdH0pXG5cdFxuXHR9KTtcblxufVxuIiwiaW1wb3J0IHsgZWFjaCB9IGZyb20gJy4uLy4uL3V0aWxzL21vZHVsZS9lYWNoJztcbmltcG9ydCB7IGNsaWNrIH0gZnJvbSAnLi4vLi4vdXRpbHMvbW9kdWxlL2NsaWNrJztcbmltcG9ydCB7IG1lcmdlIH0gZnJvbSAnLi4vLi4vdXRpbHMvbW9kdWxlL21lcmdlJztcbmltcG9ydCB7IGNzcyB9IGZyb20gJy4uLy4uL3V0aWxzL21vZHVsZS9jc3MnO1xuXG5cbmV4cG9ydCBjb25zdCBtb2RhbCA9IChjb25maWcpID0+IHtcblxuXHQvLyBWYXJpYWJsZXNcblx0Y29uc3QgdHJpZ2dlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5tb2RhbC10cmlnZ2VyJyk7XG5cblx0Ly8gQ29uZmlnXG5cdGNvbnN0IF9PUFRJT04gPSBtZXJnZSh7XG5cdFx0YW5pbWF0aW9uOiAnYW5pLWZhZGVJblRvcCdcblx0fSwgY29uZmlnKTtcblxuXHQvLyBDcmVhbW9zIGh0bWwgcGFyYSBtb3N0cmFyIGVsIHJlbmRlclxuXHRjb25zdCBtb2RhbFJlbmRlciA9IChoZWFkbGluZSwgY29udGVudCwgYW5pbWF0aW9uKSA9PiB7XG5cblx0XHRsZXQgbW9kYWxPdXRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxuXHRcdFx0bW9kYWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSwgXG5cdFx0XHRtb2RhbEhlYWRsaW5lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksXG5cdFx0XHRtb2RhbENvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcblx0XHRcdG1vZGFsQ2xvc2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG5cblx0XHQvLyBBZ3JlZ2Ftb3MgbG9zIGNzcyBjb3JyZXNwb25kaWVudGVcblx0XHRjc3MuYWRkKG1vZGFsT3V0ZXIsICdtb2RhbC1vdXRlcicsICdkLWZsZXgnLCAnYS1pdGVtLWNlbnRlcicsICdqLWNvbnRlbnQtY2VudGVyJyksXG5cdFx0Y3NzLmFkZChtb2RhbCwgJ21vZGFsJywgKGhlYWRsaW5lID8gbnVsbCA6ICdpcy1jb21wYWN0JyksICdhbmknLCBhbmltYXRpb24pLFxuXHRcdGNzcy5hZGQobW9kYWxIZWFkbGluZSwgJ21vZGFsLWhlYWRsaW5lJyksXG5cdFx0Y3NzLmFkZChtb2RhbENvbnRlbnQsICdtb2RhbC1jb250ZW50JyksXG5cdFx0Y3NzLmFkZChtb2RhbENsb3NlLCAnbW9kYWwtY2xvc2UnKTtcblxuXHRcdC8vIEluc2VydGFtb3MgZWwgY29udGVuaWRvIGNvcnJlc3BvbmRpZW50ZVxuXHRcdG1vZGFsQ2xvc2UuaW5uZXJIVE1MID0gJzxpIGNsYXNzTmFtZT1cImZhcyBmYS10aW1lc1wiPjwvaT4nLFxuXHRcdG1vZGFsSGVhZGxpbmUuaW5uZXJIVE1MID0gKGhlYWRsaW5lID8gYDxzcGFuPiR7aGVhZGxpbmV9PC9zcGFuPjxzcGFuIGNsYXNzPVwibW9kYWwtY2xvc2VcIj48aSBjbGFzcz1cImZhcyBmYS10aW1lc1wiPjwvaT48L3NwYW4+YCA6IGA8c3BhbiBjbGFzcz1cIm1vZGFsLWNsb3NlXCI+PGkgY2xhc3M9XCJmYXMgZmEtdGltZXNcIj48L2k+PC9zcGFuPmApLFxuXHRcdG1vZGFsQ29udGVudC5pbm5lckhUTUwgPSBjb250ZW50O1xuXG5cdFx0Ly8gQXBpbGFtb3MgdG9kbyxcblx0XHRtb2RhbC5hcHBlbmRDaGlsZChtb2RhbEhlYWRsaW5lKTtcblx0XHRtb2RhbC5hcHBlbmRDaGlsZChtb2RhbENvbnRlbnQpO1xuXHRcdG1vZGFsLmFwcGVuZENoaWxkKG1vZGFsQ2xvc2UpO1xuXHRcdG1vZGFsT3V0ZXIuYXBwZW5kQ2hpbGQobW9kYWwpO1xuXG5cdFx0Ly8gQ3JlYW1vcyBsYXMgYWNjaW9uZXMgcGFyYSBlbGltaW5hciBlbCBtb2RhbCBhY3Rpdm9cblx0XHRjbGljayhtb2RhbCwgKGUpPT5lLnN0b3BQcm9wYWdhdGlvbigpKTtcblx0XHRjbGljayhtb2RhbE91dGVyLCAoKT0+bW9kYWxPdXRlci5yZW1vdmUoKSk7XG5cblx0XHQvLyBDcmVhbW9zIGxhIGFjY2lvbiBwYXJhIGVsaW1pbmFyIGVsIG1vZGFsIGFsIHByZXNpb25hciBzb2JyZSBsYSBcIlhcIlxuXHRcdGNsaWNrKG1vZGFsSGVhZGxpbmUucXVlcnlTZWxlY3RvcignLm1vZGFsLWNsb3NlJyksIChlKT0+bW9kYWxPdXRlci5yZW1vdmUoKSk7XG5cblx0XHRyZXR1cm4gbW9kYWxPdXRlcjtcblxuXHR9XG5cblx0ZWFjaCh0cmlnZ2VyLCAoaW5kZXgsIGVsKSA9PiB7XG5cblx0XHRsZXQgYm9keSA9IGRvY3VtZW50LmJvZHksXG5cdFx0XHRoYXNoID0gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLWNvbnRlbnQnKSxcblx0XHRcdGNvbnRlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChoYXNoKS5pbm5lckhUTUwsXG5cdFx0XHR0aXRsZSA9IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1oZWFkbGluZScpO1xuXG5cdFx0Y2xpY2soZWwsIChlKSA9PiB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdGxldCBtb2RhbEhUTUwgPSBtb2RhbFJlbmRlcih0aXRsZSA/IHRpdGxlIDogJycsIGNvbnRlbnQsIF9PUFRJT04uYW5pbWF0aW9uKSxcblx0XHRcdFx0Y2xvc2VNb2RhbCA9IG1vZGFsSFRNTDtcblxuXHRcdFx0Ym9keS5hcHBlbmRDaGlsZChtb2RhbEhUTUwpO1xuXG5cdFx0fSlcblxuXHR9KTtcblxufTsiLCJpbXBvcnQgeyBlYWNoIH0gZnJvbSAnLi4vLi4vdXRpbHMvbW9kdWxlL2VhY2gnO1xuaW1wb3J0IHsgY2xpY2sgfSBmcm9tICcuLi8uLi91dGlscy9tb2R1bGUvY2xpY2snO1xuaW1wb3J0IHsgbWVyZ2UgfSBmcm9tICcuLi8uLi91dGlscy9tb2R1bGUvbWVyZ2UnO1xuaW1wb3J0IHsgY3NzIH0gZnJvbSAnLi4vLi4vdXRpbHMvbW9kdWxlL2Nzcyc7XG5cbmV4cG9ydCBjb25zdCBzbmFja2JhciA9IChjb25maWcpID0+IHtcblxuXHQvLyBWYXJpYWJsZXNcblx0bGV0IGJvZHkgPSBkb2N1bWVudC5ib2R5LFxuXHRcdHRyaWdnZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc25hY2tiYXItdHJpZ2dlcicpO1xuXG5cdC8vIENvbmZpZ1xuXHRjb25zdCBfT1BUSU9OID0gbWVyZ2Uoe1xuXHRcdGFuaW1hdGlvbjogJ2FuaS1mYWRlSW5Ub3AnLFxuXHRcdGRpcjogJ3J0Jyxcblx0XHRkdXI6IDYwMFxuXHR9LCBjb25maWcpO1xuXG5cblx0Y29uc3Qgc25hY2tDb250YWluZXIgPSAoZGlyZWN0aW9uKSA9PiB7XG5cdFx0bGV0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdGNzcy5hZGQoY29udGFpbmVyLCBkaXJlY3Rpb24gPyAnaXMtJytkaXJlY3Rpb24gOiAnaXMtcmInLCAnc25hY2stY29udGFpbmVyJyk7XG5cdFx0cmV0dXJuIGNvbnRhaW5lcjtcblx0fVxuXG5cdGNvbnN0IHNuYWNrSXRlbSA9IChjb250ZW50LCBjb2xvciwgYW5pbWF0aW9uKSA9PiB7XG5cblx0XHRsZXQgaXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdGNzcy5hZGQoaXRlbSwgY29sb3IgPyBjb2xvciA6IG51bGwsICdzbmFjaycsICdhbmknLCBhbmltYXRpb24pO1xuXHRcdGl0ZW0uaW5uZXJIVE1MID0gY29udGVudDtcblxuXHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0aXRlbS5yZW1vdmUoKTtcblx0XHR9LCBfT1BUSU9OLmR1cilcblxuXHRcdHJldHVybiBpdGVtO1xuXHR9XG5cblx0ZWFjaCh0cmlnZ2VyLCAoaW5kZXgsIGVsKSA9PiB7XG5cdFx0bGV0IHRleHQgPSBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGV4dCcpLFxuXHRcdFx0ZGlyID0gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLWRpcicpLFxuXHRcdFx0Y29sb3IgPSBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtY29sb3InKTtcblxuXHRcdGxldCBjb250YWluZXIgPSBzbmFja0NvbnRhaW5lcihkaXIgPyBkaXIgOiBfT1BUSU9OLmRpcik7XG5cdFx0Ym9keS5hcHBlbmRDaGlsZChjb250YWluZXIpO1xuXG5cdFx0Y2xpY2soZWwsIChlKSA9PiB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdGNvbnRhaW5lci5hcHBlbmRDaGlsZChzbmFja0l0ZW0odGV4dCwgXCJpcy1cIiArIGNvbG9yLCBfT1BUSU9OLmFuaW1hdGlvbikpXG5cdFx0fSlcblx0fSk7XG5cbn0iLCJpbXBvcnQgeyBlYWNoIH0gZnJvbSAnLi4vLi4vdXRpbHMvbW9kdWxlL2VhY2gnO1xuaW1wb3J0IHsgY2xpY2sgfSBmcm9tICcuLi8uLi91dGlscy9tb2R1bGUvY2xpY2snO1xuaW1wb3J0IHsgbWVyZ2UgfSBmcm9tICcuLi8uLi91dGlscy9tb2R1bGUvbWVyZ2UnO1xuaW1wb3J0IHsgY3NzIH0gZnJvbSAnLi4vLi4vdXRpbHMvbW9kdWxlL2Nzcyc7XG5cbmV4cG9ydCBjb25zdCBjb2xsYXBzZSA9IChjb25maWcpID0+IHtcblx0Ly8gVmFyaWFibGVzXG5cdGxldCBjb2xsYXBzZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jb2xsYXBzZS1jb250ZW50JyksXG5cdFx0dHJpZ2dlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jb2xsYXBzZS10cmlnZ2VyJyk7XG5cblx0Ly8gQ29uZmlnXG5cdGNvbnN0IF9PUFRJT04gPSBtZXJnZSh7XG5cdFx0YW5pbWF0aW9uOiB7XG5cdFx0XHRuYW1lOiAnYW5pLWZhZGVJblRvcCcsXG5cdFx0XHRvcmlnaW46ICdtdCdcblx0XHR9LFxuXHR9LCBjb25maWcpO1xuXG5cdGVhY2godHJpZ2dlciwgKGluZGV4LCBlbCkgPT4ge1xuXHRcdGxldCBzZWxmID0gZWwsXG5cdFx0XHRwYXJlbnQgPSBlbC5wYXJlbnROb2RlLFxuXHRcdFx0cGFyZW50SXRlbSA9IGVsLm5leHRFbGVtZW50U2libGluZztcblx0XHRcblx0XHRjc3MuYWRkKHBhcmVudEl0ZW0sICdhbmknLCAnYW5pLScgKyBfT1BUSU9OLmFuaW1hdGlvbi5vcmlnaW4pO1xuXG5cdFx0Y2xpY2soZWwsIChlKSA9PiB7XG5cblx0XHRcdGlmIChjc3MuaGFzKHBhcmVudCwgJ2lzLWNvbGxhcHNpYmxlJykpIHtcblx0XHRcdFx0Y3NzLmNsZWFuKGNvbGxhcHNlLCAnaXMtYWN0aXZlJyk7XG5cdFx0XHRcdGNzcy5jbGVhbihjb2xsYXBzZSwgX09QVElPTi5hbmltYXRpb24ubmFtZSk7XG5cdFx0XHRcdGNzcy5hZGQocGFyZW50SXRlbSwgJ2lzLWFjdGl2ZScpO1xuXHRcdFx0XHRjc3MuYWRkKHBhcmVudEl0ZW0sIF9PUFRJT04uYW5pbWF0aW9uLm5hbWUpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y3NzLnRvZ2dsZShwYXJlbnRJdGVtLCAnaXMtYWN0aXZlJyk7XG5cdFx0XHRcdGNzcy50b2dnbGUocGFyZW50SXRlbSwgX09QVElPTi5hbmltYXRpb24ubmFtZSk7XG5cdFx0XHR9XG5cdFx0fSlcblx0fSk7XG59IiwiaW1wb3J0IHsgY2xpY2ssIHRvZ2dsZSwgY2xpY2tFYWNoIH0gZnJvbSAnLi91dGlscy9tb2R1bGUvY2xpY2snO1xuaW1wb3J0IHsgY3NzIH0gZnJvbSAnLi91dGlscy9tb2R1bGUvY3NzJztcbmltcG9ydCB7IGVhY2ggfSBmcm9tICcuL3V0aWxzL21vZHVsZS9lYWNoJztcbmltcG9ydCB7IG1lcmdlIH0gZnJvbSAnLi91dGlscy9tb2R1bGUvbWVyZ2UnO1xuaW1wb3J0IHsgY3JlYXRlU2NyaXB0IH0gZnJvbSAnLi91dGlscy9tb2R1bGUvY3JlYXRlU2NyaXB0JztcbmltcG9ydCB7IGZvcm1hdCB9IGZyb20gJy4vdXRpbHMvbW9kdWxlL2Zvcm1hdCc7XG5pbXBvcnQgeyBwYXJzZXIgfSBmcm9tICcuL3V0aWxzL21vZHVsZS9wYXJzZXInO1xuaW1wb3J0IHsgZHJvcGRvd24gfSBmcm9tICcuL2NvbXBvbmVudHMvbW9kdWxlL2Ryb3Bkb3duLmpzJztcbmltcG9ydCB7IG1vZGFsIH0gZnJvbSAnLi9jb21wb25lbnRzL21vZHVsZS9tb2RhbC5qcyc7XG5pbXBvcnQgeyBzbmFja2JhciB9IGZyb20gJy4vY29tcG9uZW50cy9tb2R1bGUvc25hY2suanMnO1xuaW1wb3J0IHsgY29sbGFwc2UgfSBmcm9tICcuL2NvbXBvbmVudHMvbW9kdWxlL2NvbGxhcHNlLmpzJztcblxuLy8gVXRpbHMgbW9kdWxlXG5jb25zdCB1dGlscyA9IHtcblx0XCJjbGlja1wiOiBjbGljayxcblx0XCJ0b2dnbGVcIjogdG9nZ2xlLFxuXHRcImNsaWNrRWFjaFwiOiBjbGlja0VhY2gsXG5cdFwiZWFjaFwiOiBlYWNoLFxuXHRcIm1lcmdlXCI6IG1lcmdlLFxuXHRcImNzc1wiOiBjc3MsXG5cdFwiYmxvZ2dlclwiOiB7XG5cdFx0XCJjcmVhdGVTY3JpcHRcIjogY3JlYXRlU2NyaXB0LFxuXHRcdFwiZm9ybWF0XCI6IGZvcm1hdCxcblx0XHRcInBhcnNlclwiOiBwYXJzZXJcblx0fVxufVxuXG4vLyBDb21wb25lbnRzIG1vZHVsZVxuY29uc3QgY29tcG9uZW50cyA9IHtcblx0XCJkcm9wZG93blwiOiBkcm9wZG93bixcblx0XCJtb2RhbFwiOiBtb2RhbCxcblx0XCJzbmFja2JhclwiOiBzbmFja2Jhcixcblx0XCJjb2xsYXBzZVwiOiBjb2xsYXBzZSxcbn1cblxuZXhwb3J0IHsgdXRpbHMsIGNvbXBvbmVudHMgfSJdLCJuYW1lcyI6WyJpc05vZGUiLCJjaGVja0VsZW1lbnQiLCJjaGVjayIsImNsaWNrIiwibm9kZUVsZW1lbnQiLCJhY3Rpb24iLCJzZWxlY3RvciIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsImFkZEV2ZW50TGlzdGVuZXIiLCJldmVudCIsInRvZ2dsZSIsImV2ZW4iLCJvZGQiLCJjb250cm9sIiwiY2xpY2tFYWNoIiwibm9kZUVsZW1lbnRzIiwicXVlcnlTZWxlY3RvckFsbCIsImkiLCJsZW5ndGgiLCJfQUREX0NMQVNTX0NTUyIsImVsZW1lbnQiLCJjbGFzc05hbWUiLCJnZXRDbGFzcyIsImNsYXNzTGlzdCIsImFkZCIsIl9UT0dHTEVfQ0xBU1NfQ1NTIiwiX1JFTU9WRV9DTEFTU19DU1MiLCJyZW1vdmUiLCJfSEFTX0NMQVNTX0NTUyIsImdldENsYXNzTmFtZSIsImdldEF0dHJpYnV0ZSIsInJlZyIsIlJlZ0V4cCIsImNoZWNrQ1NTIiwidGVzdCIsIl9DTEVBTl9BTExfQ1NTIiwiYXJyYXkiLCJjc3MiLCJlYWNoIiwiY2FsbGJhY2siLCJjYWxsIiwibWVyZ2UiLCJzb3VyY2UiLCJwcm9wZXJ0aWVzIiwicHJvcGVydHkiLCJoYXNPd25Qcm9wZXJ0eSIsImNyZWF0ZVNjcmlwdCIsImhvbWVVUkwiLCJhdHRyaWJ1dGVzIiwic2NycHQiLCJjcmVhdGVFbGVtZW50Iiwic3JjIiwiZm9ybWF0IiwiZGF0YSIsImNvbmZpZyIsImdldElEIiwiaWQiLCJtYXRjaCIsInJlcGxhY2UiLCJnZXRMaW5rIiwibGluayIsInJlc3VsdCIsInJlbCIsImhyZWYiLCJjbGVhbkhUTUwiLCJodG1sIiwic3VtbWFyeSIsImNvbnRlbnQiLCJzdWJzdHIiLCJnZXRUaHVtYm5haWwiLCJ0ZW1wIiwiaW5uZXJIVE1MIiwiZ2V0SW1hZ2UiLCIkdCIsInRpdGxlIiwidGh1bWJuYWlsIiwibWVkaWEkdGh1bWJuYWlsIiwidXJsIiwiaW1nIiwibGFiZWwiLCJjYXRlZ29yeSIsIm1hcCIsImVsIiwidGVybSIsInB1Ymxpc2hlZCIsInVwZGF0ZSIsInVwZGF0ZWQiLCJwYXJzZXIiLCJqc29uIiwidmFsdWUiLCJvYmpOYW1lIiwiZHJvcGRvd24iLCJfT1BUSU9OIiwiYWxpZ24iLCJhbmltYXRpb24iLCJzZXRQb3NpdGlvbiIsInBhcmVudENvbnRlbnQiLCJzdHlsZSIsImxlZnQiLCJ0b3AiLCJyaWdodCIsInNldE9yaWdpblRyYW5zZm9ybSIsImluZGV4IiwidHJpZ2dlciIsImxpc3QiLCJjdXJyZW50QWxpZ24iLCJlIiwicHJldmVudERlZmF1bHQiLCJzdG9wUHJvcGFnYXRpb24iLCJib2R5IiwibW9kYWwiLCJtb2RhbFJlbmRlciIsImhlYWRsaW5lIiwibW9kYWxPdXRlciIsIm1vZGFsSGVhZGxpbmUiLCJtb2RhbENvbnRlbnQiLCJtb2RhbENsb3NlIiwiYXBwZW5kQ2hpbGQiLCJoYXNoIiwiZ2V0RWxlbWVudEJ5SWQiLCJtb2RhbEhUTUwiLCJzbmFja2JhciIsImRpciIsImR1ciIsInNuYWNrQ29udGFpbmVyIiwiZGlyZWN0aW9uIiwiY29udGFpbmVyIiwic25hY2tJdGVtIiwiY29sb3IiLCJpdGVtIiwic2V0VGltZW91dCIsInRleHQiLCJjb2xsYXBzZSIsIm5hbWUiLCJvcmlnaW4iLCJwYXJlbnQiLCJwYXJlbnROb2RlIiwicGFyZW50SXRlbSIsIm5leHRFbGVtZW50U2libGluZyIsImhhcyIsImNsZWFuIiwidXRpbHMiLCJjb21wb25lbnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Q0FBTyxNQUFNQSxNQUFNLEdBQUlDLFlBQUQsSUFBa0I7Q0FDdkMsTUFBSUMsS0FBSyxHQUFHLE9BQU9ELFlBQW5CO0NBQ0EsU0FBT0MsS0FBSyxJQUFJLFFBQVQsR0FBb0IsSUFBcEIsR0FBMkIsS0FBbEM7Q0FDQSxDQUhNOztDQ0VQLE1BQU1DLEtBQUssR0FBSSxVQUFVQyxXQUFWLEVBQXVCQyxNQUF2QixFQUErQjtDQUM3QyxNQUFJQyxRQUFRLEdBQUdO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
