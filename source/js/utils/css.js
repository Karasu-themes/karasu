const _ADD_CLASS_CSS = (element, ...className) => {
	let getClass = [...className];
	for (var i = getClass.length - 1; i >= 0; i--) {
		element.classList.add(getClass[i]);
	}
	
}

const _TOGGLE_CLASS_CSS = (element, className) => {
	element.classList.toggle(className);
}

const _REMOVE_CLASS_CSS = (element, className) => {
	element.classList.remove(className);
	return className
}

const _HAS_CLASS_CSS = (element, className) => {
	const getClassName = element.getAttribute('class');

	if (getClassName) {
		const reg = new RegExp(className, 'g'),
			checkCSS = reg.test(getClassName);
		return checkCSS ? true : false;
	}

	return ''
}

const _CLEAN_ALL_CSS = (array, className)=>{
	for (var i = 0; i < array.length; i++) {
		array[i].classList.remove(className)
	}
}

export const css = {
	"add": _ADD_CLASS_CSS,
	"remove": _REMOVE_CLASS_CSS,
	"has": _HAS_CLASS_CSS,
	"clean": _CLEAN_ALL_CSS,
	"toggle": _TOGGLE_CLASS_CSS
};