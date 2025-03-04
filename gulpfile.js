const gulp = require('gulp');


// Tasks
require('./gulp/dev');
require('./gulp/docs');

// Запуск всей сборки
gulp.task('default',
  gulp.series('clean:dev',
    gulp.parallel(
      'html:dev',
      'sass:dev',
      'images:dev',
      'icons:dev',
      'fonts:dev',
      'files:dev',
      'js:dev'),
    gulp.parallel('server:dev', 'watch:dev')
));

  gulp.task('docs',
  gulp.series('clean:docs',
    gulp.parallel(
      'html:docs',
      'sass:docs',
      'images:docs',
      'icons:docs',
      'fonts:docs',
      'files:docs',
      'js:docs'),
    gulp.parallel('server:docs')
));