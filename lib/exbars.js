var Handlebars = require('handlebars');

function Exbars(options) {
  this.defaultLayout = options.defaultLayout ? options.defaultLayout : null;
  this.handlebars = Handlebars;
  this.compilerOptions = options.compilerOptions ? options.compilerOptions : {};
  this.compiledTemplates = {};

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
    var template = this.compiledTemplates[filePath];
    var layout = options.layout === null ? null : options.layout || this.defaultLayout;
    if(layout) {
      var layoutTemplate = this.compiledTemplates[process.cwd() + '/views/layouts/' + layout + '.hbs'];
      options.body = template(options);
      return callback(null, layoutTemplate(options));
    } 
    return callback(null, template(options));
  };

  this.engine = function() {
    return this.render.bind(this);
  };
}

module.exports = Exbars;
