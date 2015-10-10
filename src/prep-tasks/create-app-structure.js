var createDirectory = require('./../utils/createDirectory');
var cloneFile = require('./../utils/clone');

var CreateAppStructure = function(name) {
  // create the required directories
  createDirectory(name, '/src/components');
  createDirectory(name, '/src/actions');
  createDirectory(name, '/src/stores');
  createDirectory(name, '/src/views');

  function writeFiles() {
    var transform = function(data) {
      return data.replace(/APPNAME/g, name);
    };

    // clone required files for application
    cloneFile(name, '/../tpl/main.js', '/src/main.js');
    cloneFile(name, '/../tpl/index.html', '/index.html');
    cloneFile(name, '/../tpl/package.txt', '/package.json', transform);
    cloneFile(name, '/../tpl/gulpfile.js', '/gulpfile.js');
  };

  // wait 200ms to ensure the directories have finished being built
  // (could use promise instead?)
  setTimeout(writeFiles, 200);
};

module.exports = CreateAppStructure;
