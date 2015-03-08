'use strict';

/**
 * @ngdoc service
 * @name sfBikeDock.dataloader
 * @description
 * # dataloader
 * Service in the sfBikeDock.
 */
angular.module('sfBikeDock')
  .service('dataloader', function ($http, $q, $timeout) {

    return {
      fetch: function(filename) {
        var deferred = $q.defer();

        $timeout(function() {
          $http.get('data/' + filename + '.json').success(function(data) {
            deferred.resolve(data);
          });
        }, 30);

        return deferred.promise;
      }
    };

  });
