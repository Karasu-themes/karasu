import { each } from '../../utils/module/each';
import { click } from '../../utils/module/click';
import { merge } from '../../utils/module/merge';
import { css } from '../../utils/module/css';


export const modal = (config) => {

	// Variables
	const trigger = document.querySelectorAll('.modal-trigger');

	// Config
	const _OPTION = merge({
		animation: 'ani-fadeInTop'
	}, config);

	// Creamos html para mostrar el render
	const modalRender = (headline, content, animation) => {

		let modalOuter = document.createElement('div'),
			modal = document.createElement('div'), 
			modalHeadline = document.createElement('div'),
			modalContent = document.createElement('div'),
			modalClose = document.createElement('span');

		// Agregamos los css correspondiente
		css.add(modalOuter, 'modal-outer', 'd-flex', 'a-item-center', 'j-content-center'),
		css.add(modal, 'modal', (headline ? null : 'is-compact'), 'ani', animation),
		css.add(modalHeadline, 'modal-headline'),
		css.add(modalContent, 'modal-content'),
		css.add(modalClose, 'modal-close');

		// Insertamos el contenido correspondiente
		modalClose.innerHTML = '<i className="fas fa-times"></i>',
		modalHeadline.innerHTML = (headline ? `<span>${headline}</span><span class="modal-close"><i class="fas fa-times"></i></span>` : `<span class="modal-close"><i class="fas fa-times"></i></span>`),
		modalContent.innerHTML = content;

		// Apilamos todo,
		modal.appendChild(modalHeadline);
		modal.appendChild(modalContent);
		modal.appendChild(modalClose);
		modalOuter.appendChild(modal);

		// Creamos las acciones para eliminar el modal activo
		click(modal, (e)=>e.stopPropagation());
		click(modalOuter, ()=>modalOuter.remove());

		// Creamos la accion para eliminar el modal al presionar sobre la "X"
		click(modalHeadline.querySelector('.modal-close'), (e)=>modalOuter.remove());

		return modalOuter;

	}

	each(trigger, (index, el) => {

		let body = document.body,
			hash = el.getAttribute('data-content'),
			content = document.getElementById(hash).innerHTML,
			title = el.getAttribute('data-headline');

		click(el, (e) => {
			e.preventDefault();

			let modalHTML = modalRender(title ? title : '', content, _OPTION.animation),
				closeModal = modalHTML;

			body.appendChild(modalHTML);

		})

	});

};