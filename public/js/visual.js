var visualApp = angular.module('visualApp', ['ngResource']);

visualApp.factory('projectData', function($resource) {
	return $resource('/api/getProjects', {}, {
		query: {method: "GET", params: {}, isArray:true}
	})
})

visualApp.controller('MainCtrl', function($scope, $http, $timeout, projectData){
	$scope.data = {
		projects: []
	};
	/*
	(function tick() {
		$scope.data.projects = projectData.query(function(){
			$timeout(tick, 5000);
		});
	})() */
});








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