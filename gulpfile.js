const { src, dest, series, watch  } = require('gulp');
const rename = require('gulp-rename');

// CSS plugin
const minify = require('gulp-clean-css');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');

function _CSS(pathName, output) {
  return src(pathName)
  .pipe(sass.sync({ outputStyle: 'concat' }).on('error', sass.logError))
	.pipe(dest(output))
	.pipe(rename({suffix: '.min'}))
	.pipe(minify({compatibility: 'ie8'}))
	.pipe(dest(output))
}

// CSS builds
const css = {}
css.karasu = () => _CSS('./source/styles/karasu.scss', './dest/css/');
css.format = () => _CSS('./source/styles/karasu.format.scss', './dest/css/');
css.component = () => _CSS('./source/styles/karasu.component.scss', './dest/css/');
css.layout = () => _CSS('./source/styles/karasu.layout.scss', './dest/css/');
css.utils = () => _CSS('./source/styles/karasu.utils.scss', './dest/css/');

// Tasks
exports.css = css.karasu;
exports["css.format"] = css.format;
exports["css.component"] = css.component;
exports["css.layout"] = css.layout;
exports["css.utils"] = css.utils;
exports["css.watch"] = () => {
  watch('./source/styles/**/*.scss', series(css.karasu, css.format, css.component, css.layout, css.utils))
}
