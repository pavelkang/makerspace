/*TODO
2. Attach the chat window
3. Use socket.io to emit "new project" events ...
4. Current User online ... Current Number of projects ...
* To Understand
1. scope.$watch
2. deferred
3. socket.io
4. replace: true
5. why elem[0]
* To Watch
1. More AngularJS Videos*/
var visualApp = angular.module('visualApp', ['ngResource']);

// socket.io helper
visualApp.factory('socket', function($rootScope) {
    var socket = io();
    return {
        on: function(eventName, callback) {
            socket.on(eventName, function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    callback.apply(socket, args);
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

visualApp.factory('projectData', function($resource) {
	return $resource('/api/getProjects', {}, {
		query: {method: "GET", params: {}, isArray:true}
	})
})

visualApp.factory('commitData', function($http, $q){
	return {
		apiPath : '/api/getProjects',
		getAllProjects : function() {
			var deferred = $q.defer();
			$http.get('/api/getProjects').success(function(data){
				deferred.resolve(data);
			}).error(function(){
				deferred.reject('An error occurred')
			});
			return deferred.promise;
		},

		getProjInfo : function(project) {
			var deferred = $q.defer();
			$http.get(project.repoApi)
			.success(function(data){
				deferred.resolve(data);
			})
			.error(function(){
				deferred.reject('An error occurred!')
			});
			return deferred.promise;
		}
	}
})

visualApp.controller('MainCtrl', function($scope, $http, commitData, projectData, socket){
	$scope.graphs = ['Bar', 'Force', 'Pie'];
	$scope.selection = 'Bar';
	$scope.data = {
		message : '', // message in the chat
		messages : [], // all messages
		projects : [], // of objects "project"
		repoData : [], // of arrays of objects "commit"
		barGraphData : [],
	};
	
	socket.on('New Message', function(msg){
		console.log(msg)
		$scope.data.messages.push(msg);
		console.log($scope.data.messages)
	});

	// Delete
	$scope.changeData = function() {
		$scope.data.barGraphData[0] = $scope.a;
		$scope.data.barGraphData[1] = $scope.b;
		$scope.data.barGraphData[2] = $scope.c;
		$scope.data.barGraphData[3] = $scope.d;
	};
	
	/* Send message in Chat */
	$scope.sendMessage = function() {
		socket.emit('New Message', $scope.data.message);
		$scope.data.message = '';
	}

	/*Retrieve all registered projects*/
	function getData() {
		commitData.getAllProjects().then(function(data){
			$scope.data.projects = data;
			data.forEach(function(project){
				commitData.getProjInfo(project).then(function(data){
					// Better data structure
					$scope.data.barGraphData.push(data.length);
				})
			})
		}, function(errMessage) {
			$scope.error = errMessage;
		});
	};

	getData();
});

// Bar Graph Directive
visualApp.directive('barGraph', function(){
	function link(scope, elem, attr) {
		var data = scope.data;
		var el = elem[0]; // ???
		var w = el.clientWidth;
		var h = el.clientHeight;
		// Title
		var vis = d3.select(el).append("h2")
		.text("Bar Graph")
		// Graph
		var render = function(data) {
		vis.selectAll('div')
        .data(data)
        .enter().append('div')
        .style('width', function(d){return d+'%';})
        .style('padding-right', '5px')
        .style('margin', '3px')
        .style('background-color', 'tomato')
        .style('color' , 'white')
        .style('text-align' , 'right')
        .text(function(d){return d;}); }
		render(data);
		scope.$watch('data', function(newData, oldData){
			if (!newData) { return ;}
			else {
				vis.selectAll('*').remove();
				render(newData);
			}
		}, true)
	};
	return {
		restrict : 'E',
		link : link,
		replace : true,
		scope : {
			data : '='
		}
	}
})

// Force Graph Directive
visualApp.directive('forceGraph', function(){
	var link = function(scope, elem, attr) {
		var data = scope.data;
		var el = elem[0];
		var vis = d3.select(el).append('h2').text('Force Graph')
	}
	return {
		restrict : 'E',
		link : link,
		replace : true,
		scope : {
			data : '='
		}
	}
})

// Pie Graph Directive
visualApp.directive('pieGraph', function(){
	var link = function(scope, elem, attr) {
		var data = scope.data;
		var el = elem[0];
		var vis = d3.select(el).append('h2').text('Pie Graph')
	}
	return {
		restrict : 'E',
		link : link,
		replace : true,
		scope : {
			data : '='
		}
	}
})


// Helper functions

