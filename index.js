var path = require('path');
var Exbars = require(path.join(__dirname, 'lib/exbars.js'));
var string = require('lodash/string');
var walk = require('walk');
var fs = require('fs');

module.exports = function(options, callback) {
  var exbars = new Exbars(options);
  var viewsPath = options.viewsPath || 'views';
  var walker = walk.walk(viewsPath);

  walker.on('file', function(root, fileStats, next) {
    switch(true) {
      case /^[^_][a-z0-9_-]+[^_].hbs$/i.test(fileStats.name):
        fs.readFile(path.join(root, fileStats.name), function(err, data) {
          exbars.compile(path.join(root, fileStats.name), data.toString());
          next();
        });
        break;
      case /^_[a-z0-9_-]+[^_].hbs$/i.test(fileStats.name):
        fs.readFile(path.join(root, fileStats.name), function(err, data) {
          exbars.registerPartial(path.join(path.relative(viewsPath, root), string.snakeCase(path.basename(fileStats.name, '.hbs'))), data.toString());
          next();
        });
        break;
      case /^[^_][a-z0-9_-]+_helper.js$/i.test(fileStats.name):
        exbars.registerHelper(string.camelCase(path.basename(fileStats.name, '_helper.js')),
          require(path.join(process.cwd(), root, fileStats.name)));
        next();
        break;
    }
  });

  walker.on('end', function() {
    if(callback) callback();
  });

  return exbars.engine();
};
