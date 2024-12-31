const gulp = require('gulp');
const fileInclude = require('gulp-file-include');

const sass = require('gulp-sass')(require('sass'));
const sassGlob = require('gulp-sass-glob');

const server = require('gulp-server-livereload');
const clean = require('gulp-clean');
const fs = require('fs');
const sourceMaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const webpack = require('webpack-stream');
const imagemin = require('gulp-imagemin');
const changed = require('gulp-changed');


// Обработка CLEAN
gulp.task('clean:dev', (done) => {
  if (fs.existsSync('./build/')) {
    return gulp
      .src('./build', { read: false })
      .pipe(clean({ force: true }))
  }
  done();
});

// Обработка INCLUDE
const fileIncludeSetting = {
  prefix: '@@',
  basepath: '@file',
};


const plumberNotify = (title) => {
  return {
    errorHandler: notify.onError({
      title: title,
      message: 'Error <%= error.message %>',
      sound: false
    }),
  }
};

// Обработка HTML
gulp.task('html:dev', () => {
  return gulp
    .src(['./src/html/**/*.html', '!src/html/blocks/*.html'])
    .pipe(changed('./build/', {hasChanged: changed.compareContents}))
    .pipe(plumber(plumberNotify('HTML')))
    .pipe(fileInclude(fileIncludeSetting))
    .pipe(gulp.dest('.//build'));
});

// Обработка SASS
gulp.task('sass:dev', () => {
  return gulp
    .src('./src/scss/*.scss')
    .pipe(changed('./build/css/'))
    .pipe(plumber(plumberNotify('Scss')))
    .pipe(sourceMaps.init())
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(sourceMaps.write())
    .pipe(gulp.dest('./build/css/'));
});

// Обработка JS
gulp.task('js:dev', () => {
  return gulp
    .src('./src/js/*.js')
    .pipe(changed('./build/js/'))
    .pipe(plumber(plumberNotify('JS')))
    .pipe(webpack(require('./../webpack.config')))
    .pipe(gulp.dest('./build/js'));
});

// Обработка ICONS
gulp.task('icons:dev', () => {
  return gulp
    .src('./src/icons/**/*')
    .pipe(changed('./build/icons/'))
    .pipe(gulp.dest('./build/icons/'));

});


// Обработка IMG
gulp.task('images:dev', () => {
  return gulp
    .src('./src/img/**/*')
    .pipe(changed('./build/img/'))
    .pipe(imagemin({verbose: true}))
    .pipe(gulp.dest('./build/img/'));
});

// Обработка FONTS
gulp.task('fonts:dev', () => {
  return gulp
    .src('./src/fonts/**/*')
    .pipe(changed('./build/fonts/'))
    .pipe(gulp.dest('./build/fonts/'));

});

// Обработка FILES
gulp.task('files:dev', () => {
  return gulp
    .src('./src/files/**/*')
    .pipe(changed('./build/files/'))
    .pipe(gulp.dest('./build/files/'));

});

// Обработка SERVERA
const serverOptions = {
  livereload: true,
  open: true
};

gulp.task('server:dev', () => {
  return gulp
    .src('./build/')
    .pipe(server(serverOptions));
});

// Обработка WATCH
gulp.task('watch:dev', () => {
  gulp.watch('./src/scss/**/*.scss', gulp.parallel('sass:dev'));
  gulp.watch('./src/**/*.html', gulp.parallel('html:dev'));
  gulp.watch('./src/icons/**/*', gulp.parallel('icons:dev'));
  gulp.watch('./src/img/**/*', gulp.parallel('images:dev'));
  gulp.watch('./src/fonts/**/*', gulp.parallel('fonts:dev'));
  gulp.watch('./src/files/**/*', gulp.parallel('files:dev'));
  gulp.watch('./src/js/**/*.js', gulp.parallel('js:dev'));
});


