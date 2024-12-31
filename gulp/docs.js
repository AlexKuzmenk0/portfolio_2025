const gulp = require('gulp');

// HTML
const fileInclude = require('gulp-file-include');
const htmlclean = require('gulp-htmlclean');
const htmlmin = require('gulp-htmlmin');
const webpHTML = require('gulp-webp-html');


// SASS
const sass = require('gulp-sass')(require('sass'));
const sassGlob = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');
const webpCss = require('gulp-webp-css');

const server = require('gulp-server-livereload');
const clean = require('gulp-clean');
const fs = require('fs');
const sourceMaps = require('gulp-sourcemaps');
const groupMedia = require('gulp-group-css-media-queries'); // Соединяеит повтор media
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const webpack = require('webpack-stream');
const changed = require('gulp-changed');

// IMG
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');



// Обработка CLEAN
gulp.task('clean:docs', (done) => {
  if (fs.existsSync('./docs/')) {
    return gulp
      .src('./docs', { read: false })
      .pipe(clean({ force: true }))
  }
  done();
});

// Обработка INCLUDE
const fileIncludeSetting = {
  prefix: '@@',
  basepath: '@file'
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
gulp.task('html:docs', () => {
  return gulp
    .src(['./src/html/**/*.html', '!src/html/blocks/*.html'])
    .pipe(changed('./docs/'))
    .pipe(plumber(plumberNotify('HTML')))
    .pipe(fileInclude(fileIncludeSetting))
    .pipe(webpHTML())
    .pipe(htmlclean())
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('.//docs'));
});

// Обработка SASS
gulp.task('sass:docs', () => {
  return gulp
    .src('./src/scss/*.scss')
    .pipe(changed('./docs/css/'))
    .pipe(plumber(plumberNotify('Scss')))
    .pipe(sourceMaps.init())
    .pipe(autoprefixer())
    .pipe(sassGlob())
    .pipe(webpCss())
    .pipe(groupMedia()) // Соединяеит повтор media
    .pipe(sass())
    .pipe(csso())
    .pipe(sourceMaps.write())
    .pipe(gulp.dest('./docs/css/'));
});

// Обработка JS
gulp.task('js:docs', () => {
  return gulp
    .src('./src/js/*.js')
    .pipe(changed('./docs/js/'))
    .pipe(plumber(plumberNotify('JS')))
    .pipe(webpack(require('./../webpack.config')))
    .pipe(gulp.dest('./docs/js'));
});

// Обработка ICONS
gulp.task('icons:docs', () => {
  return gulp
    .src('./src/icons/**/*')
    .pipe(changed('./docs/icons/'))
    .pipe(gulp.dest('./docs/icons/'));

});


// Обработка IMG
gulp.task('images:docs', () => {
  return gulp
    .src('./src/img/**/*')
    .pipe(changed('./docs/img/'))
    .pipe(webp())
    .pipe(gulp.dest('./docs/img/'))
    .pipe(gulp.src('./src/img/**/*'))
    .pipe(changed('./docs/img/'))
    .pipe(imagemin({verbose: true}))
    .pipe(gulp.dest('./docs/img/'));

});

// Обработка FONTS
gulp.task('fonts:docs', () => {
  return gulp
    .src('./src/fonts/**/*')
    .pipe(changed('./docs/fonts/'))
    .pipe(gulp.dest('./docs/fonts/'));

});

// Обработка FILES
gulp.task('files:docs', () => {
  return gulp
    .src('./src/files/**/*')
    .pipe(changed('./docs/files/'))
    .pipe(gulp.dest('./docs/files/'));

});

// Обработка SERVERA
const serverOptions = {
  livereload: true,
  open: true
};

gulp.task('server:docs', () => {
  return gulp
    .src('./docs/')
    .pipe(server(serverOptions));
});





