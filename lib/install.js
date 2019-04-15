// Ref: https://github.com/ant-design/antd-init/blob/master/lib/install.js
const which = require('which');

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

runCmd(which.sync('npm'), ['install'], function () {
  console.log('Installed successfully :-)');
  console.log('Run: npm start');
});
