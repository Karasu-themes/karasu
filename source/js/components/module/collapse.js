import { each } from '../../utils/module/each';
import { click } from '../../utils/module/click';
import { merge } from '../../utils/module/merge';
import { css } from '../../utils/module/css';

export const collapse = (config) => {
	// Variables
	let collapse = document.querySelectorAll('.collapse-content'),
		trigger = document.querySelectorAll('.collapse-trigger');

	// Config
	const _OPTION = merge({
		animation: {
			name: 'ani-fadeInTop',
			origin: 'mt'
		},
	}, config);

	each(trigger, (index, el) => {
		let self = el,
			parent = el.parentNode,
			parentItem = el.nextElementSibling;
		
		css.add(parentItem, 'ani', 'ani-' + _OPTION.animation.origin);

		click(el, (e) => {

			if (css.has(parent, 'is-collapsible')) {
				css.clean(collapse, 'is-active');
				css.clean(collapse, _OPTION.animation.name);
				css.add(parentItem, 'is-active');
				css.add(parentItem, _OPTION.animation.name);
			} else {
				css.toggle(parentItem, 'is-active');
				css.toggle(parentItem, _OPTION.animation.name);
			}
		})
	});
}