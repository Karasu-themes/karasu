// Karasu.component
import { tab } from './component/tabs';
import { collapse } from './component/collapse';
import { dropdown } from './component/dropdown';
import { modal } from './component/modal';

// Karasu.utils
import { click, toggle, clickEach } from './utils/click';
import { css } from './utils/css';
import { each } from './utils/each';
import { merge } from './utils/merge';
import { format } from './utils/format';
import { parser } from './utils/parser';
import { ls } from './utils/lscrud';

// component
const component = {
  tab,
  collapse,
  dropdown,
  modal
}

// utils
const utils = {
  click,
  toggle,
  clickEach,
  css,
  each,
  merge,
  format,
  parser,
  ls
}

export {
  component,
  utils
}