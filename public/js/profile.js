var profileApp = angular.module('profileApp', []);

profileApp.controller('AppCtrl', function($scope, $http) {
    $scope.info = {
        username: "",
        repo: "",
        repoApi: "",
        hasProject: false,
        verified: false
    };
    $scope.other = {
        repo: ""
    }
    // Initialize user
    $http.get('/api/getUser')
        .success(function(user) {
            $scope.info.username = user.github.name;
            $scope.info.hasProject = user.hasProject;
        });
    // Get Commit data from Github API
    $scope.getCommitData = function() {
        $scope.info.repoApi = 'https://api.github.com/repos/' + $scope.info.username + '/' + $scope.info.repo + '/commits';
        $http.get($scope.info.repoApi)
            .success(function(data) {
                // This repository has been verified
                $scope.info.verified = true;
                console.log(data);
            });
    };
    // Register for a project
    $scope.register = function() {
        if ($scope.info.verified) {
            console.log('hi');
            $http.post('/api/registerProject', $scope.info)
                .success(function(data) {
                    if (data === 'Y') {
                        alert('Project ' + $scope.info.repo + ' registered!');
                    } else {
                        alert('Project ' + $scope.info.repo + ' already exists!');
                    }
                });
        }
    };


});