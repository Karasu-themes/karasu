/*!
* Blogger - karasu-dev @ v0.1.12
* Copyright 2020 © Karasu themes
* Developed by Marcelo (github.com/MarceloTLD)
* MIT License
*/

import { createScript } from './module/createScript.js';
import { format } from './module/format.js';
import { parser } from './module/parser.js';

const blogger = {
	"createScript": createScript,
	"format": format,
	"parser": parser
}

export { blogger }