var Raven = require('raven');
Raven.config('https://e2402d5636474781a5d216e185bfc12b:60bf73b5ca8446c592ade4fb0630b08c@sentry.io/175110').install();

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var csurf = require('csurf');
var stringReplace = require('string-replace-middleware');
var fs = require('fs');

var index = require('./routes/index');
var uploads = require('./routes/uploads');
var jobs = require('./routes/jobs');

var app = express();

// see https://docs.sentry.io/clients/node/integrations/express/
// The request handler must be the first middleware on the app
app.use(Raven.requestHandler());

app.use(cookieParser());

const indexHtml = (req, res, next) => {
  const csrfToken = req.csrfToken && req.csrfToken();
  
  fs.readFile(path.resolve(__dirname, '../../frontend/build/index.html'), 'utf8', (err, data) => {
    if(err) throw err;
    res.send(data
      .replace('__REPLACE_WITH_CSRF_TOKEN__', csrfToken || '')
      .replace('__REPLACE_WITH_NODE_ENV__', app.settings.env)
    );
  });
}

if(app.settings.env !== 'development') {
  app.use(csurf({ cookie: true }));
} else {
  console.log('warning: not using CSRF protection in dev environment');
}

app.get( '/index.html', indexHtml);
app.get( '/', (req, res, next) => { if(req.path !== '/') next(); else indexHtml(req, res, next); });

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, '../../frontend/build')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/uploads', uploads);
app.use('/jobs', jobs);

// all other routes just return index.html
app.get('*', indexHtml);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// see https://docs.sentry.io/clients/node/integrations/express/
// The error handler must be before any other error middleware
app.use(Raven.errorHandler());

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
