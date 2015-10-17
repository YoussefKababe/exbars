var Handlebars = require('handlebars');

function Exbars(options) {
  this.defaultLayout = options.defaultLayout || null;
  this.compilerOptions = options.compilerOptions || {};
  this.handlebars = Handlebars;
  this.compiledTemplates = {};
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
    var template = this.compiledTemplates[filePath];
    var layout = options.layout || this.defaultLayout;
    if(layout) {
      var layoutTemplate = this.compiledTemplates[process.cwd() + '/views/layouts/' + layout + '.hbs'];
      this.callerPath = filePath.replace(process.cwd() + '/views/', '');
      options.body = template(options);
      this.callerPath = 'layouts/' + layout + '.hbs';
      return callback(null, layoutTemplate(options));
    }
    this.callerPath = filePath.replace(process.cwd() + '/views/', '');
    return callback(null, template(options));
  };

  this.engine = function() {
    return this.render.bind(this);
  };
}

module.exports = Exbars;
