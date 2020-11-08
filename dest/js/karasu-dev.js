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
	    thumbnail: data.media$thumbnail ? data.media$thumbnail.url.replace(/s\B\d{2,4}-c/, config.img ? config.img : 's200') : getThumbnail,
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2FyYXN1LWRldi5qcyIsInNvdXJjZXMiOlsic291cmNlL2pzL3V0aWxzL21vZHVsZS9oZWxwZXIuanMiLCJzb3VyY2UvanMvdXRpbHMvbW9kdWxlL2NsaWNrLmpzIiwic291cmNlL2pzL3V0aWxzL21vZHVsZS9jc3MuanMiLCJzb3VyY2UvanMvdXRpbHMvbW9kdWxlL2VhY2guanMiLCJzb3VyY2UvanMvdXRpbHMvbW9kdWxlL21lcmdlLmpzIiwic291cmNlL2pzL3V0aWxzL21vZHVsZS9jcmVhdGVTY3JpcHQuanMiLCJzb3VyY2UvanMvdXRpbHMvbW9kdWxlL2Zvcm1hdC5qcyIsInNvdXJjZS9qcy91dGlscy9tb2R1bGUvcGFyc2VyLmpzIiwic291cmNlL2pzL2NvbXBvbmVudHMvbW9kdWxlL2Ryb3Bkb3duLmpzIiwic291cmNlL2pzL2NvbXBvbmVudHMvbW9kdWxlL21vZGFsLmpzIiwic291cmNlL2pzL2NvbXBvbmVudHMvbW9kdWxlL3NuYWNrLmpzIiwic291cmNlL2pzL2NvbXBvbmVudHMvbW9kdWxlL2NvbGxhcHNlLmpzIiwic291cmNlL2pzL2thcmFzdS1kZXYuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IGlzTm9kZSA9IChjaGVja0VsZW1lbnQpID0+IHtcclxuXHRsZXQgY2hlY2sgPSB0eXBlb2YgY2hlY2tFbGVtZW50O1xyXG5cdHJldHVybiBjaGVjayA9PSAnb2JqZWN0JyA/IHRydWUgOiBmYWxzZVxyXG59XHJcbiIsImltcG9ydCB7IGlzTm9kZSB9IGZyb20gJy4vaGVscGVyJztcclxuXHJcbmNvbnN0IGNsaWNrID0gIGZ1bmN0aW9uIChub2RlRWxlbWVudCwgYWN0aW9uKSB7XHJcblx0bGV0IHNlbGVjdG9yID0gaXNOb2RlKG5vZGVFbGVtZW50KSA/IG5vZGVFbGVtZW50IDogZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihub2RlRWxlbWVudCk7XHJcblx0c2VsZWN0b3IuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudD0+YWN0aW9uKGV2ZW50KSk7XHJcbn1cclxuXHJcbmNvbnN0IHRvZ2dsZSA9IChub2RlRWxlbWVudCwgZXZlbiwgb2RkKT0+e1xyXG5cdGxldCBzZWxlY3RvciA9IGlzTm9kZShub2RlRWxlbWVudCkgPyBub2RlRWxlbWVudCA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Iobm9kZUVsZW1lbnQpLFxyXG5cdFx0Y29udHJvbCA9IDA7XHJcblxyXG5cdFx0c2VsZWN0b3IuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudD0+e1xyXG5cdFx0XHRpZiAoY29udHJvbD09MCkge1xyXG5cdFx0XHRcdGV2ZW4oZXZlbnQpO1xyXG5cdFx0XHRcdGNvbnRyb2w9MTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRvZGQoZXZlbnQpO1xyXG5cdFx0XHRcdGNvbnRyb2w9MDtcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxufVxyXG5cclxuY29uc3QgY2xpY2tFYWNoID0gKG5vZGVFbGVtZW50cywgYWN0aW9uKT0+e1xyXG5cdGxldCBzZWxlY3RvciA9IGlzTm9kZShub2RlRWxlbWVudCkgPyBub2RlRWxlbWVudHMgOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKG5vZGVFbGVtZW50cyk7XHJcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzZWxlY3Rvci5sZW5ndGg7IGkrKykge1xyXG5cdFx0c2VsZWN0b3JbaV0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudD0+YWN0aW9uKGV2ZW50KSk7XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgeyBjbGljaywgdG9nZ2xlLCBjbGlja0VhY2ggfSIsImNvbnN0IF9BRERfQ0xBU1NfQ1NTID0gKGVsZW1lbnQsIC4uLmNsYXNzTmFtZSkgPT4ge1xyXG5cdGxldCBnZXRDbGFzcyA9IFsuLi5jbGFzc05hbWVdO1xyXG5cdGZvciAodmFyIGkgPSBnZXRDbGFzcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG5cdFx0ZWxlbWVudC5jbGFzc0xpc3QuYWRkKGdldENsYXNzW2ldKTtcclxuXHR9XHJcblx0XHJcbn1cclxuXHJcbmNvbnN0IF9UT0dHTEVfQ0xBU1NfQ1NTID0gKGVsZW1lbnQsIGNsYXNzTmFtZSkgPT4ge1xyXG5cdGVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZShjbGFzc05hbWUpO1xyXG59XHJcblxyXG5jb25zdCBfUkVNT1ZFX0NMQVNTX0NTUyA9IChlbGVtZW50LCBjbGFzc05hbWUpID0+IHtcclxuXHRlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcclxuXHRyZXR1cm4gY2xhc3NOYW1lXHJcbn1cclxuXHJcbmNvbnN0IF9IQVNfQ0xBU1NfQ1NTID0gKGVsZW1lbnQsIGNsYXNzTmFtZSkgPT4ge1xyXG5cdGNvbnN0IGdldENsYXNzTmFtZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdjbGFzcycpO1xyXG5cclxuXHRpZiAoZ2V0Q2xhc3NOYW1lKSB7XHJcblx0XHRjb25zdCByZWcgPSBuZXcgUmVnRXhwKGNsYXNzTmFtZSwgJ2cnKSxcclxuXHRcdFx0Y2hlY2tDU1MgPSByZWcudGVzdChnZXRDbGFzc05hbWUpO1xyXG5cclxuXHRcdHJldHVybiBjaGVja0NTUyA/IHRydWUgOiBmYWxzZTtcclxuXHR9XHJcblxyXG5cdHJldHVybiAnJ1xyXG59XHJcblxyXG5jb25zdCBfQ0xFQU5fQUxMX0NTUyA9IChhcnJheSwgY2xhc3NOYW1lKT0+e1xyXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcclxuXHRcdGFycmF5W2ldLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKVxyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGNzcyA9IHtcclxuXHRcImFkZFwiOiBfQUREX0NMQVNTX0NTUyxcclxuXHRcInJlbW92ZVwiOiBfUkVNT1ZFX0NMQVNTX0NTUyxcclxuXHRcImhhc1wiOiBfSEFTX0NMQVNTX0NTUyxcclxuXHRcImNsZWFuXCI6IF9DTEVBTl9BTExfQ1NTLFxyXG5cdFwidG9nZ2xlXCI6IF9UT0dHTEVfQ0xBU1NfQ1NTXHJcbn07IiwiZXhwb3J0IGNvbnN0IGVhY2ggPSAoYXJyYXksIGNhbGxiYWNrKT0+e1xyXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcclxuXHRcdGNhbGxiYWNrLmNhbGwoYXJyYXlbaV0sIGksIGFycmF5W2ldKVxyXG5cdH1cclxufSIsImV4cG9ydCBjb25zdCBtZXJnZSA9IChzb3VyY2UsIHByb3BlcnRpZXMpID0+IHtcclxuXHR2YXIgcHJvcGVydHk7XHJcblx0Zm9yIChwcm9wZXJ0eSBpbiBwcm9wZXJ0aWVzKSB7XHJcblx0XHRpZiAocHJvcGVydGllcy5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpIHtcclxuXHRcdFx0c291cmNlW3Byb3BlcnR5XSA9IHByb3BlcnRpZXNbcHJvcGVydHldO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRyZXR1cm4gc291cmNlO1xyXG59IiwiY29uc3QgY3JlYXRlU2NyaXB0ID0gKGhvbWVVUkwsIGF0dHJpYnV0ZXMpID0+IHtcclxuXHJcblx0bGV0IHNjcnB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XHJcblx0c2NycHQuc3JjID0gYCR7aG9tZVVSTH0vZmVlZHMvcG9zdHMvJHthdHRyaWJ1dGVzfWA7XHJcblxyXG5cdHJldHVybiBzY3JwdDtcclxuXHJcbn1cclxuXHJcbmV4cG9ydCB7IGNyZWF0ZVNjcmlwdCB9IiwiY29uc3QgZm9ybWF0ID0gKGRhdGEsIGNvbmZpZykgPT4ge1xyXG5cclxuXHRmdW5jdGlvbiBnZXRJRChpZCkge1xyXG5cdFx0bGV0IGdldElEID0gaWQubWF0Y2goL3Bvc3QtXFxkezEsfS9nKVswXTtcclxuXHRcdHJldHVybiBnZXRJRC5yZXBsYWNlKCdwb3N0LScsICcnKTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldExpbmsobGluaykge1xyXG5cdFx0bGV0IGdldExpbmsgPSBsaW5rLFxyXG5cdFx0XHRyZXN1bHQgPSBcIlwiO1xyXG5cdFx0XHJcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGdldExpbmsubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0aWYgKGdldExpbmtbaV0ucmVsID09ICdhbHRlcm5hdGUnKSB7XHJcblx0XHRcdFx0cmVzdWx0ID0gZ2V0TGlua1tpXS5ocmVmO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHJlc3VsdDtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGNsZWFuSFRNTCAoaHRtbCkge1xyXG5cdFx0cmV0dXJuIGh0bWwucmVwbGFjZSgvPFtePl0qPj8vZywgJycpXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzdW1tYXJ5IChjb250ZW50KSB7XHJcblx0XHRyZXR1cm4gY29uZmlnLnN1bW1hcnkgPyBjbGVhbkhUTUwoY29udGVudCkuc3Vic3RyKDAsIGNvbmZpZy5zdW1tYXJ5KSA6IGNsZWFuSFRNTChjb250ZW50KS5zdWJzdHIoMCwgMTAwKVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZ2V0VGh1bWJuYWlsIChjb250ZW50KSB7XHJcblx0XHRsZXQgdGVtcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdFx0dGVtcC5pbm5lckhUTUw9Y29udGVudDtcclxuXHJcblx0XHRsZXQgZ2V0SW1hZ2UgPSB0ZW1wLnF1ZXJ5U2VsZWN0b3IoJ2ltZycpO1xyXG5cclxuXHRcdHJldHVybiBnZXRJbWFnZSA/IGdldEltYWdlLmdldEF0dHJpYnV0ZSgnc3JjJykgOiBcIlwiO1xyXG5cdH1cclxuXHJcblx0Y29uc3QgY29udGVudCA9IGRhdGEuY29udGVudCA/IGRhdGEuY29udGVudC4kdCA6IGRhdGEuc3VtbWFyeS4kdDtcclxuXHRcclxuXHRyZXR1cm4ge1xyXG5cdFx0aWQ6IGdldElEKGRhdGEuaWQuJHQpLFxyXG5cdFx0dGl0bGU6IGRhdGEudGl0bGUgPyBkYXRhLnRpdGxlLiR0IDogJ05vIHRpdGxlJyxcclxuXHRcdHRodW1ibmFpbDogZGF0YS5tZWRpYSR0aHVtYm5haWwgPyBkYXRhLm1lZGlhJHRodW1ibmFpbC51cmwucmVwbGFjZSgvc1xcQlxcZHsyLDR9LWMvLCBjb25maWcuaW1nID8gY29uZmlnLmltZyA6ICdzMjAwJykgOiBnZXRUaHVtYm5haWwsXHJcblx0XHRsYWJlbDogZGF0YS5jYXRlZ29yeSA/IGRhdGEuY2F0ZWdvcnkubWFwKGVsPT5lbC50ZXJtKSA6ICcnLFxyXG5cdFx0bGluazogZ2V0TGluayhkYXRhLmxpbmspLFxyXG5cdFx0Y29udGVudDogY29udGVudCxcclxuXHRcdHN1bW1hcnk6IHN1bW1hcnkoY29udGVudCksXHJcblx0XHRwdWJsaXNoZWQ6IGRhdGEucHVibGlzaGVkLiR0LFxyXG5cdFx0dXBkYXRlOiBkYXRhLnVwZGF0ZWQuJHRcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCB7IGZvcm1hdCB9IiwiY29uc3QgcGFyc2VyID0gKGpzb24sIGh0bWwpID0+IHtcclxuXHRyZXR1cm4gaHRtbC5yZXBsYWNlKC9cXHtcXHcrXFx9L2csIHZhbHVlPT57XHJcblx0XHRsZXQgb2JqTmFtZSA9IHZhbHVlLnJlcGxhY2UoL3t8fS9nLCAnJyk7XHJcblx0XHRyZXR1cm4ganNvbltvYmpOYW1lXTtcclxuXHR9KVxyXG59XHJcblxyXG5leHBvcnQgeyBwYXJzZXIgfSIsImltcG9ydCB7IGVhY2ggfSBmcm9tICcuLi8uLi91dGlscy9tb2R1bGUvZWFjaCc7XHJcbmltcG9ydCB7IGNsaWNrIH0gZnJvbSAnLi4vLi4vdXRpbHMvbW9kdWxlL2NsaWNrJztcclxuaW1wb3J0IHsgbWVyZ2UgfSBmcm9tICcuLi8uLi91dGlscy9tb2R1bGUvbWVyZ2UnO1xyXG5pbXBvcnQgeyBjc3MgfSBmcm9tICcuLi8uLi91dGlscy9tb2R1bGUvY3NzJztcclxuXHJcblxyXG5leHBvcnQgY29uc3QgZHJvcGRvd24gPSAoY29uZmlnKSA9PiB7XHJcblx0Ly8gVmFyaWFibGVcclxuXHRsZXQgc2VsZWN0b3IgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZHJvcGRvd24nKTtcclxuXHJcblx0Ly8gQ29uZmlnXHJcblx0Y29uc3QgX09QVElPTiA9IG1lcmdlKHtcclxuXHRcdGFsaWduOiBcInJ0XCIsXHJcblx0XHRhbmltYXRpb246ICdhbmktZmFkZUluU2NhbGUnXHJcblx0fSwgY29uZmlnKTtcclxuXHJcblxyXG5cdC8vIFNldGVhbW9zIGxhIHBvc2ljaW9uIGVuIGJhc2UgYSBsYXMgcHJvcGllZGFkZXMgdG9wIHkgbGVmdCBkZSBjc3NcclxuXHRjb25zdCBzZXRQb3NpdGlvbiA9IGZ1bmN0aW9uIChjb250ZW50LCBwYXJlbnRDb250ZW50LCBhbGlnbikge1xyXG5cclxuXHRcdHN3aXRjaChhbGlnbikge1xyXG5cdFx0XHRjYXNlICdsdCc6XHJcblx0XHRcdFx0Y29udGVudC5zdHlsZS5sZWZ0ID0gMCArICdweCc7XHJcblx0XHRcdFx0Y29udGVudC5zdHlsZS50b3AgPSAwICsgJ3B4JztcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAncnQnOlxyXG5cdFx0XHRcdGNvbnRlbnQuc3R5bGUucmlnaHQgPSAwICsgJ3B4JztcclxuXHRcdFx0XHRjb250ZW50LnN0eWxlLnRvcCA9IDAgKyAncHgnO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdyYic6XHJcblx0XHRcdFx0Y29udGVudC5zdHlsZS5yaWdodCA9IDAgKyAncHgnO1xyXG5cdFx0XHRcdGNvbnRlbnQuc3R5bGUudG9wID0gMTAwICsgJyUnO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdsYic6XHJcblx0XHRcdFx0Y29udGVudC5zdHlsZS5sZWZ0ID0gMCArICdweCc7XHJcblx0XHRcdFx0Y29udGVudC5zdHlsZS50b3AgPSAxMDAgKyAnJSc7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcblxyXG5cdC8qXHJcblx0XHRTZXRlYW1vcyBlbCBvcmlnZW4gZGUgbGEgdHJhbnNmb3JtYWNpb24sIGVzdG8gcGFyYSBwb2RlciBcclxuXHRcdHRlbmVyIHVuYSBhbmltYWNpb24gbWFzIGFjb3JkZSBhIGNhZGEgcG9zaWNpb24uXHJcblx0Ki9cclxuXHJcblx0Y29uc3Qgc2V0T3JpZ2luVHJhbnNmb3JtID0gKGFsaWduKSA9PiB7XHJcblx0XHRzd2l0Y2ggKGFsaWduKSB7XHJcblx0XHRcdGNhc2UgJ2x0JzpcclxuXHRcdFx0XHRyZXR1cm4gJ2FuaS1sdCc7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ3J0JzpcclxuXHRcdFx0XHRyZXR1cm4gJ2FuaS1ydCc7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ3JiJzpcclxuXHRcdFx0XHRyZXR1cm4gJ2FuaS1ydCc7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ2xiJzpcclxuXHRcdFx0XHRyZXR1cm4gJ2FuaS1sdCc7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHJcblx0ZWFjaChzZWxlY3RvciwgKGluZGV4LCBlbCkgPT4ge1xyXG5cdFx0bGV0IHRyaWdnZXIgPSBlbC5xdWVyeVNlbGVjdG9yKCcuZHJvcGRvd24tdHJpZ2dlcicpLFxyXG5cdFx0XHRsaXN0ID0gZWwucXVlcnlTZWxlY3RvcignLmRyb3Bkb3duLWxpc3QnKTtcclxuXHJcblx0XHRjb25zdCBjdXJyZW50QWxpZ24gPSBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtYWxpZ24nKSA/IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1hbGlnbicpIDogZmFsc2U7XHJcblx0XHRjb25zdCBhbGlnbiA9IGN1cnJlbnRBbGlnbiA/IGN1cnJlbnRBbGlnbiA6IF9PUFRJT04uYWxpZ247XHJcblx0XHRcclxuXHRcdC8vIFNldGVhbW9zIGxhIHBvc2ljaW9uIGVuIGVsIGx1Z2FyIGRhZG9cclxuXHRcdHNldFBvc2l0aW9uKGxpc3QsIHRyaWdnZXIsIGFsaWduKTtcclxuXHJcblx0XHQvLyBTZXRlYW1vcyBsYXMgY2xhc2VzIHBhcmEgbW9zdHJhciBsYSBhbmltYWNpb25cclxuXHRcdGNzcy5hZGQobGlzdCwgJ2FuaS0wNXMnLCBzZXRPcmlnaW5UcmFuc2Zvcm0oYWxpZ24pKTtcclxuXHJcblx0XHRjbGljayh0cmlnZ2VyLCAoZSkgPT4ge1xyXG5cdFx0XHQvLyBQcmV2ZW5pbW9zIGV2ZW50b3Mgbm8gZGVzZWFkb3MgKGVubGFjZSwgYm90b25lcywgZXRjKVxyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG5cdFx0XHQvLyBsZXQgY2xlYW5Dc3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZHJvcGRvd24gLmRyb3Bkb3duLWxpc3QnKTtcclxuXHJcblx0XHRcdC8vIGNzcy5jbGVhbihjbGVhbkNzcywgJ2lzLWFjdGl2ZScpO1xyXG5cdFx0XHQvLyBjc3MuY2xlYW4oY2xlYW5Dc3MsIF9PUFRJT04uYW5pbWF0aW9uKTtcclxuXHJcblx0XHRcdGNzcy50b2dnbGUobGlzdCwgJ2lzLWFjdGl2ZScpO1xyXG5cdFx0XHRjc3MudG9nZ2xlKGxpc3QsIF9PUFRJT04uYW5pbWF0aW9uKTtcclxuXHJcblx0XHR9KVxyXG5cdH0pO1xyXG5cclxuXHQvLyBDZXJyYW1vcyBkcm9wZG93biBhY3Rpdm9zXHJcblxyXG5cdGNsaWNrKGRvY3VtZW50LmJvZHksICgpPT57XHJcblx0XHRcclxuXHRcdGVhY2goc2VsZWN0b3IsIChpbmRleCwgZWwpID0+IHtcclxuXHRcdFx0bGV0IGxpc3QgPSBlbC5xdWVyeVNlbGVjdG9yKCcuZHJvcGRvd24tbGlzdCcpO1xyXG5cdFx0XHRjc3MucmVtb3ZlKGxpc3QsICdpcy1hY3RpdmUnKTtcclxuXHRcdFx0Y3NzLnJlbW92ZShsaXN0LCBfT1BUSU9OLmFuaW1hdGlvbik7XHJcblx0XHR9KVxyXG5cdFxyXG5cdH0pO1xyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBlYWNoIH0gZnJvbSAnLi4vLi4vdXRpbHMvbW9kdWxlL2VhY2gnO1xyXG5pbXBvcnQgeyBjbGljayB9IGZyb20gJy4uLy4uL3V0aWxzL21vZHVsZS9jbGljayc7XHJcbmltcG9ydCB7IG1lcmdlIH0gZnJvbSAnLi4vLi4vdXRpbHMvbW9kdWxlL21lcmdlJztcclxuaW1wb3J0IHsgY3NzIH0gZnJvbSAnLi4vLi4vdXRpbHMvbW9kdWxlL2Nzcyc7XHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IG1vZGFsID0gKGNvbmZpZykgPT4ge1xyXG5cclxuXHQvLyBWYXJpYWJsZXNcclxuXHRjb25zdCB0cmlnZ2VyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm1vZGFsLXRyaWdnZXInKTtcclxuXHJcblx0Ly8gQ29uZmlnXHJcblx0Y29uc3QgX09QVElPTiA9IG1lcmdlKHtcclxuXHRcdGFuaW1hdGlvbjogJ2FuaS1mYWRlSW5Ub3AnXHJcblx0fSwgY29uZmlnKTtcclxuXHJcblx0Ly8gQ3JlYW1vcyBodG1sIHBhcmEgbW9zdHJhciBlbCByZW5kZXJcclxuXHRjb25zdCBtb2RhbFJlbmRlciA9IChoZWFkbGluZSwgY29udGVudCwgYW5pbWF0aW9uKSA9PiB7XHJcblxyXG5cdFx0bGV0IG1vZGFsT3V0ZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcclxuXHRcdFx0bW9kYWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSwgXHJcblx0XHRcdG1vZGFsSGVhZGxpbmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcclxuXHRcdFx0bW9kYWxDb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksXHJcblx0XHRcdG1vZGFsQ2xvc2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcblxyXG5cdFx0Ly8gQWdyZWdhbW9zIGxvcyBjc3MgY29ycmVzcG9uZGllbnRlXHJcblx0XHRjc3MuYWRkKG1vZGFsT3V0ZXIsICdtb2RhbC1vdXRlcicsICdkLWZsZXgnLCAnYS1pdGVtLWNlbnRlcicsICdqLWNvbnRlbnQtY2VudGVyJyksXHJcblx0XHRjc3MuYWRkKG1vZGFsLCAnbW9kYWwnLCAoaGVhZGxpbmUgPyBudWxsIDogJ2lzLWNvbXBhY3QnKSwgJ2FuaScsIGFuaW1hdGlvbiksXHJcblx0XHRjc3MuYWRkKG1vZGFsSGVhZGxpbmUsICdtb2RhbC1oZWFkbGluZScpLFxyXG5cdFx0Y3NzLmFkZChtb2RhbENvbnRlbnQsICdtb2RhbC1jb250ZW50JyksXHJcblx0XHRjc3MuYWRkKG1vZGFsQ2xvc2UsICdtb2RhbC1jbG9zZScpO1xyXG5cclxuXHRcdC8vIEluc2VydGFtb3MgZWwgY29udGVuaWRvIGNvcnJlc3BvbmRpZW50ZVxyXG5cdFx0bW9kYWxDbG9zZS5pbm5lckhUTUwgPSAnPGkgY2xhc3NOYW1lPVwiZmFzIGZhLXRpbWVzXCI+PC9pPicsXHJcblx0XHRtb2RhbEhlYWRsaW5lLmlubmVySFRNTCA9IChoZWFkbGluZSA/IGA8c3Bhbj4ke2hlYWRsaW5lfTwvc3Bhbj48c3BhbiBjbGFzcz1cIm1vZGFsLWNsb3NlXCI+PGkgY2xhc3M9XCJmYXMgZmEtdGltZXNcIj48L2k+PC9zcGFuPmAgOiBgPHNwYW4gY2xhc3M9XCJtb2RhbC1jbG9zZVwiPjxpIGNsYXNzPVwiZmFzIGZhLXRpbWVzXCI+PC9pPjwvc3Bhbj5gKSxcclxuXHRcdG1vZGFsQ29udGVudC5pbm5lckhUTUwgPSBjb250ZW50O1xyXG5cclxuXHRcdC8vIEFwaWxhbW9zIHRvZG8sXHJcblx0XHRtb2RhbC5hcHBlbmRDaGlsZChtb2RhbEhlYWRsaW5lKTtcclxuXHRcdG1vZGFsLmFwcGVuZENoaWxkKG1vZGFsQ29udGVudCk7XHJcblx0XHRtb2RhbC5hcHBlbmRDaGlsZChtb2RhbENsb3NlKTtcclxuXHRcdG1vZGFsT3V0ZXIuYXBwZW5kQ2hpbGQobW9kYWwpO1xyXG5cclxuXHRcdC8vIENyZWFtb3MgbGFzIGFjY2lvbmVzIHBhcmEgZWxpbWluYXIgZWwgbW9kYWwgYWN0aXZvXHJcblx0XHRjbGljayhtb2RhbCwgKGUpPT5lLnN0b3BQcm9wYWdhdGlvbigpKTtcclxuXHRcdGNsaWNrKG1vZGFsT3V0ZXIsICgpPT5tb2RhbE91dGVyLnJlbW92ZSgpKTtcclxuXHJcblx0XHQvLyBDcmVhbW9zIGxhIGFjY2lvbiBwYXJhIGVsaW1pbmFyIGVsIG1vZGFsIGFsIHByZXNpb25hciBzb2JyZSBsYSBcIlhcIlxyXG5cdFx0Y2xpY2sobW9kYWxIZWFkbGluZS5xdWVyeVNlbGVjdG9yKCcubW9kYWwtY2xvc2UnKSwgKGUpPT5tb2RhbE91dGVyLnJlbW92ZSgpKTtcclxuXHJcblx0XHRyZXR1cm4gbW9kYWxPdXRlcjtcclxuXHJcblx0fVxyXG5cclxuXHRlYWNoKHRyaWdnZXIsIChpbmRleCwgZWwpID0+IHtcclxuXHJcblx0XHRsZXQgYm9keSA9IGRvY3VtZW50LmJvZHksXHJcblx0XHRcdGhhc2ggPSBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtY29udGVudCcpLFxyXG5cdFx0XHRjb250ZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaGFzaCkuaW5uZXJIVE1MLFxyXG5cdFx0XHR0aXRsZSA9IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1oZWFkbGluZScpO1xyXG5cclxuXHRcdGNsaWNrKGVsLCAoZSkgPT4ge1xyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0XHRsZXQgbW9kYWxIVE1MID0gbW9kYWxSZW5kZXIodGl0bGUgPyB0aXRsZSA6ICcnLCBjb250ZW50LCBfT1BUSU9OLmFuaW1hdGlvbiksXHJcblx0XHRcdFx0Y2xvc2VNb2RhbCA9IG1vZGFsSFRNTDtcclxuXHJcblx0XHRcdGJvZHkuYXBwZW5kQ2hpbGQobW9kYWxIVE1MKTtcclxuXHJcblx0XHR9KVxyXG5cclxuXHR9KTtcclxuXHJcbn07IiwiaW1wb3J0IHsgZWFjaCB9IGZyb20gJy4uLy4uL3V0aWxzL21vZHVsZS9lYWNoJztcclxuaW1wb3J0IHsgY2xpY2sgfSBmcm9tICcuLi8uLi91dGlscy9tb2R1bGUvY2xpY2snO1xyXG5pbXBvcnQgeyBtZXJnZSB9IGZyb20gJy4uLy4uL3V0aWxzL21vZHVsZS9tZXJnZSc7XHJcbmltcG9ydCB7IGNzcyB9IGZyb20gJy4uLy4uL3V0aWxzL21vZHVsZS9jc3MnO1xyXG5cclxuZXhwb3J0IGNvbnN0IHNuYWNrYmFyID0gKGNvbmZpZykgPT4ge1xyXG5cclxuXHQvLyBWYXJpYWJsZXNcclxuXHRsZXQgYm9keSA9IGRvY3VtZW50LmJvZHksXHJcblx0XHR0cmlnZ2VyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnNuYWNrYmFyLXRyaWdnZXInKTtcclxuXHJcblx0Ly8gQ29uZmlnXHJcblx0Y29uc3QgX09QVElPTiA9IG1lcmdlKHtcclxuXHRcdGFuaW1hdGlvbjogJ2FuaS1mYWRlSW5Ub3AnLFxyXG5cdFx0ZGlyOiAncnQnLFxyXG5cdFx0ZHVyOiA2MDBcclxuXHR9LCBjb25maWcpO1xyXG5cclxuXHJcblx0Y29uc3Qgc25hY2tDb250YWluZXIgPSAoZGlyZWN0aW9uKSA9PiB7XHJcblx0XHRsZXQgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblx0XHRjc3MuYWRkKGNvbnRhaW5lciwgZGlyZWN0aW9uID8gJ2lzLScrZGlyZWN0aW9uIDogJ2lzLXJiJywgJ3NuYWNrLWNvbnRhaW5lcicpO1xyXG5cdFx0cmV0dXJuIGNvbnRhaW5lcjtcclxuXHR9XHJcblxyXG5cdGNvbnN0IHNuYWNrSXRlbSA9IChjb250ZW50LCBjb2xvciwgYW5pbWF0aW9uKSA9PiB7XHJcblxyXG5cdFx0bGV0IGl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHRcdGNzcy5hZGQoaXRlbSwgY29sb3IgPyBjb2xvciA6IG51bGwsICdzbmFjaycsICdhbmknLCBhbmltYXRpb24pO1xyXG5cdFx0aXRlbS5pbm5lckhUTUwgPSBjb250ZW50O1xyXG5cclxuXHRcdHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0XHRpdGVtLnJlbW92ZSgpO1xyXG5cdFx0fSwgX09QVElPTi5kdXIpXHJcblxyXG5cdFx0cmV0dXJuIGl0ZW07XHJcblx0fVxyXG5cclxuXHRlYWNoKHRyaWdnZXIsIChpbmRleCwgZWwpID0+IHtcclxuXHRcdGxldCB0ZXh0ID0gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLXRleHQnKSxcclxuXHRcdFx0ZGlyID0gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLWRpcicpLFxyXG5cdFx0XHRjb2xvciA9IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1jb2xvcicpO1xyXG5cclxuXHRcdGxldCBjb250YWluZXIgPSBzbmFja0NvbnRhaW5lcihkaXIgPyBkaXIgOiBfT1BUSU9OLmRpcik7XHJcblx0XHRib2R5LmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XHJcblxyXG5cdFx0Y2xpY2soZWwsIChlKSA9PiB7XHJcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0XHRcdGNvbnRhaW5lci5hcHBlbmRDaGlsZChzbmFja0l0ZW0odGV4dCwgXCJpcy1cIiArIGNvbG9yLCBfT1BUSU9OLmFuaW1hdGlvbikpXHJcblx0XHR9KVxyXG5cdH0pO1xyXG5cclxufSIsImltcG9ydCB7IGVhY2ggfSBmcm9tICcuLi8uLi91dGlscy9tb2R1bGUvZWFjaCc7XG5pbXBvcnQgeyBjbGljayB9IGZyb20gJy4uLy4uL3V0aWxzL21vZHVsZS9jbGljayc7XG5pbXBvcnQgeyBtZXJnZSB9IGZyb20gJy4uLy4uL3V0aWxzL21vZHVsZS9tZXJnZSc7XG5pbXBvcnQgeyBjc3MgfSBmcm9tICcuLi8uLi91dGlscy9tb2R1bGUvY3NzJztcblxuZXhwb3J0IGNvbnN0IGNvbGxhcHNlID0gKGNvbmZpZykgPT4ge1xuXHQvLyBWYXJpYWJsZXNcblx0bGV0IGNvbGxhcHNlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNvbGxhcHNlLWNvbnRlbnQnKSxcblx0XHR0cmlnZ2VyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNvbGxhcHNlLXRyaWdnZXInKTtcblxuXHQvLyBDb25maWdcblx0Y29uc3QgX09QVElPTiA9IG1lcmdlKHtcblx0XHRhbmltYXRpb246IHtcblx0XHRcdG5hbWU6ICdhbmktZmFkZUluVG9wJyxcblx0XHRcdG9yaWdpbjogJ210J1xuXHRcdH0sXG5cdH0sIGNvbmZpZyk7XG5cblx0ZWFjaCh0cmlnZ2VyLCAoaW5kZXgsIGVsKSA9PiB7XG5cdFx0bGV0IHNlbGYgPSBlbCxcblx0XHRcdHBhcmVudCA9IGVsLnBhcmVudE5vZGUsXG5cdFx0XHRwYXJlbnRJdGVtID0gZWwubmV4dEVsZW1lbnRTaWJsaW5nO1xuXHRcdFxuXHRcdGNzcy5hZGQocGFyZW50SXRlbSwgJ2FuaScsICdhbmktJyArIF9PUFRJT04uYW5pbWF0aW9uLm9yaWdpbik7XG5cblx0XHRjbGljayhlbCwgKGUpID0+IHtcblxuXHRcdFx0aWYgKGNzcy5oYXMocGFyZW50LCAnaXMtY29sbGFwc2libGUnKSkge1xuXHRcdFx0XHRjc3MuY2xlYW4oY29sbGFwc2UsICdpcy1hY3RpdmUnKTtcblx0XHRcdFx0Y3NzLmNsZWFuKGNvbGxhcHNlLCBfT1BUSU9OLmFuaW1hdGlvbi5uYW1lKTtcblx0XHRcdFx0Y3NzLmFkZChwYXJlbnRJdGVtLCAnaXMtYWN0aXZlJyk7XG5cdFx0XHRcdGNzcy5hZGQocGFyZW50SXRlbSwgX09QVElPTi5hbmltYXRpb24ubmFtZSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjc3MudG9nZ2xlKHBhcmVudEl0ZW0sICdpcy1hY3RpdmUnKTtcblx0XHRcdFx0Y3NzLnRvZ2dsZShwYXJlbnRJdGVtLCBfT1BUSU9OLmFuaW1hdGlvbi5uYW1lKTtcblx0XHRcdH1cblx0XHR9KVxuXHR9KTtcbn0iLCJpbXBvcnQgeyBjbGljaywgdG9nZ2xlLCBjbGlja0VhY2ggfSBmcm9tICcuL3V0aWxzL21vZHVsZS9jbGljayc7XHJcbmltcG9ydCB7IGNzcyB9IGZyb20gJy4vdXRpbHMvbW9kdWxlL2Nzcyc7XHJcbmltcG9ydCB7IGVhY2ggfSBmcm9tICcuL3V0aWxzL21vZHVsZS9lYWNoJztcclxuaW1wb3J0IHsgbWVyZ2UgfSBmcm9tICcuL3V0aWxzL21vZHVsZS9tZXJnZSc7XHJcbmltcG9ydCB7IGNyZWF0ZVNjcmlwdCB9IGZyb20gJy4vdXRpbHMvbW9kdWxlL2NyZWF0ZVNjcmlwdCc7XHJcbmltcG9ydCB7IGZvcm1hdCB9IGZyb20gJy4vdXRpbHMvbW9kdWxlL2Zvcm1hdCc7XHJcbmltcG9ydCB7IHBhcnNlciB9IGZyb20gJy4vdXRpbHMvbW9kdWxlL3BhcnNlcic7XHJcbmltcG9ydCB7IGRyb3Bkb3duIH0gZnJvbSAnLi9jb21wb25lbnRzL21vZHVsZS9kcm9wZG93bi5qcyc7XHJcbmltcG9ydCB7IG1vZGFsIH0gZnJvbSAnLi9jb21wb25lbnRzL21vZHVsZS9tb2RhbC5qcyc7XHJcbmltcG9ydCB7IHNuYWNrYmFyIH0gZnJvbSAnLi9jb21wb25lbnRzL21vZHVsZS9zbmFjay5qcyc7XHJcbmltcG9ydCB7IGNvbGxhcHNlIH0gZnJvbSAnLi9jb21wb25lbnRzL21vZHVsZS9jb2xsYXBzZS5qcyc7XHJcblxyXG4vLyBVdGlscyBtb2R1bGVcclxuY29uc3QgdXRpbHMgPSB7XHJcblx0XCJjbGlja1wiOiBjbGljayxcclxuXHRcInRvZ2dsZVwiOiB0b2dnbGUsXHJcblx0XCJjbGlja0VhY2hcIjogY2xpY2tFYWNoLFxyXG5cdFwiZWFjaFwiOiBlYWNoLFxyXG5cdFwibWVyZ2VcIjogbWVyZ2UsXHJcblx0XCJibG9nZ2VyXCI6IHtcclxuXHRcdFwiY3JlYXRlU2NyaXB0XCI6IGNyZWF0ZVNjcmlwdCxcclxuXHRcdFwiZm9ybWF0XCI6IGZvcm1hdCxcclxuXHRcdFwicGFyc2VyXCI6IHBhcnNlclxyXG5cdH1cclxufVxyXG5cclxuLy8gQ29tcG9uZW50cyBtb2R1bGVcclxuY29uc3QgY29tcG9uZW50cyA9IHtcclxuXHRcImRyb3Bkb3duXCI6IGRyb3Bkb3duLFxyXG5cdFwibW9kYWxcIjogbW9kYWwsXHJcblx0XCJzbmFja2JhclwiOiBzbmFja2JhcixcclxuXHRcImNvbGxhcHNlXCI6IGNvbGxhcHNlLFxyXG59XHJcblxyXG5leHBvcnQgeyB1dGlscywgY29tcG9uZW50cyB9Il0sIm5hbWVzIjpbImlzTm9kZSIsImNoZWNrRWxlbWVudCIsImNoZWNrIiwiY2xpY2siLCJub2RlRWxlbWVudCIsImFjdGlvbiIsInNlbGVjdG9yIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiYWRkRXZlbnRMaXN0ZW5lciIsImV2ZW50IiwidG9nZ2xlIiwiZXZlbiIsIm9kZCIsImNvbnRyb2wiLCJjbGlja0VhY2giLCJub2RlRWxlbWVudHMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiaSIsImxlbmd0aCIsIl9BRERfQ0xBU1NfQ1NTIiwiZWxlbWVudCIsImNsYXNzTmFtZSIsImdldENsYXNzIiwiY2xhc3NMaXN0IiwiYWRkIiwiX1RPR0dMRV9DTEFTU19DU1MiLCJfUkVNT1ZFX0NMQVNTX0NTUyIsInJlbW92ZSIsIl9IQVNfQ0xBU1NfQ1NTIiwiZ2V0Q2xhc3NOYW1lIiwiZ2V0QXR0cmlidXRlIiwicmVnIiwiUmVnRXhwIiwiY2hlY2tDU1MiLCJ0ZXN0IiwiX0NMRUFOX0FMTF9DU1MiLCJhcnJheSIsImNzcyIsImVhY2giLCJjYWxsYmFjayIsImNhbGwiLCJtZXJnZSIsInNvdXJjZSIsInByb3BlcnRpZXMiLCJwcm9wZXJ0eSIsImhhc093blByb3BlcnR5IiwiY3JlYXRlU2NyaXB0IiwiaG9tZVVSTCIsImF0dHJpYnV0ZXMiLCJzY3JwdCIsImNyZWF0ZUVsZW1lbnQiLCJzcmMiLCJmb3JtYXQiLCJkYXRhIiwiY29uZmlnIiwiZ2V0SUQiLCJpZCIsIm1hdGNoIiwicmVwbGFjZSIsImdldExpbmsiLCJsaW5rIiwicmVzdWx0IiwicmVsIiwiaHJlZiIsImNsZWFuSFRNTCIsImh0bWwiLCJzdW1tYXJ5IiwiY29udGVudCIsInN1YnN0ciIsImdldFRodW1ibmFpbCIsInRlbXAiLCJpbm5lckhUTUwiLCJnZXRJbWFnZSIsIiR0IiwidGl0bGUiLCJ0aHVtYm5haWwiLCJtZWRpYSR0aHVtYm5haWwiLCJ1cmwiLCJpbWciLCJsYWJlbCIsImNhdGVnb3J5IiwibWFwIiwiZWwiLCJ0ZXJtIiwicHVibGlzaGVkIiwidXBkYXRlIiwidXBkYXRlZCIsInBhcnNlciIsImpzb24iLCJ2YWx1ZSIsIm9iak5hbWUiLCJkcm9wZG93biIsIl9PUFRJT04iLCJhbGlnbiIsImFuaW1hdGlvbiIsInNldFBvc2l0aW9uIiwicGFyZW50Q29udGVudCIsInN0eWxlIiwibGVmdCIsInRvcCIsInJpZ2h0Iiwic2V0T3JpZ2luVHJhbnNmb3JtIiwiaW5kZXgiLCJ0cmlnZ2VyIiwibGlzdCIsImN1cnJlbnRBbGlnbiIsImUiLCJwcmV2ZW50RGVmYXVsdCIsInN0b3BQcm9wYWdhdGlvbiIsImJvZHkiLCJtb2RhbCIsIm1vZGFsUmVuZGVyIiwiaGVhZGxpbmUiLCJtb2RhbE91dGVyIiwibW9kYWxIZWFkbGluZSIsIm1vZGFsQ29udGVudCIsIm1vZGFsQ2xvc2UiLCJhcHBlbmRDaGlsZCIsImhhc2giLCJnZXRFbGVtZW50QnlJZCIsIm1vZGFsSFRNTCIsInNuYWNrYmFyIiwiZGlyIiwiZHVyIiwic25hY2tDb250YWluZXIiLCJkaXJlY3Rpb24iLCJjb250YWluZXIiLCJzbmFja0l0ZW0iLCJjb2xvciIsIml0ZW0iLCJzZXRUaW1lb3V0IiwidGV4dCIsImNvbGxhcHNlIiwibmFtZSIsIm9yaWdpbiIsInBhcmVudCIsInBhcmVudE5vZGUiLCJwYXJlbnRJdGVtIiwibmV4dEVsZW1lbnRTaWJsaW5nIiwiaGFzIiwiY2xlYW4iLCJ1dGlscyIsImNvbXBvbmVudHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztDQUFPLE1BQU1BLE1BQU0sR0FBSUMsWUFBRCxJQUFrQjtDQUN2QyxNQUFJQyxLQUFLLEdBQUcsT0FBT0QsWUFBbkI7Q0FDQSxTQUFPQyxLQUFLLElBQUksUUFBVCxHQUFvQixJQUFwQixHQUEyQixLQUFsQztDQUNBLENBSE07O0NDRVAsTUFBTUMsS0FBSyxHQUFJLFVBQVVDLFdBQVYsRUFBdUJDLE1BQXZCLEVBQStCO0NBQzdDLE1BQUlDLFFBQVEsR0FBR04sTUFBTSxDQUFDSSxXQUFELENBQU4sR0FBc0JBLFdBQXRCLEdBQW9DRyxRQUFRLENBQUNDLGFBQVQsQ0FBdUJKLFdBQXZCLENBQW5EO0NBQ0FF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
