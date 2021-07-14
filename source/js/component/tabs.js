import { dom } from '../utils/dom';
import { each } from '../utils/each';
import { css } from '../utils/css';
import { click } from '../utils/click';
import { nodeToArr } from '../utils/helper';


const tabs = (() => {
  let getTabs = dom.queryAll('.cv-tabs');
  
  const selectiveTab = ( indexTab, button, items ) => {
    let getItem = dom.queryAll('.cv-tabs-item', items);

    if (button[indexTab]) {
      css.add(button[indexTab], 'is-active');
      css.add(getItem[indexTab], 'is-active')
    } else { 
      css.add(button[0], 'is-active') 
      css.add(getItem[0], 'is-active')
    }

  }

  each(getTabs, (index, tab) => {

    let indexTab = dom.attr(tab, 'data-selected-index') ? dom.attr(tab, 'data-selected-index') : 0,
      selector = dom.query('.cv-tabs-selector', tab),
    button = dom.queryAll('.cv-tabs-selector button', selector),
    body = dom.query('.cv-tabs-body', tab);

    selectiveTab(indexTab, button, body);

    each(button, (i, btn) => {
      click(btn, () => {

        let hash = dom.attr(btn, 'data-id'),
        item = nodeToArr(body.children),
        index = item.findIndex( current => {
          return dom.attr(current, 'id') === hash;
        })
        

        css.clean(button, 'is-active');
        css.add(btn, 'is-active');

        css.clean(item, 'is-active');
        css.add(item[index], 'is-active');
      })
      
    })

  });
})();

export { tabs }