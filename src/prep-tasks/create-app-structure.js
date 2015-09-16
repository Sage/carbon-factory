var mkdirp = require('mkdirp');
var fs = require('fs');

var CreateAppStructure = function(name) {
  mkdirp('./' + name + '/node_modules', function (err) {
    if (err) console.error(err)
    else console.log('Created node_modules directory...')
  });

  mkdirp('./' + name + '/src/components', function (err) {
    if (err) console.error(err)
    else console.log('Created components directory...')
  });

  mkdirp('./' + name + '/src/actions', function (err) {
    if (err) console.error(err)
    else console.log('Created actions directory...')
  });

  mkdirp('./' + name + '/src/stores', function (err) {
    if (err) console.error(err)
    else console.log('Created stores directory...')
  });

  mkdirp('./' + name + '/src/views', function (err) {
    if (err) console.error(err)
    else console.log('Created views directory...')
  });

  mkdirp('./' + name + '/spec/components', function (err) {
    if (err) console.error(err)
    else console.log('Created components spec directory...')
  });

  mkdirp('./' + name + '/spec/actions', function (err) {
    if (err) console.error(err)
    else console.log('Created actions spec directory...')
  });

  mkdirp('./' + name + '/spec/stores', function (err) {
    if (err) console.error(err)
    else console.log('Created stores spec directory...')
  });

  mkdirp('./' + name + '/spec/views', function (err) {
    if (err) console.error(err)
    else console.log('Created views spec directory...')
  });

  function writeFiles() {
    // main.js
    fs.readFile(__dirname + '/tpl/main.js', 'utf8', function (err, data) {
      if (err) {
        return console.log(err);
      }

      fs.writeFile('./' + name + '/src/main.js', data, 'utf8', function (err) {
        if (err) return console.log(err);
        console.log('Created main.js file...');
      });
    });

    // index.js
    fs.readFile(__dirname + '/tpl/index.js', 'utf8', function (err, data) {
      if (err) {
        return console.log(err);
      }

      fs.writeFile('./' + name + '/src/components/index.js', data, 'utf8', function (err) {
        if (err) return console.log(err);
        console.log('Created index.js for components...');
      });

      fs.writeFile('./' + name + '/src/views/index.js', data, 'utf8', function (err) {
        if (err) return console.log(err);
        console.log('Created index.js for views...');
      });
    });

    // symlinks
    // TODO: get these to work for requiring files (it currently does not preprocess them)
    // fs.symlink(process.cwd() + '/' + name + '/src/views', './' + name + '/node_modules/views', function (err) {
    //   if (err) {
    //     return console.log(err);
    //   } else {
    //     console.log('Created symlink for src/views...');
    //   }
    // });
    // fs.symlink(process.cwd() + '/' + name + '/src/components', './' + name + '/node_modules/components', function (err) {
    //   if (err) {
    //     return console.log(err);
    //   } else {
    //     console.log('Created symlink for src/components...');
    //   }
    // });

    // index.html
    fs.readFile(__dirname + '/tpl/index.html', 'utf8', function (err, data) {
      if (err) {
        return console.log(err);
      }

      fs.writeFile('./' + name + '/index.html', data, 'utf8', function (err) {
        if (err) return console.log(err);
        console.log('Created index.html file...');
      });
    });
  };

  setTimeout(writeFiles, 150);
};

module.exports = CreateAppStructure;
