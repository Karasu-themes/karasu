import { each } from '../utils/each';
import { click } from '../utils/click';
import { css } from '../utils/css';
import { query, queryAll } from '../utils/dom';

const dropdown = (() => {
  let trigger = queryAll('.cv-dropdown .cv-dropdown-trigger'),
    body = document.body;
  
  each(trigger, (i, btn) => {
    let dbody = btn.parentNode;
    click(btn, (e) => {
      e.stopPropagation();

      css.clean(trigger.map(key=>{
        return key.parentNode
      }), 'is-visible');

      css.add(dbody, 'is-visible');
    });

    click(query('.cv-dropdown-body', dbody), (e) => e.stopPropagation());
    
  });
  
  click(body, () => {
    each(trigger, (i, btn) => {
      let cbtn = btn.parentNode;
      css.remove(cbtn, 'is-visible');
    })
  });

})();

export { dropdown };