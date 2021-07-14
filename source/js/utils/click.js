import { isNode } from './helper';

const click =  function (nodeElement, action) {
	let selector = isNode(nodeElement) ? nodeElement : document.querySelector(nodeElement);
	selector.addEventListener('click', event=>action(event));
}

const toggle = (nodeElement, even, odd)=>{
	let selector = isNode(nodeElement) ? nodeElement : document.querySelector(nodeElement),
		control = 0;

		selector.addEventListener('click', event=>{
			if (control==0) {
				even(event);
				control=1;
			} else {
				odd(event);
				control=0;
			}
		})
}

const clickEach = (nodeElements, action)=>{
	let selector = isNode(nodeElement) ? nodeElements : document.querySelectorAll(nodeElements);
	for (var i = 0; i < selector.length; i++) {
		selector[i].addEventListener('click', event=>action(event));
	}
}

export { click, toggle, clickEach }