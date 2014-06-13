var express      = require('express');
var path         = require('path');
var favicon      = require('static-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var routes       = require('./routes/index');
var users        = require('./routes/users');
var passport     = require('passport');
var mongoose     = require('mongoose');
var session      = require('express-session');
var app          = express();
var http         = require('http');
var server       = http.createServer(app);
var io           = require('socket.io').listen(server);
var debug        = require('debug')('makerspace');
//var redis        = require('redis');

if (0) {
    var mongoURL     = process.env.mongoURL;
    var clientID     = process.env.clientID;
    var clientSecret = process.env.clientSecret;
    var callbackURL  = process.env.callbackURL;
} else {
    var secret = require("./secret/secret");
    var mongoURL = secret.mongoURL;
    var clientID = secret.clientID;
    var clientSecret = secret.clientSecret;
    var callbackURL  = secret.callbackURL;
}
// Connect database
mongoose.connect(mongoURL);

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
require('./config/configPass')(passport, clientID, clientSecret, callbackURL);
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
/*
try {
var redisClient = redis.createClient(); }
catch (err) {
    console.err(err)
}*/

io.on('connection', function(socket){

    socket.on('new project', function(data) {
        console.log(data.user);
        console.log(data.repo);
    })

    socket.on('join', function(name) {
        socket.name = name;
        /*
        redisClient.lrange('messages', 0, -1, function(err, messages) {
            console.log(messages);
            messages = messages.reverse();
            messages.forEach(function(data){
                data = JSON.parse(data);
                socket.emit('message', data);
            })
        })*/
    });
    /* Message from Visualization Page */
    socket.on('New Message', function(msg){
        console.log(msg);
        io.emit('New Message', msg);
    })
    socket.on('message', function(msg) {
        /*
        var message = JSON.stringify({name:socket.name, data:msg});
        redisClient.lpush('messages', message, function(err, res){
            redisClient.ltrim('messages', 0, 10);
        })
        io.emit('message', {name:socket.name, data:msg}); */
    });
    socket.on('disconnect', function() {
        console.log('disconnect');
    });    
});

app.set('port', process.env.PORT || 3000);
server.listen(app.get('port'), function(){
  debug('Express server listening on port ' + app.get('port'));   
})
