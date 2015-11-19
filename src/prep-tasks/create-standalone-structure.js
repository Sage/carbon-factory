var createDirectory = require('./../utils/createDirectory');
var cloneFile = require('./../utils/clone');

var CreateAppStructure = function(name) {
  // create the required directories
  createDirectory(name, '/src/components');

  function writeFiles() {
    var transform = function(data) {
      return data.replace(/APPNAME/g, name);
    };

    // clone required files for application
    cloneFile(name, '/../tpl/main-standalone.js', '/src/main.js');
    cloneFile(name, '/../tpl/index.html', '/index.html');
    cloneFile(name, '/../tpl/package.txt', '/package.json', transform);
    cloneFile(name, '/../tpl/gulpfile-standalone.js', '/gulpfile.js');
    cloneFile(name, '/../tpl/gitignore.txt', '/.gitignore');
    cloneFile(name, '/../tpl/eslintrc.txt', '/.eslintrc');
  };

  // wait 200ms to ensure the directories have finished being built
  // (could use promise instead?)
  setTimeout(writeFiles, 200);
};

module.exports = CreateAppStructure;
