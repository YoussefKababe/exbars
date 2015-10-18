var should = require('chai').should();
var Exbars = require('../lib/exbars');

describe('Exbars', function() {
  var exbars = new Exbars({});
  
  describe('#registerHelper', function() {
    
    it('should register helpers', function() {
      var fn = function() {};
      var fn2 = function(test) {};
      exbars.registerHelper('helper', fn);
      exbars.handlebars.helpers.should.contain.key('helper');
      exbars.handlebars.helpers.helper.should.equal(fn);
    });
  });

  describe('#registerPartial', function() {
    
    it('should register partials', function() {
      exbars.registerPartial('partial', 'content');
      exbars.handlebars.partials.should.contain.key('partial');
      exbars.handlebars.partials.partial.should.equal('content');
    });
  });

  describe('#compile', function() {

    before(function() {
      exbars.compile('template', 'content');
    });
    
    it('should add compiled templates to the compiledTemplates object', function() {
      exbars.compiledTemplates.should.contain.key('template');
    });

    it('should compile templates', function() {
      exbars.compiledTemplates.template().should.equal('content');
    });
  });

  describe('#render', function() {

    before(function() {
      exbars.compile('someTemplate', '<h1>{{title}}</h1>');
      exbars.compile('templateWithHelper', "<h1>{{someHelper 'hello'}}</h1>");
      exbars.compile('templateWithPartial', "<h1>{{partial 'some_partial'}}</h1>");
      exbars.compile(exbars.viewsPath + '/layouts/main.hbs', '<div>{{{body}}}</div>');
      exbars.compile(exbars.viewsPath + '/layouts/other.hbs', '<section>{{{body}}}</section>');
      exbars.registerHelper('someHelper', function(string) { return string.toUpperCase(); });
      exbars.registerPartial('some_partial', '<p>This is a partial</p>');
    });
    
    it('should render compiled templates', function(done) {
      exbars.render('someTemplate', {}, function(err, result) {
        result.should.equal('<h1></h1>');
        done();
      });
    });

    it('should render compiled templates with context', function(done) {
      exbars.render('someTemplate', {title: 'Hello!'}, function(err, result) {
        result.should.equal('<h1>Hello!</h1>');
        done();
      });
    });

    it('should render compiled templates within a layout', function(done) {
      exbars.render('someTemplate', {title: 'Hello!', layout: 'main'}, function(err, result) {
        result.should.equal('<div><h1>Hello!</h1></div>');
        done();
      });
    });

    it('should render compiled templates within a default layout', function(done) {
      exbars.defaultLayout = 'main';
      exbars.render('someTemplate', {title: 'Hello!'}, function(err, result) {
        result.should.equal('<div><h1>Hello!</h1></div>');
        done();
      });
    });

    it('should render compiled templates without the default layout', function(done) {
      exbars.defaultLayout = 'main';
      exbars.render('someTemplate', {title: 'Hello!', layout: false}, function(err, result) {
        result.should.equal('<h1>Hello!</h1>');
        done();
      });
    });

    it('should render compiled templates without another layout', function(done) {
      exbars.defaultLayout = 'main';
      exbars.render('someTemplate', {title: 'Hello!', layout: 'other'}, function(err, result) {
        result.should.equal('<section><h1>Hello!</h1></section>');
        done();
      });
    });

    it('should render templates with helpers', function(done) {
      exbars.defaultLayout = '';
      exbars.render('templateWithHelper', {}, function(err, result) {
        result.should.equal('<h1>HELLO</h1>');
        done();
      });
    });

    it('should render templates with partials', function(done) {
      exbars.render('templateWithPartial', {}, function(err, result) {
        result.should.equal('<h1><p>This is a partial</p></h1>');
        done();
      });
    });
  });
});