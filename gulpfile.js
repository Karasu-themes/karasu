const { src, dest, series, watch  } = require('gulp');
const rename = require('gulp-rename');

// CSS plugin
const minify = require('gulp-clean-css');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');

// JS plugin
const rollup = require('gulp-better-rollup')
	sourcemaps = require('gulp-sourcemaps'),
	uglify = require('gulp-uglify-es').default,
	babel = require('rollup-plugin-babel'),
  cfg = require('./source/js/core/settings'),
  license = require('./source/js/core/license');

function _CSS(pathName, output) {
  return src(pathName)
  .pipe(sass.sync({ outputStyle: 'concat' }).on('error', sass.logError))
	.pipe(dest(output))
	.pipe(rename({suffix: '.min'}))
	.pipe(minify({compatibility: 'ie8'}))
	.pipe(dest(output))
}

function _JS(pathName, fileName, destPath, output) {
  return src(pathName + fileName)
    .pipe(sourcemaps.init())
    .pipe(rollup({
      plugins: [babel()]
    }, output))
    .pipe(sourcemaps.write())
    .pipe(dest(destPath))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(dest(destPath))
}

// CSS builds
const css = {}
css.karasu = () => _CSS('./source/scss/karasu.scss', './dest/css/');
css.format = () => _CSS('./source/scss/karasu.format.scss', './dest/css/');
css.component = () => _CSS('./source/scss/karasu.component.scss', './dest/css/');
css.layout = () => _CSS('./source/scss/karasu.layout.scss', './dest/css/');
css.utils = () => _CSS('./source/scss/karasu.utils.scss', './dest/css/');

// JS builds
const js = {};
js.karasu = () => _JS('./source/js/', 'karasu.js', './dest/js/', {name: 'raven', format: 'iife', banner: license('karasu', cfg.version)});
js.utils = () => _JS('./source/js/', 'karasu.utils.js', './dest/js/', {name: 'utils', format: 'iife', banner: license('karasu@utils', cfg.version)});
js.component = () => _JS('./source/js/', 'karasu.component.js', './dest/js/', {name: 'component', format: 'iife', banner: license('karasu@component', cfg.version)});

// Tasks CSS
exports.css = css.karasu;
exports["css.format"] = css.format;
exports["css.component"] = css.component;
exports["css.layout"] = css.layout;
exports["css.utils"] = css.utils;
exports["css.watch"] = () => {
  watch('./source/scss/**/*.scss', series(css.karasu, css.format, css.component, css.layout, css.utils))
}

// Tasks JS
exports.js = js.karasu;
exports["js.utils"] = js.utils;
exports["js.component"] = js.component;
exports["js.watch"] = () => {
  watch('./source/js/**/*.js', series(js.karasu, js.utils, js.component))
}

// Task dev
exports["dev"]= () => {
  watch(['./source/js/**/*.js', './source/scss/**/*.scss'], series(js.karasu, js.utils, js.component, css.karasu, css.format, css.component, css.layout, css.utils))
}