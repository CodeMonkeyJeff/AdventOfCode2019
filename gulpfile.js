/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-var-requires */

"use strict";

const gulp = require("gulp");
const ts = require("gulp-typescript");
const del = require("del");
const eslint = require("gulp-eslint");

function clean() {
    return del(["dist/**/*"]);
}

function lint() {
    return gulp.src("src/**/*.ts")
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
}

function transpilation() {
    const tsGlob = ["src/*.ts"];
    const tsProject = ts.createProject("./tsconfig.json");

    return gulp.src(tsGlob, { base: ".", sourcemaps: true })
        .pipe(tsProject())
        .js.pipe(gulp.dest('dist', { sourcemaps: true }));
}

exports.clean = clean;
exports.build = gulp.series(clean, lint, transpilation);
exports.task = gulp.series(clean, lint, transpilation);