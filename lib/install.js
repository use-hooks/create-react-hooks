// Ref: https://github.com/ant-design/antd-init/blob/master/lib/install.js

function runCmd(cmd, args, fn) {
  args = args || [];
  const runner = require('child_process').spawn(cmd, args, {
    // keep color
    stdio: "inherit"
  });
  runner.on('close', function (code) {
    if (fn) {
      fn(code);
    }
  });
}

const which = require('which');
const npms = ['tnpm', 'cnpm', 'npm'];

function findNpm() {
  for (let i = 0; i < npms.length; i++) {
    try {
      which.sync(npms[i]);
      console.log('use npm: ' + npms[i]);
      return npms[i];
    } catch (e) {

    }
  }
  throw new Error('please install npm');
}

const npm = findNpm();

runCmd(which.sync(npm), ['install'], function () {
  console.log('Installed successfully :-)');
  console.log('Run: npm start');
});
