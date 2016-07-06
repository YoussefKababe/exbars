var path = require('path');
var Engine = require(path.join(__dirname, '../index.js'));
var should = require('chai').should();
var os = require('os');

describe('Engine', function() {
  var engine;

  before(function(done) {
    engine = Engine({defaultLayout: 'main', viewsPath: 'test/views' }, function() {
      done();
    });
  });
  
  it('should render template with default layout', function(done) {
    engine(process.cwd() + '/test/views/page.hbs', {}, function(err, content) {
      content.should.equal('<section><p>page</p></section>');
      done();
    });
  });

  it('should render template without default layout', function(done) {
    engine(process.cwd() + '/test/views/page.hbs', {layout: false}, function(err, content) {
      content.should.equal('<p>page</p>');
      done();
    });
  });

  it('should render template with another layout', function(done) {
    engine(process.cwd() + '/test/views/page.hbs', {layout: 'other'}, function(err, content) {
      content.should.equal('<div><p>page</p></div>');
      done();
    });
  });

  it('should render template with a partial in the same folder', function(done) {
    engine(process.cwd() + '/test/views/pages/index.hbs', {layout: false}, function(err, content) {
      content.should.equal('<p>pages/index</p>'+os.EOL+'<p>pages/links</p>');
      done();
    });
  });

  it('should render template with a partial in an another folder', function(done) {
    engine(process.cwd() + '/test/views/home.hbs', {layout: false}, function(err, content) {
      content.should.equal('<p>home</p>'+os.EOL+'<p>partials/widget</p>');
    });

    engine(process.cwd() + '/test/views/users/index.hbs', {layout: false}, function(err, content) {
      content.should.equal('<p>users/index</p>'+os.EOL+'<p>users/partials/widget</p>');
      done();
    });
  });

  it('should render template with a helper', function(done) {
    engine(process.cwd() + '/test/views/pages/login.hbs', {layout: false}, function(err, content) {
      content.should.equal('<p>LOGIN</p>');
      done();
    });
  });
});