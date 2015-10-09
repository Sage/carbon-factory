var fs = require('fs');

// a reusable function to clone files
module.exports = function(name, from, to, transform) {
  fs.readFile(__dirname + from, 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }

    // apply any transforms to the template file before cloning it
    if (transform) {
      data = transform(data);
    }

    fs.writeFile('./' + name + to, data, 'utf8', function (err) {
      if (err) return console.log(err);
      console.log('Created ' + to + ' file...');
    });
  });
};
