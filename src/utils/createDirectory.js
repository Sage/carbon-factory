var mkdirp = require('mkdirp');

// a reusable function to create directories
module.exports = function(name, path) {
  mkdirp('./' + name + path, function (err) {
    if (err) console.error(err)
    else console.log('Created ' + path + ' directory...')
  });
}
