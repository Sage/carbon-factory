var child_process = require('child_process');

var InstallNodeModules = function(name) {
  setTimeout(function() {
    console.log('Installing Node modules...');

    child_process.exec('npm install', {
      cwd: './' + name
    }, function(error, stdout, stderr){
      if (stderr !== null) {
        console.log('' + stderr);
      }
      if (stdout !== null) {
        console.log('' + stdout);
        }
      if (error !== null) {
        console.log('' + error);
      }

      console.log('All done!');
    });
  }, 200);
};

module.exports = InstallNodeModules;
