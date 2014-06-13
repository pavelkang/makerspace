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

visualApp.controller('MainCtrl', function( $scope, $http, commitData, projectData){
	$scope.graphs = ['Bar', 'Force', 'Pie'];
	$scope.selection = 'Bar';
	$scope.data = {
		projects : [], // of objects "project"
		repoData : [], // of arrays of objects "commit"
		barGraphData : [],
	};
	$scope.changeData = function() {
		$scope.data.test[0] = $scope.a;
		$scope.data.test[1] = $scope.b;
		$scope.data.test[2] = $scope.c;
		$scope.data.test[3] = $scope.d;
	};

	
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
var getLength = function(array) {
	return array.length;
}


/*
visualApp.directive('visual', function() {
	return {
		restrict : 'E',
		template : '<div>This is the visual part</div>'
	}
});

visualApp.directive('visualAd', function() {
	return {
		restrict : 'A',
		link : function () {
			alert('Hello World!')
		}
	}
});

visualApp.directive('enter', function() {
	return function(scope, element) {
		element.bind("mouseenter", function() {
			console.log('a')
			element.toggleClass("red");
		})
	}
}) */
