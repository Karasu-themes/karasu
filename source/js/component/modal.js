import { each } from '../utils/each';
import { click } from '../utils/click';
import { css } from '../utils/css';

const _MODAL_TEMPLATE = (modal_headline, modal_content) => {
  let outer = document.createElement('div'),
    inner = document.createElement('div'),
    headline = document.createElement('div'),
    content = document.createElement('div');

  css.add(outer, 'modal-outer'),
  css.add(inner, 'modal'),
  css.add(headline, 'modal-headline'),
  css.add(content, 'modal-content');

  if (modal_headline) {
    headline.innerHTML='<h2>' + modal_headline + '</h2>'
    inner.appendChild(headline);
  }

  content.innerHTML=modal_content;
  inner.appendChild(content);
  outer.appendChild(inner);
  return outer;

}

const _MODAL = (()=>{
  let trigger = document.querySelectorAll('[data-modalID]'),
    body = document.body;

  each(trigger, (i, el) => {
    let self = el;
    let hash = self.getAttribute('data-modalID'),
      getTitle = self.getAttribute('data-headline'),
      getContent = document.getElementById(hash).innerHTML,
      modal = _MODAL_TEMPLATE(getTitle, getContent),
      content = modal.querySelector('.modal');

      click(el, () => {
        body.appendChild(modal);
      })

      click(content, (e) => e.stopPropagation());
      
      click(modal, ()=> {
        modal.remove();
      });

    })

})();

export { _MODAL as modal };