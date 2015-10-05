var Exbars = require('./lib/exbars.js');
var walk = require('walk');
var fs = require('fs');
var path = require('path');
var string = require('lodash/string');

module.exports = function(options) {
  var exbars = new Exbars(options);
  var walker = walk.walk('views');

  walker.on('file', function(root, fileStats, next) {
    switch(true) {
      case /^[^_][a-z0-9_-]+[^_].hbs$/i.test(fileStats.name):
        fs.readFile(path.join(root, fileStats.name), function(err, data) {
          exbars.compile(path.join(process.cwd(), root, fileStats.name), data.toString());
        });
        break;
      case /^_[a-z0-9_-]+[^_].hbs$/i.test(fileStats.name):
        fs.readFile(path.join(root, fileStats.name), function(err, data) {
          exbars.registerPartial(string.camelCase(path.basename(fileStats.name, '.hbs')), data.toString());
        });
        break;
      case /^[^_][a-z0-9_-]+_helper.js$/i.test(fileStats.name):
        fs.readFile(path.join(root, fileStats.name), function(err, data) {
          exbars.registerHelper(string.camelCase(path.basename(fileStats.name, '_helper.js')), require(path.join(process.cwd(), root, fileStats.name)));
        });
        break;
    }
    next();
  });

  return exbars.engine();
};
