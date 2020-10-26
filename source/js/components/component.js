import { dropdown } from './module/dropdown.js';
import { modal } from './module/modal.js';
import { snackbar } from './module/snack.js';
import { collapse } from './module/collapse.js';

let raven = {};
raven.component = {
	"dropdown": dropdown,
	"modal": modal,
	"snackbar": snackbar,
	"collapse": collapse
};

global.raven = raven;