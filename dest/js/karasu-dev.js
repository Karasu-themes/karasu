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

	/*!
	* Utils - karasu-dev @ v0.1.12
	* Copyright 2020 © Karasu themes
	* Developed by Marcelo (github.com/MarceloTLD)
	* MIT License
	*/
	const utils = {
	  "click": click,
	  "clickEach": clickEach,
	  "toggle": toggle,
	  "css": css,
	  "each": each,
	  "merge": merge
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

	/*!
	* Component - karasu-dev @ v0.1.12
	* Copyright 2020 © Karasu themes
	* Developed by Marcelo (github.com/MarceloTLD)
	* MIT License
	*/
	const component = {
	  "dropdown": dropdown,
	  "modal": modal,
	  "snackbar": snackbar,
	  "collapse": collapse
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

	/*!
	* Blogger - karasu-dev @ v0.1.12
	* Copyright 2020 © Karasu themes
	* Developed by Marcelo (github.com/MarceloTLD)
	* MIT License
	*/
	const blogger = {
	  "createScript": createScript,
	  "format": format,
	  "parser": parser
	};

	exports.blogger = blogger;
	exports.component = component;
	exports.utils = utils;

	Object.defineProperty(exports, '__esModule', { value: true });

	return exports;

}({}));

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2FyYXN1LWRldi5qcyIsInNvdXJjZXMiOlsic291cmNlL2pzL3V0aWxzL21vZHVsZS9oZWxwZXIuanMiLCJzb3VyY2UvanMvdXRpbHMvbW9kdWxlL2NsaWNrLmpzIiwic291cmNlL2pzL3V0aWxzL21vZHVsZS9jc3MuanMiLCJzb3VyY2UvanMvdXRpbHMvbW9kdWxlL2VhY2guanMiLCJzb3VyY2UvanMvdXRpbHMvbW9kdWxlL21lcmdlLmpzIiwic291cmNlL2pzL3V0aWxzL3V0aWxzLmpzIiwic291cmNlL2pzL2NvbXBvbmVudHMvbW9kdWxlL2Ryb3Bkb3duLmpzIiwic291cmNlL2pzL2NvbXBvbmVudHMvbW9kdWxlL21vZGFsLmpzIiwic291cmNlL2pzL2NvbXBvbmVudHMvbW9kdWxlL3NuYWNrLmpzIiwic291cmNlL2pzL2NvbXBvbmVudHMvbW9kdWxlL2NvbGxhcHNlLmpzIiwic291cmNlL2pzL2NvbXBvbmVudHMvY29tcG9uZW50LmpzIiwic291cmNlL2pzL2Jsb2dnZXIvbW9kdWxlL2NyZWF0ZVNjcmlwdC5qcyIsInNvdXJjZS9qcy9ibG9nZ2VyL21vZHVsZS9mb3JtYXQuanMiLCJzb3VyY2UvanMvYmxvZ2dlci9tb2R1bGUvcGFyc2VyLmpzIiwic291cmNlL2pzL2Jsb2dnZXIvYmxvZ2dlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QgaXNOb2RlID0gKGNoZWNrRWxlbWVudCkgPT4ge1xyXG5cdGxldCBjaGVjayA9IHR5cGVvZiBjaGVja0VsZW1lbnQ7XHJcblx0cmV0dXJuIGNoZWNrID09ICdvYmplY3QnID8gdHJ1ZSA6IGZhbHNlXHJcbn1cclxuIiwiaW1wb3J0IHsgaXNOb2RlIH0gZnJvbSAnLi9oZWxwZXInO1xyXG5cclxuY29uc3QgY2xpY2sgPSAgZnVuY3Rpb24gKG5vZGVFbGVtZW50LCBhY3Rpb24pIHtcclxuXHRsZXQgc2VsZWN0b3IgPSBpc05vZGUobm9kZUVsZW1lbnQpID8gbm9kZUVsZW1lbnQgOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKG5vZGVFbGVtZW50KTtcclxuXHRzZWxlY3Rvci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50PT5hY3Rpb24oZXZlbnQpKTtcclxufVxyXG5cclxuY29uc3QgdG9nZ2xlID0gKG5vZGVFbGVtZW50LCBldmVuLCBvZGQpPT57XHJcblx0bGV0IHNlbGVjdG9yID0gaXNOb2RlKG5vZGVFbGVtZW50KSA/IG5vZGVFbGVtZW50IDogZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihub2RlRWxlbWVudCksXHJcblx0XHRjb250cm9sID0gMDtcclxuXHJcblx0XHRzZWxlY3Rvci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50PT57XHJcblx0XHRcdGlmIChjb250cm9sPT0wKSB7XHJcblx0XHRcdFx0ZXZlbihldmVudCk7XHJcblx0XHRcdFx0Y29udHJvbD0xO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdG9kZChldmVudCk7XHJcblx0XHRcdFx0Y29udHJvbD0wO1xyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG59XHJcblxyXG5jb25zdCBjbGlja0VhY2ggPSAobm9kZUVsZW1lbnRzLCBhY3Rpb24pPT57XHJcblx0bGV0IHNlbGVjdG9yID0gaXNOb2RlKG5vZGVFbGVtZW50KSA/IG5vZGVFbGVtZW50cyA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwobm9kZUVsZW1lbnRzKTtcclxuXHRmb3IgKHZhciBpID0gMDsgaSA8IHNlbGVjdG9yLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRzZWxlY3RvcltpXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGV2ZW50PT5hY3Rpb24oZXZlbnQpKTtcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCB7IGNsaWNrLCB0b2dnbGUsIGNsaWNrRWFjaCB9IiwiY29uc3QgX0FERF9DTEFTU19DU1MgPSAoZWxlbWVudCwgLi4uY2xhc3NOYW1lKSA9PiB7XHJcblx0bGV0IGdldENsYXNzID0gWy4uLmNsYXNzTmFtZV07XHJcblx0Zm9yICh2YXIgaSA9IGdldENsYXNzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcblx0XHRlbGVtZW50LmNsYXNzTGlzdC5hZGQoZ2V0Q2xhc3NbaV0pO1xyXG5cdH1cclxuXHRcclxufVxyXG5cclxuY29uc3QgX1RPR0dMRV9DTEFTU19DU1MgPSAoZWxlbWVudCwgY2xhc3NOYW1lKSA9PiB7XHJcblx0ZWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKGNsYXNzTmFtZSk7XHJcbn1cclxuXHJcbmNvbnN0IF9SRU1PVkVfQ0xBU1NfQ1NTID0gKGVsZW1lbnQsIGNsYXNzTmFtZSkgPT4ge1xyXG5cdGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xyXG5cdHJldHVybiBjbGFzc05hbWVcclxufVxyXG5cclxuY29uc3QgX0hBU19DTEFTU19DU1MgPSAoZWxlbWVudCwgY2xhc3NOYW1lKSA9PiB7XHJcblx0Y29uc3QgZ2V0Q2xhc3NOYW1lID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2NsYXNzJyk7XHJcblxyXG5cdGlmIChnZXRDbGFzc05hbWUpIHtcclxuXHRcdGNvbnN0IHJlZyA9IG5ldyBSZWdFeHAoY2xhc3NOYW1lLCAnZycpLFxyXG5cdFx0XHRjaGVja0NTUyA9IHJlZy50ZXN0KGdldENsYXNzTmFtZSk7XHJcblxyXG5cdFx0cmV0dXJuIGNoZWNrQ1NTID8gdHJ1ZSA6IGZhbHNlO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuICcnXHJcbn1cclxuXHJcbmNvbnN0IF9DTEVBTl9BTExfQ1NTID0gKGFycmF5LCBjbGFzc05hbWUpPT57XHJcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xyXG5cdFx0YXJyYXlbaV0uY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpXHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgY3NzID0ge1xyXG5cdFwiYWRkXCI6IF9BRERfQ0xBU1NfQ1NTLFxyXG5cdFwicmVtb3ZlXCI6IF9SRU1PVkVfQ0xBU1NfQ1NTLFxyXG5cdFwiaGFzXCI6IF9IQVNfQ0xBU1NfQ1NTLFxyXG5cdFwiY2xlYW5cIjogX0NMRUFOX0FMTF9DU1MsXHJcblx0XCJ0b2dnbGVcIjogX1RPR0dMRV9DTEFTU19DU1NcclxufTsiLCJleHBvcnQgY29uc3QgZWFjaCA9IChhcnJheSwgY2FsbGJhY2spPT57XHJcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xyXG5cdFx0Y2FsbGJhY2suY2FsbChhcnJheVtpXSwgaSwgYXJyYXlbaV0pXHJcblx0fVxyXG59IiwiZXhwb3J0IGNvbnN0IG1lcmdlID0gKHNvdXJjZSwgcHJvcGVydGllcykgPT4ge1xyXG5cdHZhciBwcm9wZXJ0eTtcclxuXHRmb3IgKHByb3BlcnR5IGluIHByb3BlcnRpZXMpIHtcclxuXHRcdGlmIChwcm9wZXJ0aWVzLmhhc093blByb3BlcnR5KHByb3BlcnR5KSkge1xyXG5cdFx0XHRzb3VyY2VbcHJvcGVydHldID0gcHJvcGVydGllc1twcm9wZXJ0eV07XHJcblx0XHR9XHJcblx0fVxyXG5cdHJldHVybiBzb3VyY2U7XHJcbn0iLCIvKiFcclxuKiBVdGlscyAtIGthcmFzdS1kZXYgQCB2MC4xLjEyXHJcbiogQ29weXJpZ2h0IDIwMjAgwqkgS2FyYXN1IHRoZW1lc1xyXG4qIERldmVsb3BlZCBieSBNYXJjZWxvIChnaXRodWIuY29tL01hcmNlbG9UTEQpXHJcbiogTUlUIExpY2Vuc2VcclxuKi9cclxuXHJcbmltcG9ydCB7IGNsaWNrLCB0b2dnbGUsIGNsaWNrRWFjaCB9IGZyb20gJy4vbW9kdWxlL2NsaWNrJztcclxuaW1wb3J0IHsgY3NzIH0gZnJvbSAnLi9tb2R1bGUvY3NzJztcclxuaW1wb3J0IHsgZWFjaCB9IGZyb20gJy4vbW9kdWxlL2VhY2gnO1xyXG5pbXBvcnQgeyBtZXJnZSB9IGZyb20gJy4vbW9kdWxlL21lcmdlJztcclxuXHJcbmNvbnN0IHV0aWxzID0ge1xyXG5cdFwiY2xpY2tcIjogY2xpY2ssXHJcblx0XCJjbGlja0VhY2hcIjogY2xpY2tFYWNoLFxyXG5cdFwidG9nZ2xlXCI6IHRvZ2dsZSxcclxuXHRcImNzc1wiOiBjc3MsXHJcblx0XCJlYWNoXCI6IGVhY2gsXHJcblx0XCJtZXJnZVwiOiBtZXJnZVxyXG59O1xyXG5cclxuZXhwb3J0IHsgdXRpbHMgfSIsImltcG9ydCB7IGVhY2ggfSBmcm9tICcuLi8uLi91dGlscy9tb2R1bGUvZWFjaCc7XHJcbmltcG9ydCB7IGNsaWNrIH0gZnJvbSAnLi4vLi4vdXRpbHMvbW9kdWxlL2NsaWNrJztcclxuaW1wb3J0IHsgbWVyZ2UgfSBmcm9tICcuLi8uLi91dGlscy9tb2R1bGUvbWVyZ2UnO1xyXG5pbXBvcnQgeyBjc3MgfSBmcm9tICcuLi8uLi91dGlscy9tb2R1bGUvY3NzJztcclxuXHJcblxyXG5leHBvcnQgY29uc3QgZHJvcGRvd24gPSAoY29uZmlnKSA9PiB7XHJcblx0Ly8gVmFyaWFibGVcclxuXHRsZXQgc2VsZWN0b3IgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZHJvcGRvd24nKTtcclxuXHJcblx0Ly8gQ29uZmlnXHJcblx0Y29uc3QgX09QVElPTiA9IG1lcmdlKHtcclxuXHRcdGFsaWduOiBcInJ0XCIsXHJcblx0XHRhbmltYXRpb246ICdhbmktZmFkZUluU2NhbGUnXHJcblx0fSwgY29uZmlnKTtcclxuXHJcblxyXG5cdC8vIFNldGVhbW9zIGxhIHBvc2ljaW9uIGVuIGJhc2UgYSBsYXMgcHJvcGllZGFkZXMgdG9wIHkgbGVmdCBkZSBjc3NcclxuXHRjb25zdCBzZXRQb3NpdGlvbiA9IGZ1bmN0aW9uIChjb250ZW50LCBwYXJlbnRDb250ZW50LCBhbGlnbikge1xyXG5cclxuXHRcdHN3aXRjaChhbGlnbikge1xyXG5cdFx0XHRjYXNlICdsdCc6XHJcblx0XHRcdFx0Y29udGVudC5zdHlsZS5sZWZ0ID0gMCArICdweCc7XHJcblx0XHRcdFx0Y29udGVudC5zdHlsZS50b3AgPSAwICsgJ3B4JztcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAncnQnOlxyXG5cdFx0XHRcdGNvbnRlbnQuc3R5bGUucmlnaHQgPSAwICsgJ3B4JztcclxuXHRcdFx0XHRjb250ZW50LnN0eWxlLnRvcCA9IDAgKyAncHgnO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdyYic6XHJcblx0XHRcdFx0Y29udGVudC5zdHlsZS5yaWdodCA9IDAgKyAncHgnO1xyXG5cdFx0XHRcdGNvbnRlbnQuc3R5bGUudG9wID0gMTAwICsgJyUnO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdsYic6XHJcblx0XHRcdFx0Y29udGVudC5zdHlsZS5sZWZ0ID0gMCArICdweCc7XHJcblx0XHRcdFx0Y29udGVudC5zdHlsZS50b3AgPSAxMDAgKyAnJSc7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcblxyXG5cdC8qXHJcblx0XHRTZXRlYW1vcyBlbCBvcmlnZW4gZGUgbGEgdHJhbnNmb3JtYWNpb24sIGVzdG8gcGFyYSBwb2RlciBcclxuXHRcdHRlbmVyIHVuYSBhbmltYWNpb24gbWFzIGFjb3JkZSBhIGNhZGEgcG9zaWNpb24uXHJcblx0Ki9cclxuXHJcblx0Y29uc3Qgc2V0T3JpZ2luVHJhbnNmb3JtID0gKGFsaWduKSA9PiB7XHJcblx0XHRzd2l0Y2ggKGFsaWduKSB7XHJcblx0XHRcdGNhc2UgJ2x0JzpcclxuXHRcdFx0XHRyZXR1cm4gJ2FuaS1sdCc7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ3J0JzpcclxuXHRcdFx0XHRyZXR1cm4gJ2FuaS1ydCc7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ3JiJzpcclxuXHRcdFx0XHRyZXR1cm4gJ2FuaS1ydCc7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ2xiJzpcclxuXHRcdFx0XHRyZXR1cm4gJ2FuaS1sdCc7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHJcblx0ZWFjaChzZWxlY3RvciwgKGluZGV4LCBlbCkgPT4ge1xyXG5cdFx0bGV0IHRyaWdnZXIgPSBlbC5xdWVyeVNlbGVjdG9yKCcuZHJvcGRvd24tdHJpZ2dlcicpLFxyXG5cdFx0XHRsaXN0ID0gZWwucXVlcnlTZWxlY3RvcignLmRyb3Bkb3duLWxpc3QnKTtcclxuXHJcblx0XHRjb25zdCBjdXJyZW50QWxpZ24gPSBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtYWxpZ24nKSA/IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1hbGlnbicpIDogZmFsc2U7XHJcblx0XHRjb25zdCBhbGlnbiA9IGN1cnJlbnRBbGlnbiA/IGN1cnJlbnRBbGlnbiA6IF9PUFRJT04uYWxpZ247XHJcblx0XHRcclxuXHRcdC8vIFNldGVhbW9zIGxhIHBvc2ljaW9uIGVuIGVsIGx1Z2FyIGRhZG9cclxuXHRcdHNldFBvc2l0aW9uKGxpc3QsIHRyaWdnZXIsIGFsaWduKTtcclxuXHJcblx0XHQvLyBTZXRlYW1vcyBsYXMgY2xhc2VzIHBhcmEgbW9zdHJhciBsYSBhbmltYWNpb25cclxuXHRcdGNzcy5hZGQobGlzdCwgJ2FuaS0wNXMnLCBzZXRPcmlnaW5UcmFuc2Zvcm0oYWxpZ24pKTtcclxuXHJcblx0XHRjbGljayh0cmlnZ2VyLCAoZSkgPT4ge1xyXG5cdFx0XHQvLyBQcmV2ZW5pbW9zIGV2ZW50b3Mgbm8gZGVzZWFkb3MgKGVubGFjZSwgYm90b25lcywgZXRjKVxyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG5cdFx0XHQvLyBsZXQgY2xlYW5Dc3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZHJvcGRvd24gLmRyb3Bkb3duLWxpc3QnKTtcclxuXHJcblx0XHRcdC8vIGNzcy5jbGVhbihjbGVhbkNzcywgJ2lzLWFjdGl2ZScpO1xyXG5cdFx0XHQvLyBjc3MuY2xlYW4oY2xlYW5Dc3MsIF9PUFRJT04uYW5pbWF0aW9uKTtcclxuXHJcblx0XHRcdGNzcy50b2dnbGUobGlzdCwgJ2lzLWFjdGl2ZScpO1xyXG5cdFx0XHRjc3MudG9nZ2xlKGxpc3QsIF9PUFRJT04uYW5pbWF0aW9uKTtcclxuXHJcblx0XHR9KVxyXG5cdH0pO1xyXG5cclxuXHQvLyBDZXJyYW1vcyBkcm9wZG93biBhY3Rpdm9zXHJcblxyXG5cdGNsaWNrKGRvY3VtZW50LmJvZHksICgpPT57XHJcblx0XHRcclxuXHRcdGVhY2goc2VsZWN0b3IsIChpbmRleCwgZWwpID0+IHtcclxuXHRcdFx0bGV0IGxpc3QgPSBlbC5xdWVyeVNlbGVjdG9yKCcuZHJvcGRvd24tbGlzdCcpO1xyXG5cdFx0XHRjc3MucmVtb3ZlKGxpc3QsICdpcy1hY3RpdmUnKTtcclxuXHRcdFx0Y3NzLnJlbW92ZShsaXN0LCBfT1BUSU9OLmFuaW1hdGlvbik7XHJcblx0XHR9KVxyXG5cdFxyXG5cdH0pO1xyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBlYWNoIH0gZnJvbSAnLi4vLi4vdXRpbHMvbW9kdWxlL2VhY2gnO1xyXG5pbXBvcnQgeyBjbGljayB9IGZyb20gJy4uLy4uL3V0aWxzL21vZHVsZS9jbGljayc7XHJcbmltcG9ydCB7IG1lcmdlIH0gZnJvbSAnLi4vLi4vdXRpbHMvbW9kdWxlL21lcmdlJztcclxuaW1wb3J0IHsgY3NzIH0gZnJvbSAnLi4vLi4vdXRpbHMvbW9kdWxlL2Nzcyc7XHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IG1vZGFsID0gKGNvbmZpZykgPT4ge1xyXG5cclxuXHQvLyBWYXJpYWJsZXNcclxuXHRjb25zdCB0cmlnZ2VyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm1vZGFsLXRyaWdnZXInKTtcclxuXHJcblx0Ly8gQ29uZmlnXHJcblx0Y29uc3QgX09QVElPTiA9IG1lcmdlKHtcclxuXHRcdGFuaW1hdGlvbjogJ2FuaS1mYWRlSW5Ub3AnXHJcblx0fSwgY29uZmlnKTtcclxuXHJcblx0Ly8gQ3JlYW1vcyBodG1sIHBhcmEgbW9zdHJhciBlbCByZW5kZXJcclxuXHRjb25zdCBtb2RhbFJlbmRlciA9IChoZWFkbGluZSwgY29udGVudCwgYW5pbWF0aW9uKSA9PiB7XHJcblxyXG5cdFx0bGV0IG1vZGFsT3V0ZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcclxuXHRcdFx0bW9kYWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSwgXHJcblx0XHRcdG1vZGFsSGVhZGxpbmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcclxuXHRcdFx0bW9kYWxDb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksXHJcblx0XHRcdG1vZGFsQ2xvc2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcblxyXG5cdFx0Ly8gQWdyZWdhbW9zIGxvcyBjc3MgY29ycmVzcG9uZGllbnRlXHJcblx0XHRjc3MuYWRkKG1vZGFsT3V0ZXIsICdtb2RhbC1vdXRlcicsICdkLWZsZXgnLCAnYS1pdGVtLWNlbnRlcicsICdqLWNvbnRlbnQtY2VudGVyJyksXHJcblx0XHRjc3MuYWRkKG1vZGFsLCAnbW9kYWwnLCAoaGVhZGxpbmUgPyBudWxsIDogJ2lzLWNvbXBhY3QnKSwgJ2FuaScsIGFuaW1hdGlvbiksXHJcblx0XHRjc3MuYWRkKG1vZGFsSGVhZGxpbmUsICdtb2RhbC1oZWFkbGluZScpLFxyXG5cdFx0Y3NzLmFkZChtb2RhbENvbnRlbnQsICdtb2RhbC1jb250ZW50JyksXHJcblx0XHRjc3MuYWRkKG1vZGFsQ2xvc2UsICdtb2RhbC1jbG9zZScpO1xyXG5cclxuXHRcdC8vIEluc2VydGFtb3MgZWwgY29udGVuaWRvIGNvcnJlc3BvbmRpZW50ZVxyXG5cdFx0bW9kYWxDbG9zZS5pbm5lckhUTUwgPSAnPGkgY2xhc3NOYW1lPVwiZmFzIGZhLXRpbWVzXCI+PC9pPicsXHJcblx0XHRtb2RhbEhlYWRsaW5lLmlubmVySFRNTCA9IChoZWFkbGluZSA/IGA8c3Bhbj4ke2hlYWRsaW5lfTwvc3Bhbj48c3BhbiBjbGFzcz1cIm1vZGFsLWNsb3NlXCI+PGkgY2xhc3M9XCJmYXMgZmEtdGltZXNcIj48L2k+PC9zcGFuPmAgOiBgPHNwYW4gY2xhc3M9XCJtb2RhbC1jbG9zZVwiPjxpIGNsYXNzPVwiZmFzIGZhLXRpbWVzXCI+PC9pPjwvc3Bhbj5gKSxcclxuXHRcdG1vZGFsQ29udGVudC5pbm5lckhUTUwgPSBjb250ZW50O1xyXG5cclxuXHRcdC8vIEFwaWxhbW9zIHRvZG8sXHJcblx0XHRtb2RhbC5hcHBlbmRDaGlsZChtb2RhbEhlYWRsaW5lKTtcclxuXHRcdG1vZGFsLmFwcGVuZENoaWxkKG1vZGFsQ29udGVudCk7XHJcblx0XHRtb2RhbC5hcHBlbmRDaGlsZChtb2RhbENsb3NlKTtcclxuXHRcdG1vZGFsT3V0ZXIuYXBwZW5kQ2hpbGQobW9kYWwpO1xyXG5cclxuXHRcdC8vIENyZWFtb3MgbGFzIGFjY2lvbmVzIHBhcmEgZWxpbWluYXIgZWwgbW9kYWwgYWN0aXZvXHJcblx0XHRjbGljayhtb2RhbCwgKGUpPT5lLnN0b3BQcm9wYWdhdGlvbigpKTtcclxuXHRcdGNsaWNrKG1vZGFsT3V0ZXIsICgpPT5tb2RhbE91dGVyLnJlbW92ZSgpKTtcclxuXHJcblx0XHQvLyBDcmVhbW9zIGxhIGFjY2lvbiBwYXJhIGVsaW1pbmFyIGVsIG1vZGFsIGFsIHByZXNpb25hciBzb2JyZSBsYSBcIlhcIlxyXG5cdFx0Y2xpY2sobW9kYWxIZWFkbGluZS5xdWVyeVNlbGVjdG9yKCcubW9kYWwtY2xvc2UnKSwgKGUpPT5tb2RhbE91dGVyLnJlbW92ZSgpKTtcclxuXHJcblx0XHRyZXR1cm4gbW9kYWxPdXRlcjtcclxuXHJcblx0fVxyXG5cclxuXHRlYWNoKHRyaWdnZXIsIChpbmRleCwgZWwpID0+IHtcclxuXHJcblx0XHRsZXQgYm9keSA9IGRvY3VtZW50LmJvZHksXHJcblx0XHRcdGhhc2ggPSBlbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtY29udGVudCcpLFxyXG5cdFx0XHRjb250ZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaGFzaCkuaW5uZXJIVE1MLFxyXG5cdFx0XHR0aXRsZSA9IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1oZWFkbGluZScpO1xyXG5cclxuXHRcdGNsaWNrKGVsLCAoZSkgPT4ge1xyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0XHRsZXQgbW9kYWxIVE1MID0gbW9kYWxSZW5kZXIodGl0bGUgPyB0aXRsZSA6ICcnLCBjb250ZW50LCBfT1BUSU9OLmFuaW1hdGlvbiksXHJcblx0XHRcdFx0Y2xvc2VNb2RhbCA9IG1vZGFsSFRNTDtcclxuXHJcblx0XHRcdGJvZHkuYXBwZW5kQ2hpbGQobW9kYWxIVE1MKTtcclxuXHJcblx0XHR9KVxyXG5cclxuXHR9KTtcclxuXHJcbn07IiwiaW1wb3J0IHsgZWFjaCB9IGZyb20gJy4uLy4uL3V0aWxzL21vZHVsZS9lYWNoJztcclxuaW1wb3J0IHsgY2xpY2sgfSBmcm9tICcuLi8uLi91dGlscy9tb2R1bGUvY2xpY2snO1xyXG5pbXBvcnQgeyBtZXJnZSB9IGZyb20gJy4uLy4uL3V0aWxzL21vZHVsZS9tZXJnZSc7XHJcbmltcG9ydCB7IGNzcyB9IGZyb20gJy4uLy4uL3V0aWxzL21vZHVsZS9jc3MnO1xyXG5cclxuZXhwb3J0IGNvbnN0IHNuYWNrYmFyID0gKGNvbmZpZykgPT4ge1xyXG5cclxuXHQvLyBWYXJpYWJsZXNcclxuXHRsZXQgYm9keSA9IGRvY3VtZW50LmJvZHksXHJcblx0XHR0cmlnZ2VyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnNuYWNrYmFyLXRyaWdnZXInKTtcclxuXHJcblx0Ly8gQ29uZmlnXHJcblx0Y29uc3QgX09QVElPTiA9IG1lcmdlKHtcclxuXHRcdGFuaW1hdGlvbjogJ2FuaS1mYWRlSW5Ub3AnLFxyXG5cdFx0ZGlyOiAncnQnLFxyXG5cdFx0ZHVyOiA2MDBcclxuXHR9LCBjb25maWcpO1xyXG5cclxuXHJcblx0Y29uc3Qgc25hY2tDb250YWluZXIgPSAoZGlyZWN0aW9uKSA9PiB7XHJcblx0XHRsZXQgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblx0XHRjc3MuYWRkKGNvbnRhaW5lciwgZGlyZWN0aW9uID8gJ2lzLScrZGlyZWN0aW9uIDogJ2lzLXJiJywgJ3NuYWNrLWNvbnRhaW5lcicpO1xyXG5cdFx0cmV0dXJuIGNvbnRhaW5lcjtcclxuXHR9XHJcblxyXG5cdGNvbnN0IHNuYWNrSXRlbSA9IChjb250ZW50LCBjb2xvciwgYW5pbWF0aW9uKSA9PiB7XHJcblxyXG5cdFx0bGV0IGl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHRcdGNzcy5hZGQoaXRlbSwgY29sb3IgPyBjb2xvciA6IG51bGwsICdzbmFjaycsICdhbmknLCBhbmltYXRpb24pO1xyXG5cdFx0aXRlbS5pbm5lckhUTUwgPSBjb250ZW50O1xyXG5cclxuXHRcdHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0XHRpdGVtLnJlbW92ZSgpO1xyXG5cdFx0fSwgX09QVElPTi5kdXIpXHJcblxyXG5cdFx0cmV0dXJuIGl0ZW07XHJcblx0fVxyXG5cclxuXHRlYWNoKHRyaWdnZXIsIChpbmRleCwgZWwpID0+IHtcclxuXHRcdGxldCB0ZXh0ID0gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLXRleHQnKSxcclxuXHRcdFx0ZGlyID0gZWwuZ2V0QXR0cmlidXRlKCdkYXRhLWRpcicpLFxyXG5cdFx0XHRjb2xvciA9IGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1jb2xvcicpO1xyXG5cclxuXHRcdGxldCBjb250YWluZXIgPSBzbmFja0NvbnRhaW5lcihkaXIgPyBkaXIgOiBfT1BUSU9OLmRpcik7XHJcblx0XHRib2R5LmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XHJcblxyXG5cdFx0Y2xpY2soZWwsIChlKSA9PiB7XHJcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0XHRcdGNvbnRhaW5lci5hcHBlbmRDaGlsZChzbmFja0l0ZW0odGV4dCwgXCJpcy1cIiArIGNvbG9yLCBfT1BUSU9OLmFuaW1hdGlvbikpXHJcblx0XHR9KVxyXG5cdH0pO1xyXG5cclxufSIsImltcG9ydCB7IGVhY2ggfSBmcm9tICcuLi8uLi91dGlscy9tb2R1bGUvZWFjaCc7XG5pbXBvcnQgeyBjbGljayB9IGZyb20gJy4uLy4uL3V0aWxzL21vZHVsZS9jbGljayc7XG5pbXBvcnQgeyBtZXJnZSB9IGZyb20gJy4uLy4uL3V0aWxzL21vZHVsZS9tZXJnZSc7XG5pbXBvcnQgeyBjc3MgfSBmcm9tICcuLi8uLi91dGlscy9tb2R1bGUvY3NzJztcblxuZXhwb3J0IGNvbnN0IGNvbGxhcHNlID0gKGNvbmZpZykgPT4ge1xuXHQvLyBWYXJpYWJsZXNcblx0bGV0IGNvbGxhcHNlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNvbGxhcHNlLWNvbnRlbnQnKSxcblx0XHR0cmlnZ2VyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNvbGxhcHNlLXRyaWdnZXInKTtcblxuXHQvLyBDb25maWdcblx0Y29uc3QgX09QVElPTiA9IG1lcmdlKHtcblx0XHRhbmltYXRpb246IHtcblx0XHRcdG5hbWU6ICdhbmktZmFkZUluVG9wJyxcblx0XHRcdG9yaWdpbjogJ210J1xuXHRcdH0sXG5cdH0sIGNvbmZpZyk7XG5cblx0ZWFjaCh0cmlnZ2VyLCAoaW5kZXgsIGVsKSA9PiB7XG5cdFx0bGV0IHNlbGYgPSBlbCxcblx0XHRcdHBhcmVudCA9IGVsLnBhcmVudE5vZGUsXG5cdFx0XHRwYXJlbnRJdGVtID0gZWwubmV4dEVsZW1lbnRTaWJsaW5nO1xuXHRcdFxuXHRcdGNzcy5hZGQocGFyZW50SXRlbSwgJ2FuaScsICdhbmktJyArIF9PUFRJT04uYW5pbWF0aW9uLm9yaWdpbik7XG5cblx0XHRjbGljayhlbCwgKGUpID0+IHtcblxuXHRcdFx0aWYgKGNzcy5oYXMocGFyZW50LCAnaXMtY29sbGFwc2libGUnKSkge1xuXHRcdFx0XHRjc3MuY2xlYW4oY29sbGFwc2UsICdpcy1hY3RpdmUnKTtcblx0XHRcdFx0Y3NzLmNsZWFuKGNvbGxhcHNlLCBfT1BUSU9OLmFuaW1hdGlvbi5uYW1lKTtcblx0XHRcdFx0Y3NzLmFkZChwYXJlbnRJdGVtLCAnaXMtYWN0aXZlJyk7XG5cdFx0XHRcdGNzcy5hZGQocGFyZW50SXRlbSwgX09QVElPTi5hbmltYXRpb24ubmFtZSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjc3MudG9nZ2xlKHBhcmVudEl0ZW0sICdpcy1hY3RpdmUnKTtcblx0XHRcdFx0Y3NzLnRvZ2dsZShwYXJlbnRJdGVtLCBfT1BUSU9OLmFuaW1hdGlvbi5uYW1lKTtcblx0XHRcdH1cblx0XHR9KVxuXHR9KTtcbn0iLCIvKiFcclxuKiBDb21wb25lbnQgLSBrYXJhc3UtZGV2IEAgdjAuMS4xMlxyXG4qIENvcHlyaWdodCAyMDIwIMKpIEthcmFzdSB0aGVtZXNcclxuKiBEZXZlbG9wZWQgYnkgTWFyY2VsbyAoZ2l0aHViLmNvbS9NYXJjZWxvVExEKVxyXG4qIE1JVCBMaWNlbnNlXHJcbiovXHJcblxyXG5pbXBvcnQgeyBkcm9wZG93biB9IGZyb20gJy4vbW9kdWxlL2Ryb3Bkb3duLmpzJztcclxuaW1wb3J0IHsgbW9kYWwgfSBmcm9tICcuL21vZHVsZS9tb2RhbC5qcyc7XHJcbmltcG9ydCB7IHNuYWNrYmFyIH0gZnJvbSAnLi9tb2R1bGUvc25hY2suanMnO1xyXG5pbXBvcnQgeyBjb2xsYXBzZSB9IGZyb20gJy4vbW9kdWxlL2NvbGxhcHNlLmpzJztcclxuXHJcbmNvbnN0IGNvbXBvbmVudCA9IHtcclxuXHRcImRyb3Bkb3duXCI6IGRyb3Bkb3duLFxyXG5cdFwibW9kYWxcIjogbW9kYWwsXHJcblx0XCJzbmFja2JhclwiOiBzbmFja2JhcixcclxuXHRcImNvbGxhcHNlXCI6IGNvbGxhcHNlXHJcbn07XHJcblxyXG5leHBvcnQgeyBjb21wb25lbnQgfSIsImNvbnN0IGNyZWF0ZVNjcmlwdCA9IChob21lVVJMLCBhdHRyaWJ1dGVzKSA9PiB7XHJcblxyXG5cdGxldCBzY3JwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xyXG5cdHNjcnB0LnNyYyA9IGAke2hvbWVVUkx9L2ZlZWRzL3Bvc3RzLyR7YXR0cmlidXRlc31gO1xyXG5cclxuXHRyZXR1cm4gc2NycHQ7XHJcblxyXG59XHJcblxyXG5leHBvcnQgeyBjcmVhdGVTY3JpcHQgfSIsImNvbnN0IGZvcm1hdCA9IChkYXRhLCBjb25maWcpID0+IHtcclxuXHJcblx0ZnVuY3Rpb24gZ2V0SUQoaWQpIHtcclxuXHRcdGxldCBnZXRJRCA9IGlkLm1hdGNoKC9wb3N0LVxcZHsxLH0vZylbMF07XHJcblx0XHRyZXR1cm4gZ2V0SUQucmVwbGFjZSgncG9zdC0nLCAnJyk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBnZXRMaW5rKGxpbmspIHtcclxuXHRcdGxldCBnZXRMaW5rID0gbGluayxcclxuXHRcdFx0cmVzdWx0ID0gXCJcIjtcclxuXHRcdFxyXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBnZXRMaW5rLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGlmIChnZXRMaW5rW2ldLnJlbCA9PSAnYWx0ZXJuYXRlJykge1xyXG5cdFx0XHRcdHJlc3VsdCA9IGdldExpbmtbaV0uaHJlZjtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiByZXN1bHQ7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBjbGVhbkhUTUwgKGh0bWwpIHtcclxuXHRcdHJldHVybiBodG1sLnJlcGxhY2UoLzxbXj5dKj4/L2csICcnKVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc3VtbWFyeSAoY29udGVudCkge1xyXG5cdFx0cmV0dXJuIGNvbmZpZy5zdW1tYXJ5ID8gY2xlYW5IVE1MKGNvbnRlbnQpLnN1YnN0cigwLCBjb25maWcuc3VtbWFyeSkgOiBjbGVhbkhUTUwoY29udGVudCkuc3Vic3RyKDAsIDEwMClcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldFRodW1ibmFpbCAoY29udGVudCkge1xyXG5cdFx0bGV0IHRlbXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHRcdHRlbXAuaW5uZXJIVE1MPWNvbnRlbnQ7XHJcblxyXG5cdFx0bGV0IGdldEltYWdlID0gdGVtcC5xdWVyeVNlbGVjdG9yKCdpbWcnKTtcclxuXHJcblx0XHRyZXR1cm4gZ2V0SW1hZ2UgPyBnZXRJbWFnZS5nZXRBdHRyaWJ1dGUoJ3NyYycpIDogXCJcIjtcclxuXHR9XHJcblxyXG5cdGNvbnN0IGNvbnRlbnQgPSBkYXRhLmNvbnRlbnQgPyBkYXRhLmNvbnRlbnQuJHQgOiBkYXRhLnN1bW1hcnkuJHQ7XHJcblx0XHJcblx0cmV0dXJuIHtcclxuXHRcdGlkOiBnZXRJRChkYXRhLmlkLiR0KSxcclxuXHRcdHRpdGxlOiBkYXRhLnRpdGxlID8gZGF0YS50aXRsZS4kdCA6ICdObyB0aXRsZScsXHJcblx0XHR0aHVtYm5haWw6IGRhdGEubWVkaWEkdGh1bWJuYWlsID8gZGF0YS5tZWRpYSR0aHVtYm5haWwudXJsLnJlcGxhY2UoL3NcXEJcXGR7Miw0fS1jLywgY29uZmlnLmltZyA/IGNvbmZpZy5pbWcgOiAnczIwMCcpIDogZ2V0VGh1bWJuYWlsLFxyXG5cdFx0bGFiZWw6IGRhdGEuY2F0ZWdvcnkgPyBkYXRhLmNhdGVnb3J5Lm1hcChlbD0+ZWwudGVybSkgOiAnJyxcclxuXHRcdGxpbms6IGdldExpbmsoZGF0YS5saW5rKSxcclxuXHRcdGNvbnRlbnQ6IGNvbnRlbnQsXHJcblx0XHRzdW1tYXJ5OiBzdW1tYXJ5KGNvbnRlbnQpLFxyXG5cdFx0cHVibGlzaGVkOiBkYXRhLnB1Ymxpc2hlZC4kdCxcclxuXHRcdHVwZGF0ZTogZGF0YS51cGRhdGVkLiR0XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgeyBmb3JtYXQgfSIsImNvbnN0IHBhcnNlciA9IChqc29uLCBodG1sKSA9PiB7XHJcblx0cmV0dXJuIGh0bWwucmVwbGFjZSgvXFx7XFx3K1xcfS9nLCB2YWx1ZT0+e1xyXG5cdFx0bGV0IG9iak5hbWUgPSB2YWx1ZS5yZXBsYWNlKC97fH0vZywgJycpO1xyXG5cdFx0cmV0dXJuIGpzb25bb2JqTmFtZV07XHJcblx0fSlcclxufVxyXG5cclxuZXhwb3J0IHsgcGFyc2VyIH0iLCIvKiFcclxuKiBCbG9nZ2VyIC0ga2FyYXN1LWRldiBAIHYwLjEuMTJcclxuKiBDb3B5cmlnaHQgMjAyMCDCqSBLYXJhc3UgdGhlbWVzXHJcbiogRGV2ZWxvcGVkIGJ5IE1hcmNlbG8gKGdpdGh1Yi5jb20vTWFyY2Vsb1RMRClcclxuKiBNSVQgTGljZW5zZVxyXG4qL1xyXG5cclxuaW1wb3J0IHsgY3JlYXRlU2NyaXB0IH0gZnJvbSAnLi9tb2R1bGUvY3JlYXRlU2NyaXB0LmpzJztcclxuaW1wb3J0IHsgZm9ybWF0IH0gZnJvbSAnLi9tb2R1bGUvZm9ybWF0LmpzJztcclxuaW1wb3J0IHsgcGFyc2VyIH0gZnJvbSAnLi9tb2R1bGUvcGFyc2VyLmpzJztcclxuXHJcbmNvbnN0IGJsb2dnZXIgPSB7XHJcblx0XCJjcmVhdGVTY3JpcHRcIjogY3JlYXRlU2NyaXB0LFxyXG5cdFwiZm9ybWF0XCI6IGZvcm1hdCxcclxuXHRcInBhcnNlclwiOiBwYXJzZXJcclxufVxyXG5cclxuZXhwb3J0IHsgYmxvZ2dlciB9Il0sIm5hbWVzIjpbImlzTm9kZSIsImNoZWNrRWxlbWVudCIsImNoZWNrIiwiY2xpY2siLCJub2RlRWxlbWVudCIsImFjdGlvbiIsInNlbGVjdG9yIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiYWRkRXZlbnRMaXN0ZW5lciIsImV2ZW50IiwidG9nZ2xlIiwiZXZlbiIsIm9kZCIsImNvbnRyb2wiLCJjbGlja0VhY2giLCJub2RlRWxlbWVudHMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiaSIsImxlbmd0aCIsIl9BRERfQ0xBU1NfQ1NTIiwiZWxlbWVudCIsImNsYXNzTmFtZSIsImdldENsYXNzIiwiY2xhc3NMaXN0IiwiYWRkIiwiX1RPR0dMRV9DTEFTU19DU1MiLCJfUkVNT1ZFX0NMQVNTX0NTUyIsInJlbW92ZSIsIl9IQVNfQ0xBU1NfQ1NTIiwiZ2V0Q2xhc3NOYW1lIiwiZ2V0QXR0cmlidXRlIiwicmVnIiwiUmVnRXhwIiwiY2hlY2tDU1MiLCJ0ZXN0IiwiX0NMRUFOX0FMTF9DU1MiLCJhcnJheSIsImNzcyIsImVhY2giLCJjYWxsYmFjayIsImNhbGwiLCJtZXJnZSIsInNvdXJjZSIsInByb3BlcnRpZXMiLCJwcm9wZXJ0eSIsImhhc093blByb3BlcnR5IiwidXRpbHMiLCJkcm9wZG93biIsImNvbmZpZyIsIl9PUFRJT04iLCJhbGlnbiIsImFuaW1hdGlvbiIsInNldFBvc2l0aW9uIiwiY29udGVudCIsInBhcmVudENvbnRlbnQiLCJzdHlsZSIsImxlZnQiLCJ0b3AiLCJyaWdodCIsInNldE9yaWdpblRyYW5zZm9ybSIsImluZGV4IiwiZWwiLCJ0cmlnZ2VyIiwibGlzdCIsImN1cnJlbnRBbGlnbiIsImUiLCJwcmV2ZW50RGVmYXVsdCIsInN0b3BQcm9wYWdhdGlvbiIsImJvZHkiLCJtb2RhbCIsIm1vZGFsUmVuZGVyIiwiaGVhZGxpbmUiLCJtb2RhbE91dGVyIiwiY3JlYXRlRWxlbWVudCIsIm1vZGFsSGVhZGxpbmUiLCJtb2RhbENvbnRlbnQiLCJtb2RhbENsb3NlIiwiaW5uZXJIVE1MIiwiYXBwZW5kQ2hpbGQiLCJoYXNoIiwiZ2V0RWxlbWVudEJ5SWQiLCJ0aXRsZSIsIm1vZGFsSFRNTCIsInNuYWNrYmFyIiwiZGlyIiwiZHVyIiwic25hY2tDb250YWluZXIiLCJkaXJlY3Rpb24iLCJjb250YWluZXIiLCJzbmFja0l0ZW0iLCJjb2xvciIsIml0ZW0iLCJzZXRUaW1lb3V0IiwidGV4dCIsImNvbGxhcHNlIiwibmFtZSIsIm9yaWdpbiIsInBhcmVudCIsInBhcmVudE5vZGUiLCJwYXJlbnRJdGVtIiwibmV4dEVsZW1lbnRTaWJsaW5nIiwiaGFzIiwiY2xlYW4iLCJjb21wb25lbnQiLCJjcmVhdGVTY3JpcHQiLCJob21lVVJMIiwiYXR0cmlidXRlcyIsInNjcnB0Iiwic3JjIiwiZm9ybWF0IiwiZGF0YSIsImdldElEIiwiaWQiLCJtYXRjaCIsInJlcGxhY2UiLCJnZXRMaW5rIiwibGluayIsInJlc3VsdCIsInJlbCIsImhyZWYiLCJjbGVhbkhUTUwiLCJodG1sIiwic3VtbWFyeSIsInN1YnN0ciIsImdldFRodW1ibmFpbCIsInRlbXAiLCJnZXRJbWFnZSIsIiR0IiwidGh1bWJuYWlsIiwibWVkaWEkdGh1bWJuYWlsIiwidXJsIiwiaW1nIiwibGFiZWwiLCJjYXRlZ29yeSIsIm1hcCIsInRlcm0iLCJwdWJsaXNoZWQiLCJ1cGRhdGUiLCJ1cGRhdGVkIiwicGFyc2VyIiwianNvbiIsInZhbHVlIiwib2JqTmFtZSIsImJsb2dnZXIiXSwibWFwcGluZ3MiOiI7OztDQUFPLE1BQU1BLE1BQU0sR0FBSUMsWUFBRCxJQUFrQjtDQUN2QyxNQUFJQyxLQUFLLEdBQUcsT0FBT0QsWUFBbkI7Q0FDQSxTQUFPQyxLQUFLLElBQUksUUFBVCxHQUFvQixJQUFwQixHQUEyQixLQUFsQztDQUNBLENBSE07O0NDRVAsTUFBTUMsS0FBSyxHQUFJLFVBQVVDLFdBQVYsRUFBdUJDLE1BQXZCLEVBQStCO0NBQzdDLE1BQUlDLFFBQVEsR0FBR04sTUFBTSxDQUFDSSxXQUFELENBQU4sR0FBc0JBLFdBQXRCLEdBQW9DRyxRQUFRLENBQUNDLGFBQVQsQ0FBdUJKLFdBQXZCLENBQW5EO0NBQ0FFLEVBQUFBLFFBQVEsQ0FBQ0csZ0JBQVQsQ0FBMEIsT0FBMUIsRUFBbUNDLEtBQUssSUFBRUwsTUFBTSxDQUFDSyxLQUFELENBQWhEO0NBQ0EsQ0FIRDs7Q0FLQSxNQUFNQyxNQUFNLEdBQUcsQ0FBQ1AsV0FBRCxFQUFjUSxJQUFkLEVBQW9CQyxHQUFwQixLQUEwQjtDQUN4QyxNQUFJUCxRQUFRLEdBQUdOLE1BQU0sQ0FBQ0ksV0FBRCxDQUFOLEdBQXNCQSxXQUF0QixHQUFvQ0csUUFBUSxDQUFDQyxhQUFULENBQXVCSixXQUF2QixDQUFuRDtDQUFBLE1BQ0NVLE9BQU8sR0FBRyxDQURYO0NBR0NSLEVBQUFBLFFBQVEsQ0FBQ0csZ0JBQVQsQ0FBMEIsT0FBMUIsRUFBbUNDLEtBQUssSUFBRTtDQUN6QyxRQUFJSSxPQUFPLElBQUUsQ0FBYixFQUFnQjtDQUNmRixNQUFBQSxJQUFJLENBQUNGLEtBQUQsQ0FBSjtDQUNBSSxNQUFBQSxPQUFPLEdB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
