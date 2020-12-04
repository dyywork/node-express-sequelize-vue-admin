
const gulp = require('gulp');
const apidoc = require('gulp-apidoc');

gulp.task('apidoc',function(done){
     console.log(1)
    apidoc({
        src: "service/",
        dest: "doc/",
        debug: true,
        includeFilters: [ ".*\\.js$" ]
    }, done);
});
gulp.task('watch', () => {
    gulp.watch('service/**/*.js',gulp.series('apidoc'));
})
