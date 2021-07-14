import { each } from "../utils/each"
import { click } from "../utils/click"
import { css } from "../utils/css"
import { query, queryAll } from "../utils/dom"

const collapsible = (() => {

  let trigger = queryAll('.collapsible-trigger');

  if (!trigger.length) return false;
  

  each(trigger, (i, el) => {
    const body = query('.collapsible-content', el.parentNode);

    click(el, ()=>{

      if (!css.has(el, 'is-active')) {
        css.clean(trigger.map(el=>query('.collapsible-content', el.parentNode)), 'is-active');
        css.clean(trigger, 'is-active');
        css.add(body, 'is-active');
        css.add(el, 'is-active');
      } else {
        css.remove(body, 'is-active');
        css.remove(el, 'is-active');
      }
    });

  })

})();

export { collapsible }