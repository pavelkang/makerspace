var profileApp = angular.module('profileApp', []);

profileApp.factory('socket', function($rootScope) {
    var socket = io();
    return {
        on: function(eventName, callback) {
            socket.on(eventName, function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    callback.apply(socket.args);
                });
            });
        },
        emit: function(eventName, data, callback) {
            socket.emit(eventName, data, function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    if (callback)
                        callback.apply(socket.args);
                });
            });
        }
    };
});

profileApp.controller('AppCtrl', function($window, $scope, $http, socket) {

    $scope.info = {
        username: "",
        repo: "",
        repoApi: "",
        verified: false
    };
    // This allows elements not to be shown before the HTTP call
    $scope.helpers = {
        hasProject: false,
        noProject: false
    }
    $scope.other = {
        repo: ""
    }
    // Initialize user
    $http.get('/api/getUser')
        .success(function(user) {
            $scope.info.username = user.github.name;
            if (user.repo) {
                $scope.info.repo = user.repo;
                $scope.info.repoApi = user.repoApi;
                $scope.helpers.hasProject = true;
            } else {
                $scope.helpers.noProject = true;
            }
        });
    // Get Commit data from Github API
    $scope.getCommitData = function() {
        $scope.info.repoApi = 'https://api.github.com/repos/' + $scope.info.username + '/' + $scope.info.repo + '/commits';
        $http.get($scope.info.repoApi)
            .success(function(data) {
                // This repository has been verified
                $scope.info.verified = true;
            });
    };
    // Register for a project
    $scope.register = function() {
        if ($scope.info.verified) {
            $http.post('/api/registerProject', $scope.info)
                .success(function(data) {
                    if (data === 'Y') {
                        // Successfully registered a project
                        socket.emit('new project', {user:$scope.info.username, repo:$scope.info.repo});
                        alert('Project ' + $scope.info.repo + ' registered!');
                        $window.location.reload();
                    } else {
                        alert('Project ' + $scope.info.repo + ' already exists!');
                    }
                });

        }
    };
    // Delete a project
    $scope.deleteProject = function() {
        $http.post('/api/deleteProject', $scope.info)
        .success(function(data){
            if (data === 'Y') {
                alert('Project ' + $scope.info.repo+' deleted!');
                $window.location.reload();
            }
        })
    }

});