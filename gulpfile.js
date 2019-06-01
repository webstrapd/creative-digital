var gulp = require('gulp'),
    gutil = require('gulp-util'),
    concat = require('gulp-concat'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    gcmq = require('gulp-group-css-media-queries'),
    connect = require('gulp-connect'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    htmlmin = require('gulp-htmlmin'),
    jsonminify = require('gulp-jsonminify');


/*
    Variables
 */

var env,
    jsSources,
    sassSources,
    htmlSources,
    jsonSources,
    outputDir,
    sassStyle;

env = process.env.NODE_ENV || 'development';

if (env === 'development') {
    outputDir = 'builds/development';
    sassStyle = 'expended';
} else {
    outputDir = 'builds/production';
    sassStyle = 'compressed';
}

/*
    Sources

*/

jsSources = [
    'components/scripts/*.js',
    'components/scripts/*/*.js'
];

sassSources = [
    'components/scss/*.scss',
    'components/scss/*/*.scss'
];

htmlSources = [
    'builds/development/*.html'
];

jsonSources = [
    'builds/development/js/*.json'
];

/*
    Tasks
*/

gulp.task('html', function () {
    gulp.src(htmlSources)
        .pipe(gulpif(env === 'production', htmlmin({collapseWhitespace: true})))
        .pipe(gulpif(env === 'production', gulp.dest(outputDir)))
        .pipe(connect.reload())
});

gulp.task('json', function () {
    gulp.src(jsonSources)
        .pipe(gulpif(env === 'production', jsonminify()))
        .pipe(gulpif(env === 'production', gulp.dest(outputDir + '/js')))
        .pipe(connect.reload())
});

gulp.task('js', function () {
    gulp.src(jsSources)
        .pipe(concat('script.js'))
        .pipe(browserify())
        .pipe(gulpif(env === 'production', uglify()))
        .pipe(gulp.dest(outputDir + '/js'))
        .pipe(connect.reload())
});

gulp.task('compass', function () {
    gulp.src(sassSources)
        .pipe(compass({
            sass: 'components/scss',
            css: outputDir + '/css',
            images: 'builds/development/images',
            sourcemap: true,
            style: 'expanded'
        }))
        .on('error', gutil.log)
        .pipe(gcmq())
        .pipe(gulp.dest(outputDir + '/css'))
        .pipe(connect.reload())
});

gulp.task('connect', function () {
    connect.server({
        root: 'builds/development/',
        livereload: true
    })
});

gulp.task('watch', function () {
    gulp.watch(jsSources, ['js']);
    gulp.watch(sassSources, ['compass']);
    gulp.watch(htmlSources, ['html']);
    gulp.watch(jsonSources, ['json']);
});

/*
    Default Task
 */
gulp.task('default', ['compass', 'js', 'connect', 'watch']);