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
		getProjInfo : function(projects) {
			// projects is a list of repos
			var deferred = $q.defer();
			projects.forEach(function(project) {
				$http.get()
			})
		}
	}
})

visualApp.controller('MainCtrl', function( $scope, $http, commitData, projectData){
	$scope.data = {
		projects : [],
		repoData : [],
		test : [],
	};
	/*
	(function tick() {
		$scope.data.projects = projectData.query(function(){
			$timeout(tick, 50000);
		});
	})() */
	$scope.print = function() {
		console.log($scope.data.test)
	}
	/*
	$http.get('/api/getProjects').success(function(data){
		$scope.data.projects = data;
		$scope.data.projects.forEach(function(project){
			// Get project information
			$http.get(project.repoApi)
			.success(function(repoData){
				// Each repoData is an array of commits
				$scope.data.repoData.push(repoData);
				$scope.data.test.push(repoData.length);
			});
		});
	}); */
	function getData() {
		commitData.getAllProjects().then(function(data){
			$scope.data.projects = data;
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
		console.log(w);
		console.log(h);
		// Title
		d3.select(el).append("h2")
		.text("Bar Graph")

		// Graph
		d3.select(el).selectAll('div')
        .data(data)
        .enter().append('div')
        .style('width', function(d){return d+'%';})
        .style('padding-right', '5px')
        .style('margin', '3px')
        .style('background-color', 'tomato')
        .style('color' , 'white')
        .style('text-align' , 'right')
        .text(function(d){return d;})
		scope.$watch('data', function(data){
			console.log('hi');
			console.log(data)
		})
	};
	return {
		restrict : 'E',
		link : link,
		scope : {
			data : '='
		}
	}
})



// Helper functions







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
})
*/