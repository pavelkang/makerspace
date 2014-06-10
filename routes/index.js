var express = require('express');
var http = require('http');
var router = express.Router();
var User = require('../models/user');
var Project = require('../models/project');
var util = require('../util');

module.exports = function(app, passport) {
    /* Home page. */
    app.get('/', function(req, res) {
        res.sendfile('views/index.html');
    });
    /* Profile page */
    app.get('/profile', isLoggedIn, function(req, res) {
        res.sendfile('views/profile.html');
    });
    /* Visualization page */
    // TODO isLoggedIn
    app.get('/visual', function(req, res) {
        res.sendfile('views/visualization.html');
    });
    /* About page */
    app.get('/about', function(req, res) {
        res.sendfile('views/about.html');
    });    
    // Socket IO
    app.get('/chat', function(req, res) {
        res.sendfile('views/chat.html');
    })
    // GET API for getting user information from database
    app.get('/api/getUser', function(req, res) {
        User.findOne({
            'github.id': req.user.github.id
        }, function(err, user) {
            if (err)
                res.send(err)
            res.json(user);
        });
    });
    // GET API for getting project information from database
    app.get('/api/getProjects', function(req, res) {
        Project.find({}, function(err, docs) {
            if (!err) {
                res.json(docs);
            } else {
                throw err;
            }
        });
    });
    // POST API for registering projects
    app.post('/api/registerProject', function(req, res) {
        User.findOne({
            'github.id': req.user.github.id
        }, function(err, user) {
            user.hasProject = true;
            user.save(function(err) {
                if (err) {
                    throw err;
                }
            });
        });
        Project.find({}, function(err, docs) {
            if (!err) {
                var a = util.projectExists(req.body.repoApi, docs);
                console.log(a);
                if (a) {
                    // Project already exists
                    res.send('E');
                } else {
                    // Project does not exist
                    var newProject = new Project();
                    newProject.repo = req.body.repo;
                    newProject.repoApi = req.body.repoApi;
                    newProject.developers = [req.body.username];
                    newProject.save(function(err) {
                        if (err) {
                            throw err;
                        }
                        res.send("Y"); // Save success
                    });
                }
            } else {
                throw err;
            }
        });

    });
    // Github Login
    app.get('/auth/github',
        passport.authenticate('github'),
        function(req, res) {});
    // Github callback
    app.get('/auth/github/callback',
        passport.authenticate('github', {
            failureRedirect: '/'
        }),
        function(req, res) {
            res.redirect('/profile');
        });

    app.get('/logout', function(req, res) {
        console.log('Logging out...');
        req.logout();
        res.redirect('/');
    });
};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}