import { each } from '../utils/each';
import { click } from '../utils/click';
import { css } from '../utils/css';

const _TAB = (() => {
  const selector = document.querySelectorAll('.tab-select .tab-select-item'),
    selectorContent = document.querySelectorAll('.tab .tab-item');

  each(selector, (index, el) => {
    let self = el;
    click(self, (e) => {
      let getHash = self.getAttribute('data-id'),
        currentItem = document.getElementById(getHash);
      
      // Clean all select
      css.clean(selector, 'is-active');
      css.clean(selectorContent, 'is-active');

      // Active current item
      css.add(self, 'is-active');
      css.add(currentItem, 'is-active');

    })
  });

})();

export { _TAB as tab }