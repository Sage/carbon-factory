var fs = require('fs');

var CreateMain = function(name) {
  fs.readFile(__dirname + '/tpl/main.js', 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }

    fs.writeFile('./src/main.js', data, 'utf8', function (err) {
      if (err) return console.log(err);
      console.log('Created main JS file...');
    });
  });
};

module.exports = CreateMain;
