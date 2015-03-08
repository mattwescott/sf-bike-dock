'use strict';

/**
 * @ngdoc function
 * @name sfBikeDock.controller:HeaderCtrl
 * @description
 * # HeaderCtrl
 * Controller of the sfBikeDock
 */
angular.module('sfBikeDock')
  .controller('HeaderCtrl', function ($scope, $location) {

    $scope.isCollapsed = false;

    $scope.toggleCollapsibleMenu = function() {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    $scope.isActive = function(viewLocation) {
      return viewLocation === $location.path();
    };

  });
