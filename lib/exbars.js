var Handlebars = require('handlebars');
var path = require('path');
var partial = require(path.join(__dirname, '../helpers/partial.js'));

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
	 filePath = path.normalize(filePath);
    var template = this.compiledTemplates[path.relative(process.cwd(), filePath)];
    var layout = options.layout === false ? null : options.layout || this.defaultLayout;
    if(layout) {
      var layoutTemplate = this.compiledTemplates[path.join(this.viewsPath, 'layouts', layout + '.hbs')];
      if (layoutTemplate === undefined) {
        throw new Error('Failed to lookup layout "' + layout + '" in ' + path.join(this.viewsPath, 'layouts'));
      }
      this.callerPath =  path.relative(path.join(process.cwd(), this.viewsPath), filePath);
      options.body = template(options);
      this.callerPath = path.join('layouts', layout + '.hbs');
      return callback(null, layoutTemplate(options));
    }
    this.callerPath =  path.relative(path.join(process.cwd(), this.viewsPath), filePath);
    return callback(null, template(options));
  };

  this.engine = function() {
    return this.render.bind(this);
  };

  this.registerHelper('partial', partial(this));
}

module.exports = Exbars;
