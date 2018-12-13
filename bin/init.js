#!/usr/bin/env node

// Ref: https://github.com/ant-design/antd-init/blob/master/bin/antd-init

const fs = require('fs');
const vfs = require('vinyl-fs');
const through = require('through2');
const path = require('path');
const ejs = require('ejs');
const inquirer = require('inquirer');
const join = path.join;
const basename = path.basename;

if (process.argv[2] === '-v' || process.argv[2] === '--version') {
  console.log(require('../package').version);
  return;
}

inquirer.prompt([
  {
    type: 'input',
    name: 'name',
    message: "The name of Hooks:",
    default: 'name-of-hooks',
    validate: function(input) {
      if (!input) return 'The name is required!';
      return true;
    }
  },
  {
    type: 'input',
    name: 'desc',
    message: "The description of Hooks:",
    default: 'Custom React Hooks',
    validate: function(input) {
      if (!input) return 'The description is required!';
      return true;
    }
  }
]).then(answers => {
  init(answers);
});

function init(answers) {
  const cwd = join(__dirname, '../scaffold');
  const dest = process.cwd();

  vfs.src(['**/*', '!node_modules/**/*'], { cwd: cwd, cwdbase: true, dot: true })
    .pipe(template(dest, cwd, answers))
    .pipe(vfs.dest(dest))
    .on('end', function () {
      fs.renameSync(path.join(dest, '_gitignore'), path.join(dest, '.gitignore'));
      fs.renameSync(path.join(dest, '_package.json'), path.join(dest, 'package.json'));
      require('../lib/install');
    })
    .resume();
}

function template(dest, cwd, answers) {
  return through.obj(function (file, enc, cb) {
    if (!file.stat.isFile()) {
      return cb();
    }

    const resultStr = ejs.render(file.contents.toString('utf8'), answers);

    file.contents = new Buffer(resultStr, 'utf8');

    console.log('Write %s', simplifyFilename(file.path, cwd));
    this.push(file);
    cb();
  });
}

function simplifyFilename(filename, cwd) {
  return filename.replace(cwd, ".");
}