#!/usr/bin/env node

// Ref: https://github.com/ant-design/antd-init/blob/master/bin/antd-init

var fs = require('fs');
var vfs = require('vinyl-fs');
var through = require('through2');
var path = require('path');
var join = path.join;
var basename = path.basename;

if (process.argv.length === 3 &&
  (process.argv[2] === '-v' || process.argv[2] === '--version')) {
  console.log(require('../package').version);
  return;
}

init();

function init() {
  var cwd = join(__dirname, '../scaffold');
  var dest = process.cwd();

  vfs.src(['**/*', '!node_modules/**/*'], { cwd: cwd, cwdbase: true, dot: true })
    .pipe(template(dest))
    .pipe(vfs.dest(dest))
    .on('end', function () {
      fs.renameSync(path.join(dest, 'gitignore'), path.join(dest, '.gitignore'));
      require('../lib/install');
    })
    .resume();
}

function template(dest) {
  return through.obj(function (file, enc, cb) {
    if (!file.stat.isFile()) {
      return cb();
    }

    console.log('Write %s', simplifyFilename(join(dest, basename(file.path))));
    this.push(file);
    cb();
  });
}

function simplifyFilename(filename) {
  return filename.replace(process.cwd(), ".");
}