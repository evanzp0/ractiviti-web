const del = require('delete');
const { exec } = require('child_process');
const tar = require('gulp-tar');
const gzip = require('gulp-gzip');
const toml = require('toml');
const fs = require('fs');
const { src, dest, series, parallel } = require('gulp');
// const package = require('./package.json');

var cargo_toml = toml.parse(fs.readFileSync('./Cargo.toml'));

function cleanWeb(cb) {
    del(['./target/web'], cb);
}

function clean(cb) {
    del(['./target'], cb);
}

function npmBuild() {
    return exec('npm run build');
}

function cargoBuild() {
    return exec('cargo build');
}

async function package() {
    let package_name = cargo_toml.package.name;
    let version = cargo_toml.package.version;
    return src('./target/debug/web/**', {base: './target/debug'})
        .pipe(src('target/debug/log4rs_config.yaml'))
        .pipe(src('target/debug/config.yaml'))
        .pipe(src('target/debug/' + package_name))
        .pipe(tar(`${package_name}_v${version}.tar`))
        .pipe(gzip())
        .pipe(dest("target/dist"))
}

exports.cleanWeb = cleanWeb;
exports.clean = clean;
exports.npmBuild = npmBuild;
exports.cargoBuild = cargoBuild;
exports.build = parallel(npmBuild, cargoBuild);
exports.package = package;
exports.release = series(clean, parallel(npmBuild, cargoBuild), package);