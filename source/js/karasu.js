// Karasu.component
import { tabs } from './component/tabs';
import { dropdown } from './component/dropdown';
import { collapsible } from './component/collapsible';

// Karasu.utils
import { click, toggle, clickEach } from './utils/click';
import { css } from './utils/css';
import { dom } from './utils/dom';
import { each } from './utils/each';
import { merge } from './utils/merge';
import { parser } from './utils/parser';
import { ls } from './utils/lscrud';

// component
const component = {
  tabs,
  dropdown,
  collapsible
}

// utils
const utils = {
  click,
  toggle,
  clickEach,
  css,
  dom,
  each,
  merge,
  parser,
  ls
}

export {
  component,
  utils
}