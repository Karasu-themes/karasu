import { each } from '../../utils/module/each';
import { click } from '../../utils/module/click';
import { merge } from '../../utils/module/merge';
import { css } from '../../utils/module/css';


export const dropdown = (config) => {
	// Variable
	let selector = document.querySelectorAll('.dropdown');

	// Config
	const _OPTION = merge({
		align: "rt",
		animation: 'ani-fadeInScale'
	}, config);


	// Seteamos la posicion en base a las propiedades top y left de css
	const setPosition = function (content, parentContent, align) {

		switch(align) {
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

	}


	/*
		Seteamos el origen de la transformacion, esto para poder 
		tener una animacion mas acorde a cada posicion.
	*/

	const setOriginTransform = (align) => {
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
	}


	each(selector, (index, el) => {
		let trigger = el.querySelector('.dropdown-trigger'),
			list = el.querySelector('.dropdown-list');

		const currentAlign = el.getAttribute('data-align') ? el.getAttribute('data-align') : false;
		const align = currentAlign ? currentAlign : _OPTION.align;
		
		// Seteamos la posicion en el lugar dado
		setPosition(list, trigger, align);

		// Seteamos las clases para mostrar la animacion
		css.add(list, 'ani-05s', setOriginTransform(align));

		click(trigger, (e) => {
			// Prevenimos eventos no deseados (enlace, botones, etc)
			e.preventDefault();
			e.stopPropagation();

			// let cleanCss = document.querySelectorAll('.dropdown .dropdown-list');

			// css.clean(cleanCss, 'is-active');
			// css.clean(cleanCss, _OPTION.animation);

			css.toggle(list, 'is-active');
			css.toggle(list, _OPTION.animation);

		})
	});

	// Cerramos dropdown activos

	click(document.body, ()=>{
		
		each(selector, (index, el) => {
			let list = el.querySelector('.dropdown-list');
			css.remove(list, 'is-active');
			css.remove(list, _OPTION.animation);
		})
	
	});

}
