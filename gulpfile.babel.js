import { src, dest, watch, series, parallel } from 'gulp';
import yargs from 'yargs';
import sass from 'gulp-sass';
import cleanCss from 'gulp-clean-css';
import gulpif from 'gulp-if';
import postcss from 'gulp-postcss';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'autoprefixer'; 
import imagemin from 'gulp-imagemin';
import del from 'del';
import webpack from 'webpack-stream';
import browserSync from 'browser-sync';
import info from './package.json';
import zip from 'gulp-zip';
import $ from 'jquery';
const PRODUCTION = yargs.argv.prod;

const server = browserSync.create();
export const serve = done => {
  server.init({
    proxy: "http://localhost:8888"
  });
  done();
};
export const reload = done => {
  server.reload();
  done();
}

export const styles = () => {
	return src('src/sass/bundle.sass')
    .pipe(gulpif(!PRODUCTION, sourcemaps.init()))
		.pipe(sass().on('error', sass.logError))
    .pipe(gulpif(PRODUCTION, postcss([ autoprefixer ])))
		.pipe(gulpif(PRODUCTION, cleanCss({compatibility:'ie8'})))
    .pipe(gulpif(!PRODUCTION, sourcemaps.write()))
    .pipe(dest('dist/css'))
    .pipe(server.stream());
}

export const scripts = () => {
  return src('src/js/bundle.js')
  .pipe(webpack({
    module: {
      rules: [
        {
          test: /\.js$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: []
            }
          }
        }
      ]
    },
    mode: PRODUCTION ? 'production' : 'development',
    devtool: !PRODUCTION ? 'inline-source-map' : false,
    output: {
      filename: 'bundle.js'
    },
    externals: {
      jquery: 'jQuery'
    },
  }))
  .pipe(dest('dist/js'));
}

export const images = () => {
  return src('src/img/**/*.{jpg,jpeg,png,svg,gif}')
    .pipe(gulpif(PRODUCTION, imagemin()))
    .pipe(dest('dist/img'));
}

export const copy = () => {
  return src(['src/**/*','!src/{img,js,sass}','!src/{img,js,sass}/**/*'])
    .pipe(dest('dist'));
}

export const clean = () => del(['dist']);

export const compress = () => {
  return src([
    '**/*',
    '!node_modules{,/**}',
    "!bundled{,/**}",
    "!src{,/**}",
    "!.babelrc",
    "!.gitignore",
    "!gulpfile.babel.js",
    "!package.json",
    "!package-lock.json",
  ])
  .pipe(zip(`${info.name}.zip`))
  .pipe(dest('bundled'));
};

export const watchForChanges = () => {
  watch('src/sass/**/*.sass', styles);
  watch('src/img/**/*.{jpg,jpeg,png,svg,gif}', images);
  watch(['src/**/*','!src/{img,js,sass}','!src/{img,js,sass}/**/*'], copy);
  watch('src/js/**/*.js', series(scripts, reload));
  watch('**/*.html', reload);
}


export const dev = series(clean, parallel(styles, images, copy, scripts), serve, watchForChanges);
export const build = series(clean, parallel(styles, images, copy, scripts), compress);
export default dev;


