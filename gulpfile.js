var gulp = require('gulp');

gulp.task('default', ['html', 'css', 'javascript', 'images']);

gulp.task('html', function () {
    gulp.src('*.html')
        .pipe(gulp.dest('./build'));
});

gulp.task('css', function (){
    gulp.src('*.css')
      .pipe(gulp.dest('./build'));
});

gulp.task('javascript', function(){
    gulp.src('*.js')
      .pipe(gulp.dest('./build'));
});

gulp.task('images', function() {
    gulp.src('images/*.jpg')
    .pipe(gulp.dest('./build/images'));
});
