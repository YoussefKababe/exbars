var path = require('path');
var mix = require('mixin-deep');

module.exports = function(exbars) {
  var partials = exbars.handlebars.partials;

  return function(name, context) {
    var dirName = path.dirname(exbars.callerPath);
    var partial = partials[path.join(dirName, name)] || partials[name] || partials[path.join('views' + name)];

    if (partial === undefined)
      throw new Error('Failed to lookup partial "' + name + '" in: ' + exbars.callerPath);

    var compiledPartial = exbars.handlebars.compile(partial, exbars.comilerOptions);
    return new exbars.handlebars.SafeString(compiledPartial(mix(this, context.hash)));
  };
};