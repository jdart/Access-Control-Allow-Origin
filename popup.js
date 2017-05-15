
var app = angular.module('cors', ['ionic']);

app.controller('PopupCtrl', ['$scope', PopupCtrl]);

function PopupCtrl($scope) {
	angular.extend($scope, config.defaults);

	config.get(function(result) {
		angular.extend($scope, result);
		$scope.$apply();

		$scope.$watch('active', function(newValue, oldValue) {
			chrome.storage.local.set({'active': $scope.active});
			chrome.extension.getBackgroundPage().reload();
		});

		$scope.$watch('allowedMethods', function(newValue, oldValue) {
			chrome.storage.local.set({'allowedMethods': $scope.allowedMethods});
			chrome.extension.getBackgroundPage().reload();
		});

		$scope.$watch('exposedHeaders', function(newValue, oldValue) {
			chrome.storage.local.set({'exposedHeaders': $scope.exposedHeaders});
			chrome.extension.getBackgroundPage().reload();
		});
	});

	$scope.openInNewTab = function(url) {
		chrome.tabs.create({ url: url });
	};

	$scope.addUrl = function() {
		$scope.urls.unshift($scope.url);
		chrome.storage.local.set({'urls': $scope.urls});
		$scope.url = '';
		chrome.extension.getBackgroundPage().reload();
	};

	$scope.removeUrl = function(index) {
		$scope.urls.splice(index, 1);
		chrome.storage.local.set({'urls': $scope.urls});
		chrome.extension.getBackgroundPage().reload();
	};
}

app.directive("textOption", function() {
	return {
		restrict: 'E',
		scope: {
			option: '=',
			placeholder: '@'
		},
		templateUrl: 'text-option.html',
		controller: function($scope) {
			$scope.editing = false;

			$scope.onEdit = function() {
				$scope.editableOption = $scope.option;
				$scope.editing = true;
			};

			$scope.onCancel = function() {
				$scope.editing = false;
			};

			$scope.onSave = function() {
				$scope.option = $scope.editableOption;
				$scope.editing = false;
			};
		}
	};
});

app.directive('submitOnEnter', function() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			$(element).on('keydown', function(e) {
				if (e.which == 13) {
					$(element).parents('.item').find('.submit-action').trigger('click');
				}
			});
		}
	};
});
