import { each } from '../utils/each';
import { click } from '../utils/click';
import { css } from '../utils/css';

const _COLLAPSE = (() => {

  let trigger = document.querySelectorAll('.collapse-trigger'),
    tabs = document.querySelectorAll('.collapse');

  each( trigger, (i, el) => {
    let self = el;
    let content = self.parentNode.querySelector('.collapse-content'),
      isCollapsible = css.has(self.parentNode, 'is-collapsible');

      // console.log(isCollapsible)

    click(self, () => {
      if (isCollapsible) {

        const isActive = css.has(el, 'is-active');
        
        if (!isActive) {
          each(tabs, (index, element) => {
            css.remove(element.querySelector('.collapse-trigger'), 'is-active');
            css.remove(element.querySelector('.collapse-content'), 'is-active');
          })
        }


        
        css.toggle(self, 'is-active');
        css.toggle(content, 'is-active');
        
      } else {
        css.toggle(self, 'is-active');
        css.toggle(content, 'is-active');
      }
    })
  });

})();

export { _COLLAPSE as collapse };