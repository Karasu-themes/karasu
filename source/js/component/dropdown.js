import { each } from '../utils/each';
import { click } from '../utils/click';
import { css } from '../utils/css';

// Global variable
let body = document.body,
  dropdown = document.querySelectorAll('.dropdown .dropdown-trigger');

const _get_position = (reference, node) => {
  let data = reference.getBoundingClientRect(),
    obj = {};
    
  obj.left = data.left;
  obj.top = data.top;
  obj.right = data.right - node.scrollWidth;
  obj.bottom = data.bottom;

  return obj;
}

// Set position for dropdown elements
const _set_position = (reference, node) => {
  let pos = _get_position(reference, node), 
    data = reference.getBoundingClientRect();
  node.style.position = 'absolute';
  node.style.left = pos.right + "px";
  node.style.top = data.top  + "px";
}

const _clean_dropdown = (node) => {
  each(node, (i, el) => {
    let content = el.parentNode.querySelector('.dropdown-content');
    css.remove(content, 'is-visible');
  })
}

const _dropdown = (()=>{
  each(dropdown, (index, node) => {
    let content = node.parentNode.querySelector('.dropdown-content');
    
    _set_position(node, content);
    
    click(content, (e)=>e.stopPropagation());

    click(node, (evt) => {
      evt.stopPropagation();
      _clean_dropdown(dropdown)
      css.toggle(content,  'is-visible');
    })

  })
})();

// Close dropdown when clicked outside container
click(body, (e) => {
  _clean_dropdown(dropdown)
})

export { _dropdown as dropdown};