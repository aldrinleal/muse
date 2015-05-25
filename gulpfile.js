'use strict';

var gulp = require('gulp'),
    debug = require('gulp-debug'),
    inject = require('gulp-inject'),
    tsc = require('gulp-typescript'),
    tslint = require('gulp-tslint'),
    sourcemaps = require('gulp-sourcemaps'),
    del = require('del');

/**
 * Generates the ts.d.ts references file dynamically from all application *.ts files.
 */
gulp.task('gen-ts-refs', function () {
    var target = gulp.src(__dirname + '/build/js');
    var sources = gulp.src([ __dirname + '/src/ts/**/*.ts '], {read: false});
    return target.pipe(inject(sources, {
        starttag: '//{',
        endtag: '//}',
        transform: function (filepath) {
            return '/// <reference path="../..' + filepath + '" />';
        }
    })).pipe(gulp.dest('typings/all.d.ts'));
});

/**
 * Lint all custom TypeScript files.
 */
gulp.task('ts-lint', function () {
    return gulp.src(__dirname + '/src/ts/**/*.ts').pipe(tslint()).pipe(tslint.report('prose'));
});

/**
 * Compile TypeScript and include references to library and ts .d.ts files.
 */
gulp.task('compile-ts', function () {
    var sourceTsFiles = [ __dirname + '/src/ts/**/*.ts',                //path to typescript files
        __dirname + '/typings/**/*.d.ts', //reference to library .d.ts files
        __dirname + '/typings/typescriptApp.d.ts'
    ];     //reference to ts.d.ts files

    var tsResult = gulp.src(sourceTsFiles)
        .pipe(sourcemaps.init())
        .pipe(tsc({
            target: 'ES6',
            declarationFiles: false,
            noExternalResolve: true,
            module: "commonjs",
        }));

    tsResult.dts.pipe(gulp.dest(__dirname + '/build/release'));

    return tsResult.js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(__dirname + '/build/release'));
});

/**
 * Remove all generated JavaScript files from TypeScript compilation.
 */
gulp.task('clean-ts', function (cb) {
    var typeScriptGenFiles = [
        __dirname + '/build/release/**/*.js',    // path to all JS files auto gen'd by editor
        __dirname + '/build/release/**/*.js.map' // path to all sourcemap files auto gen'd by editor
    ];

    // delete the files
    del(typeScriptGenFiles, cb);
});

gulp.task('watch', function () {
    gulp.watch([ __dirname + '/src/ts/**/*.ts' ], ['ts-lint', 'compile-ts', 'gen-ts-refs']);
});

gulp.task('default', ['ts-lint', 'compile-ts', 'gen-ts-refs', 'watch']);

gulp.task('build', ['ts-lint', 'compile-ts', 'gen-ts-refs']);