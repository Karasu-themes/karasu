import { each } from '../utils/each';
import { click } from '../utils/click';
import { css } from '../utils/css';

const _TAB = (() => {

  const tabs = document.querySelectorAll('.tab');
  
  each(tabs, (i, tabItem) => {
    let tabTrigger = tabItem.querySelectorAll('.tab-select-item'),
      tabContent = tabItem.querySelectorAll('.tab-item');

    each(tabTrigger, (index, item) => {
      let getHash = item.getAttribute('data-id'),
        currentItem = tabItem.querySelector('#'+getHash);

      click(item, (e)=> {
        // Clean all select
        css.clean(tabTrigger, 'is-active');
        css.clean(tabContent, 'is-active');

        // Active current item
        css.add(item, 'is-active');
        css.add(currentItem, 'is-active');
      })

    })

  })

})();

export { _TAB as tab }