const del = require('delete');
const { exec } = require('child_process');
const tar = require('gulp-tar');
const gzip = require('gulp-gzip');
const toml = require('toml');
const fs = require('fs');
const { src, dest, series, parallel } = require('gulp');
// const gulpCopy = require('gulp-copy');

// const package = require('./package.json');

var cargo_toml = toml.parse(fs.readFileSync('./Cargo.toml'));

function cleanWeb(cb) {
    del(['./target/web'], cb);
}

function clean(cb) {
    del(['./target'], cb);
}

// function copyEnvFiles() {
//     var sourceFiles = ['./log4rs_config.yaml', './config.yaml'];
//     var outputPath = './target/debug';

//     return src(sourceFiles)
//         .pipe(gulpCopy(outputPath));
// }

function npmBuild() {
    return exec('npm run build');
}

function cargoBuild() {
    return exec('cargo build');
}

function package() {
    return src('target/debug/web/**')
        .pipe(src('target/debug/log4rs_config.yaml'))
        .pipe(src('target/debug/config.yaml'))
        .pipe(src('target/debug/' + cargo_toml.package.name))
        .pipe(tar(cargo_toml.package.name + '.tar'))
        .pipe(gzip())
        .pipe(dest('target/release'));
}

function defaultTask(cb) {
    cb();
}

// exports.default = defaultTask
// exports.copyEnvFiles = copyEnvFiles;
exports.cleanWeb = cleanWeb;
exports.clean = clean;
exports.npmBuild = npmBuild;
exports.cargoBuild = cargoBuild;
exports.build = parallel(npmBuild, cargoBuild);
exports.package = package;
exports.release = series(clean, parallel(npmBuild, cargoBuild), package);