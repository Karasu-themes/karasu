/*!
* Utils - karasu-dev @ v0.1.12
* Copyright 2020 © Karasu themes
* Developed by Marcelo (github.com/MarceloTLD)
* MIT License
*/

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

export { utils }