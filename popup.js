
var app = angular.module('cors', ['ionic'])
	.constant('config', corsExt.config)
	.controller('PopupCtrl', PopupCtrl);

function PopupCtrl($scope, config) {
	activate();

	function reload() {
		chrome.extension.getBackgroundPage().corsExt.reload();
	}

	function persist(key) {
		config.set(key, $scope[key]);
		reload();
	}

	function activate() {
		angular.extend($scope, config.defaults);
		config.get(listen);
	}

	function watch(key) {
		$scope.$watch(key, persist.bind(this, key));
	}

	function listen(config) {
		angular.extend($scope, config);
		$scope.$apply();
		watch('active');
		watch('allowMethods');
		watch('exposeHeaders');
	}

	$scope.openInNewTab = function(url) {
		chrome.tabs.create({ url: url });
	};

	$scope.addUrl = function() {
		$scope.urls.unshift($scope.url);
		persist('urls');
		$scope.url = '';
	};

	$scope.removeUrl = function(index) {
		$scope.urls.splice(index, 1);
		persist('urls');
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
