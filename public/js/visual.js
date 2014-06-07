var visualApp = angular.module('visualApp', []);

visualApp.controller('MainCtrl', function($scope, $http){
	$scope.data = {
		yes : "Yes"
	}
})

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
		element.bind("mouseHover", function() {
			console.log('a')
			element.toggleClass("red");
		})
	}
})