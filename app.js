var express      = require('express');
var path         = require('path');
var favicon      = require('static-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var routes       = require('./routes/index');
var users        = require('./routes/users');
var db           = require('./config/db');
var passport     = require('passport');
var mongoose     = require('mongoose');
var session      = require('express-session');
var app          = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var debug = require('debug')('makerspace');

// Connect database
try {
    mongoose.connect(db.url);
} catch (err) {console.log("DB error");}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

// Passport
app.use(cookieParser());
app.use(bodyParser());
app.use(session({secret : "Scotty"}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.Router());
require('./config/configPass')(passport);
require('./routes/index.js')(app, passport)


/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', process.env.PORT || 3000);

// chatter name
io.on('connection', function(client) {
    client.on('join', function(name) {
        client.name = name;
    })
})

io.on('connection', function(socket){
    console.log("user connected");
    socket.on('disconnect', function() {
        console.log('disconnect');
    });
    socket.on('message', function(msg) {
        console.log(socket.name + 'message: ' + msg);
        io.emit('message', socket.name + " :" + msg);
    })
});


server.listen(app.get('port'), function(){
  debug('Express server listening on port ' + app.get('port'));   
})
