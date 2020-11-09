import { click, toggle, clickEach } from './utils/module/click';
import { css } from './utils/module/css';
import { each } from './utils/module/each';
import { merge } from './utils/module/merge';
import { createScript } from './utils/module/createScript';
import { format } from './utils/module/format';
import { parser } from './utils/module/parser';
import { dropdown } from './components/module/dropdown.js';
import { modal } from './components/module/modal.js';
import { snackbar } from './components/module/snack.js';
import { collapse } from './components/module/collapse.js';

// Utils module
const utils = {
	"click": click,
	"toggle": toggle,
	"clickEach": clickEach,
	"each": each,
	"merge": merge,
	"css": css,
	"blogger": {
		"createScript": createScript,
		"format": format,
		"parser": parser
	}
}

// Components module
const components = {
	"dropdown": dropdown,
	"modal": modal,
	"snackbar": snackbar,
	"collapse": collapse,
}

export { utils, components }