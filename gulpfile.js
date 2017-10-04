var gulp = require('gulp');
var browserSync = require('browser-sync').create();

gulp.task('watch', function () {
    browserSync.init({
        server: {
            baseDir: "./",
            directory: true
        }
    });

    gulp.watch("./**/*.{html,js}").on('change', browserSync.reload);
});