import { each } from '../../utils/module/each';
import { click } from '../../utils/module/click';
import { merge } from '../../utils/module/merge';
import { css } from '../../utils/module/css';

export const snackbar = (config) => {

	// Variables
	let body = document.body,
		trigger = document.querySelectorAll('.snackbar-trigger');

	// Config
	const _OPTION = merge({
		animation: 'ani-fadeInTop',
		dir: 'rt',
		dur: 600
	}, config);


	const snackContainer = (direction) => {
		let container = document.createElement('div');
		css.add(container, direction ? 'is-'+direction : 'is-rb', 'snack-container');
		return container;
	}

	const snackItem = (content, color, animation) => {

		let item = document.createElement('div');
		css.add(item, color ? color : null, 'snack', 'ani', animation);
		item.innerHTML = content;

		setTimeout(() => {
			item.remove();
		}, _OPTION.dur)

		return item;
	}

	each(trigger, (index, el) => {
		let text = el.getAttribute('data-text'),
			dir = el.getAttribute('data-dir'),
			color = el.getAttribute('data-color');

		let container = snackContainer(dir ? dir : _OPTION.dir);
		body.appendChild(container);

		click(el, (e) => {
			e.preventDefault();

			container.appendChild(snackItem(text, "is-" + color, _OPTION.animation))
		})
	});

}