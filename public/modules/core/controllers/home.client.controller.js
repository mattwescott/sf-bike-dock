'use strict';


angular.module('core').controller('HomeController', ['$http', '$modal', '$scope', 'Authentication', 'Logger',
  function($http, $modal, $scope, Authentication, Logger) {
    $scope.authentication = Authentication;

    //*******************************
    // Map Handling
    //*******************************

    var meIcon = {
        type: 'makiMarker',
        icon: 'marker',
        color: '#d04e4b',
        size: 's'
    };

    var bikeIcon = {
        type: 'makiMarker',
        icon: 'bicycle',
        color: '#4394dd',
        size: 'm'
    };

    var modalInstance;

    $scope.markers = {};

    $scope.init = function() {
      //Maps
      angular.extend($scope, {
        sanfrancisco: {
          lat: 37.77,
          lng: -122.42,
          zoom: 13
        },
        layers: {
          baselayers: {
            googleRoadmap: {
              name: 'Google Streets',
              layerType: 'ROADMAP',
              type: 'google'
            },
            googleHybrid: {
              name: 'Google Hybrid',
              layerType: 'HYBRID',
              type: 'google'
            },
            googleTerrain: {
              name: 'Google Terrain',
              layerType: 'TERRAIN',
              type: 'google'
            },
            /*
            osm: {
              name: 'OpenStreetMap',
              url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
              type: 'xyz'
            },
            */
          }
          /*
          legend: {
            position: 'bottomleft',
            colors: [ '#d04e4b', '#4394dd', '#9dbad0' ],
            labels: [ 'Very High', 'High', 'Medium' ]
          },
          */
        }
      });

      if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successFunction, errorFunction);

        $scope.statusMessage = 'Finding your location...';

        modalInstance = $modal.open({
          templateUrl: 'modules/core/views/startup.html',
          controller: 'ModalStartupCtrl',
          resolve: {
            message: function () {
              return $scope.statusMessage;
            }
          },
          size: 'sm'
        });
        /*
        modalInstance.result.then(function(bikeParking) {

        });
        */
      }
      else {
        alert('It seems like Geolocation, which is required for this page, is not enabled in your browser. Please use a browser that supports it.');
      }
    };


    //*******************************
    // Find Nearby Parking
    //*******************************

    var findNearByParking = function() {
      var config = {
        params: {
          lat: $scope.myLat,
          long: $scope.myLng,
          n: 100
        }
      };

      Logger.activity('request-parking', { config: config }, $scope.myLng, $scope.myLat);

      $http.get('/api/bike_parking', config)
        .success(function(parkingSpots) {
          var key = 0;

          Logger.activity('request-parking-success', { spotsFound: parkingSpots.length }, $scope.myLng, $scope.myLat);

          parkingSpots.forEach(function(parkingSpot) {
            $scope.markers[key] = {
              lat: parkingSpot.LAT_LONG[0],
              lng: parkingSpot.LAT_LONG[1],
              message: '<strong>' + parkingSpot.LOCATION_NAME + '</strong><br/>' +
                        parkingSpot.ADDRESS + '<br/><br/><strong>' + parkingSpot.SPACES + '</strong> Spaces, <strong>' +
                        parkingSpot.RACKS + '</strong> Rack' + (parkingSpot.RACKS > 1 ? 's' : ''),
              focus: false,
              draggable: false
            };
            $scope.markers[key].icon = bikeIcon;
            key++;
          });

          modalInstance.close();
        })
        .error(function(error) {
          Logger.activity('request-parking-error', { error: error }, $scope.myLng, $scope.myLat);
          modalInstance.close();
        });
    };


    //*******************************
    // GeoLocation
    //*******************************

    function successFunction(position) {
      $scope.myLat = position.coords.latitude;
      $scope.myLng = position.coords.longitude;

      $scope.markers.me = {
        lat: $scope.myLat,
        lng: $scope.myLng,
        message: 'Your Location',
        focus: true,
        draggable: false
      };
      $scope.markers.me.icon = meIcon;

      $scope.sanfrancisco.lat = $scope.myLat;
      $scope.sanfrancisco.lng = $scope.myLng;
      $scope.sanfrancisco.zoom = 18;

      $scope.statusMessage = 'Finding nearby bike parking...';

      findNearByParking();
    }


    function errorFunction(error) {
      console.log('Error getting location:');
      console.log(error);
      Logger.activity('get-location-error', { error: error });
      modalInstance.close();
    }



  }
])
.controller('ModalStartupCtrl', ['$scope', '$modalInstance', 'Logger', 'message',
  function ($scope, $modalInstance, Logger, message) {
    $scope.message = message;

    $scope.cancel = function() {
      Logger.activity('request-parking-canceled', { error: { message: 'User canceled.' } }, $scope.myLng, $scope.myLat);
      $modalInstance.dismiss('cancel');
    };
  }
]);
