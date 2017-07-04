var gulp = require('gulp'),
    less = require('gulp-less'),
    browserSync = require('browser-sync').create(),
    header = require('gulp-header'),
    cleanCSS = require('gulp-clean-css'),
    rename = require("gulp-rename"),
    uglify = require('gulp-uglify'),
    del = require('del'),
    pkg = require('./package.json');

// Set the banner content
var banner = ['/*!\n',
    ' * Kung-Fu-Panda-Agency - v<%= pkg.version %>\n',
    ' * Copyright 2016-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
    ' */\n',
    ''
].join('');

// Delete folder public before building
gulp.task('clean', function () {
    return del.sync(['public/css', 'public/js', 'public/libs']);
});

// Compile LESS files from /less into /css
gulp.task('less', function () {
    return gulp.src('app/less/agency.less')
        .pipe(less())
        .pipe(header(banner, {pkg: pkg}))
        .pipe(gulp.dest('app/css'))
});

// Minify compiled app CSS
gulp.task('minify-app-css', ['less'], function () {
    return gulp.src('app/css/agency.css')
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('public/css'))
});

// Minify compiled libs CSS
gulp.task('minify-libs-css', function () {
    return gulp.src(['app/libs/**/*.css', '!app/libs/**/*.min.css'])
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('public/libs'))
});

// Minify app JS
gulp.task('minify-app-js', function () {
    return gulp.src(['app/js/*.js', '!app/js/*.min.js'])
        .pipe(uglify())
        .pipe(header(banner, {pkg: pkg}))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('public/js'))
});

// Minify libs JS
gulp.task('minify-libs-js', function(){
    return gulp.src(['app/libs/**/*.js', '!app/libs/**/*.min.js'])
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('public/libs'))
});

// Copy fonts
gulp.task('copy-fonts', function(){
   return gulp.src(['app/libs/fonts/**/*.*', '!app/libs/fonts/**/*.+(css|sass|scss|less)'])
       .pipe(gulp.dest('public/libs/fonts'))
});

// Copy slick folder
gulp.task('copy-slick', function(){
   return gulp.src(['app/libs/slick/**/*.*', '!app/libs/slick/**/*.+(css|js)'])
       .pipe(gulp.dest('public/libs/slick'))
});

// Configure the browserSync task
gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: 'public'
        }
    })
});

// Run everything
gulp.task('default', ['clean', 'copy-slick', 'copy-fonts', 'minify-libs-js', 'minify-app-js', 'minify-libs-css', 'less', 'minify-app-css']);

// Develop task with browserSync
gulp.task('develop', ['clean', 'copy-slick','copy-fonts', 'browserSync', 'minify-libs-js', 'minify-app-js', 'minify-libs-css', 'less', 'minify-app-css'], function () {
    gulp.watch('app/less/*.less', ['less', 'minify-app-css', browserSync.reload]);
    gulp.watch('app/js/*.js', ['minify-app-js', browserSync.reload]);
    gulp.watch('public/*.html', browserSync.reload);
});