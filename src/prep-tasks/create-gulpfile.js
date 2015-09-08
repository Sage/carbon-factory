var fs = require('fs');

var CreateGulpfile = function() {
  fs.readFile(__dirname + '/tpl/gulpfile.js', 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }

    fs.writeFile('.' + name + '/gulpfile.js', data, 'utf8', function (err) {
      if (err) return console.log(err);
      console.log('Created Gulp file...');
    });
  });
};

module.exports = CreateGulpfile;
