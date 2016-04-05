var Handlebars = require('handlebars');
var path = require('path');
var partial = require('../helpers/partial');

function Exbars(options) {
  this.defaultLayout = options.defaultLayout || null;
  this.compilerOptions = options.compilerOptions || {};
  this.handlebars = Handlebars;
  this.compiledTemplates = {};
  this.viewsPath = options.viewsPath || 'views';
  this.callerPath = '';

  this.registerHelper = function(name, helper) {
    return this.handlebars.registerHelper(name, helper);
  };

  this.registerPartial = function(name, content) {
    return this.handlebars.registerPartial(name, content);
  };

  this.compile = function(template, content) {
    this.compiledTemplates[template] = this.handlebars.compile(content, this.compilerOptions);
  };

  this.render = function(filePath, options, callback) {
    var template = this.compiledTemplates[filePath.replace(process.cwd() + '/', '')];
    var layout = options.layout === false ? null : options.layout || this.defaultLayout;
    if(layout) {
      var layoutTemplate = this.compiledTemplates[path.join(this.viewsPath, 'layouts', layout + '.hbs')];
      if (layoutTemplate === undefined) {
        throw new Error('Failed to lookup layout "' + layout + '" in ' + path.join(this.viewsPath, 'layouts'));
      }
      this.callerPath = filePath.replace(process.cwd() + '/' + this.viewsPath + '/', '');
      options.body = template(options);
      this.callerPath = 'layouts/' + layout + '.hbs';
      return callback(null, layoutTemplate(options));
    }
    this.callerPath = filePath.replace(process.cwd() + '/' + this.viewsPath + '/', '');
    return callback(null, template(options));
  };

  this.engine = function() {
    return this.render.bind(this);
  };

  this.registerHelper('partial', partial(this));
}

module.exports = Exbars;
