'use strict';


angular.module('core').controller('HomeController', ['$http', '$modal', '$scope', 'Authentication',
	function($http, $modal, $scope, Authentication) {
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


    $scope.markers = {};

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

      //TODO: fish: change url...
      //$http.get('/api/bike_parking', config)
      $http.get('http://192.168.59.103:5002/api/bike_parking', config)
        .success(function(parkingSpots) {
          var key = 0;

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
        .error(function() {
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
      modalInstance.close();
    }


    var modalInstance;

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


	}
])
.controller('ModalStartupCtrl', ['$scope', '$modalInstance', 'message',
  function ($scope, $modalInstance, message) {
    $scope.message = message;

    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };
  }
]);
