'use strict';

/**
 * @ngdoc overview
 * @name sfBikeDock
 * @description
 * # sfBikeDock
 *
 * Main module of the application.
 */
angular
  .module('sfBikeDock', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngStorage',
    'ngTouch',
    'leaflet-directive'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
