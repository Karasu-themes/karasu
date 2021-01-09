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
	babel = require('rollup-plugin-babel');


// Basic config
const config = {
	path: {
		css: {
			watch: './source/scss/**/*.scss',
			dest: './dest/css'
		},
		js: {
			watch: './source/js/**/*.js',
			dest: './dest/js'
		}
	}
}

const css = (pathName) => {
	return src(pathName)
	.pipe(sass.sync({outputStyle: 'concat'}).on('error', sass.logError))
	.pipe(dest(config.path['css'].dest))
	.pipe(rename({suffix: '.min'}))
	.pipe(minify({compatibility: 'ie8'}))
	.pipe(dest(config.path['css'].dest))
}

const printLicense = (name) => {
	return `/*!
* ${name}karasu-dev @ v0.1.21
* Copyright 2020 © Karasu themes
* Developed by Marcelo (github.com/MarceloTLD)
* MIT License
*/`
}

const js = (pathName, fileName, output) => {
  return src(pathName + fileName)
    .pipe(sourcemaps.init())
    .pipe(rollup({
      plugins: [babel()]
    }, output))
    .pipe(sourcemaps.write())
    .pipe(dest(config.path['js'].dest))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(dest(config.path['js'].dest))
}

// Build para css
const cssLayoutBuild = () => css('./source/scss/layout.scss');
const cssComponentBuild = () => css('./source/scss/component.scss');
const cssHelperBuild = () => css('./source/scss/helper.scss');
const cssKarasuBuild = () => css('./source/scss/karasu-dev.scss');

// Build para javascript
const jsBuild = () => js('./source/js/', 'karasu-dev.js', {name: 'raven', format: 'iife', banner: printLicense('')});
const jsUtils = () => js('./source/js/utils/', 'utils.js', {name: 'utils', format: 'iife', banner: printLicense('Utils - ')});
const jsComponent = () => js('./source/js/components/', 'component.js', {name: 'components', format: 'iife', banner: printLicense('Components - ')});


// Tareas para los estilos css
exports.karasu = cssKarasuBuild;
exports.layout = cssLayoutBuild;
exports.helper = cssKarasuBuild;
exports.component = cssComponentBuild;
exports.cssBuild = series( cssKarasuBuild,  cssLayoutBuild, cssComponentBuild);


// Tareas para JS
exports.js = jsBuild;
exports.jsBuild = series( jsBuild,  jsComponent, jsUtils);
exports.jsComponent = jsComponent;
exports.jsUtils = jsUtils;

// Monitorear todas las tareas en tiempo real
exports.dev = () => {
	watch([config.path['css'].watch], series(cssLayoutBuild));
	watch([config.path['css'].watch], series(cssComponentBuild));
	watch([config.path['css'].watch], series(cssHelperBuild));
	watch([config.path['css'].watch], series(cssKarasuBuild));
	watch([config.path['js'].watch], series(jsBuild));
	watch([config.path['js'].watch], series(jsUtils));
	watch([config.path['js'].watch], series(jsComponent));
}
