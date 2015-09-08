var mkdirp = require('mkdirp');

var CreateAppStructure = function(name) {
  mkdirp('.' + name + '/src/components', function (err) {
    if (err) console.error(err)
    else console.log('Created components directory...')
  });

  mkdirp('.' + name + '/src/views', function (err) {
    if (err) console.error(err)
    else console.log('Created views directory...')
  });
};

module.exports = CreateAppStructure;
