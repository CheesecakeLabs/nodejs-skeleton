var env          = process.env.NODE_ENV || 'development',
    packageJson  = require('../package.json'),
    path         = require('path'),
    express      = require('express'),
    favicon      = require('serve-favicon'),
    logger       = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser   = require('body-parser');

console.log('Loading App in ' + env + ' mode.');

global.App = {
  app: express(),
  port: process.env.PORT || 3000,
  version: packageJson.version,
  root: path.join(__dirname, '..'),
  appPath: function(path) {
      return this.root + '/' + path;
  },
  require: function(path) {
      return require(this.appPath(path));
  },
  env: env,
  start: function() {
    if (!this.started) {
      this.started = true;
      this.app.listen(this.port);
      console.log('Running App Version ' + App.version + ' on port ' + App.port + ' in ' + App.env + ' mode');
    }
  },
  model: function(path) {
    return this.require('app/models/' + path);
  },
  controller: function(path) {
    return this.require('app/controllers/' + path);
  },
  util: function(path) {
    return this.require('app/utils/' + path);
  }
}

// Jade for views:
App.app.set('views', App.appPath('app/views'));
App.app.set('view engine', 'jade');

// Middleware:
App.app.use(logger('dev'));
App.app.use(bodyParser.json());
App.app.use(bodyParser.urlencoded({ extended: false }));
App.app.use(cookieParser());
App.app.use(express.static(App.appPath('public')));
// uncomment after placing your favicon in /public
// App.app.use(favicon(__dirname + '/public/favicon.ico'));

// Routes:
App.require('config/routes')(App.app)

// Error handlers:
App.require('config/error_handlers')(App.app, App.env)

// Database:
App.require('config/database')(process.env.DATABASE_URL || 'mongodb://localhost/ckl_website')
