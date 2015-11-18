var gulp = require('gulp');

gulp.task('default', ['html', 'css', 'javascript']);

gulp.task('html', function () {
    return gulp.src('./**/*.html')
        .pipe(gulp.dest('./build'));
});

gulp.task('css', function (){
    return gulp.src('./**/*.css')
      .pipe(gulp.dest('./build'));
});

gulp.task('javascript', function(){
    return gulp.src('./**/*.js')
      .pipe(gulp.dest('./build'));
});
