var child_process = require('child_process');

var InstallNodeModules = function(name) {
  function run() {
    console.log('Installing Node modules... (this could take a minute!)');

    // run `npm install` inside the module directory
    child_process.exec('npm install', {
      cwd: './' + name
    }, function(error, stdout, stderr){
      if (stderr !== null) { console.log('' + stderr); }
      if (stdout !== null) { console.log('' + stdout); }
      if (error !== null) { console.log('' + error); }

      console.log('All done!');
    });
  }

  // wait 250ms to ensure the app-structure task finished
  // (could use promises instead?)
  setTimeout(run, 250);
};

module.exports = InstallNodeModules;
