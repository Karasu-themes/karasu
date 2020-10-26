import { click, toggle, clickEach } from './module/click';
import { css } from './module/css';
import { each } from './module/each';
import { merge } from './module/merge';

const utils = {
	"click": click,
	"clickEach": clickEach,
	"toggle": toggle,
	"css": css,
	"each": each,
	"merge": merge
};

global.utils = utils;

export { utils }