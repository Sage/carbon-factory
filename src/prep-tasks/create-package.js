var fs = require('fs');

var CreatePackage = function(name) {
  fs.readFile(__dirname + '/tpl/package.txt', 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }

    var result = data.replace(/APPNAME/g, name);

    fs.writeFile('.' + name + '/package.json', result, 'utf8', function (err) {
      if (err) return console.log(err);
      console.log('Created Node package...');
    });
  });
};

module.exports = CreatePackage;
