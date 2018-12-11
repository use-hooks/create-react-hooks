#!/usr/bin/env node

// Ref: https://github.com/ant-design/antd-init/blob/master/bin/antd-init

var fs = require('fs');
var vfs = require('vinyl-fs');
var through = require('through2');
var path = require('path');
var ejs = require('ejs');
var join = path.join;
var basename = path.basename;

if (process.argv.length < 3) {
  console.log('Usage: npx create-react-hooks <name-of-hooks>');
  return;
}

if (process.argv[2] === '-v' || process.argv[2] === '--version') {
  console.log(require('../package').version);
  return;
}

var hooksName = process.argv[2];

init();

function init() {
  var cwd = join(__dirname, '../scaffold');
  var dest = process.cwd();

  vfs.src(['**/*', '!node_modules/**/*'], { cwd: cwd, cwdbase: true, dot: true })
    .pipe(template(dest, cwd))
    .pipe(vfs.dest(dest))
    .on('end', function () {
      fs.renameSync(path.join(dest, 'gitignore'), path.join(dest, '.gitignore'));
      require('../lib/install');
    })
    .resume();
}

function template(dest, cwd) {
  return through.obj(function (file, enc, cb) {
    if (!file.stat.isFile()) {
      return cb();
    }

    var resultStr = ejs.render(file.contents.toString('utf8'), {
      name: hooksName
    });

    file.contents = new Buffer(resultStr, 'utf8');

    console.log('Write %s', simplifyFilename(file.path, cwd));
    this.push(file);
    cb();
  });
}

function simplifyFilename(filename, cwd) {
  return filename.replace(cwd, ".");
}