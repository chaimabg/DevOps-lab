var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var githubRouter = require('./src/routes/github.routes');
var authRouter = require('./src/routes/auth.routes');

var mongoose = require("mongoose");
var cors = require("cors");
var dotenv = require("dotenv");
var app = express();

dotenv.config();

const PORT = process.env.PORT || 5000 ;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', githubRouter);
app.use('/', authRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
mongoose
    .connect(
        process.env.MONGOOSE_CONNECTION, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
    .then(() => app.listen(PORT, console.log(`Sever running on port ${PORT}`)))
    .catch((error) => console.log(error.message));

module.exports = app;
