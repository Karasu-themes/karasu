import { click, toggle, clickEach } from './module/click';
import { css } from './module/css';
import { each } from './module/each';
import { merge } from './module/merge';
import { createScript } from './module/createScript';
import { format } from './module/format';
import { parser } from './module/parser';
import { ls } from './module/lscrud';

const blogger = {
	"createScript": createScript,
	"format": format,
	"parser": parser,
}

export { click, toggle, clickEach, css, each, merge, blogger, ls }
