'use strict';

/**
 * @ngdoc function
 * @name sfBikeDock.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sfBikeDock
 */
angular.module('sfBikeDock')
  .controller('MainCtrl', function ($http, $modal, $scope, dataloader, geocode) {

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
      /*
      legend: {
        position: 'bottomleft',
        colors: [ '#d04e4b', '#4394dd', '#9dbad0' ],
        labels: [ 'Very High', 'High', 'Medium' ]
      },
      */
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
          n: 10
        }
      };

      $http.get('http://192.168.1.76:5000/api/bike_parking', config)
      //$http.get('js/services/test.json')
        .success(function(response) {
          console.log('got nearby parking.');
          console.log(response);

        });

      var key = '1';
      $scope.markers[key] = {
        lat: 37.74883300,
        lng: -122.41772000,
        message: 'Paisano\'s',
        focus: false,
        draggable: false
      };
      $scope.markers[key].icon = bikeIcon;

      key = '2';
      $scope.markers[key] = {
        lat: 37.74849700,
        lng: -122.41866200,
        message: 'Mermaid Tattoo',
        focus: false,
        draggable: false
      };
      $scope.markers[key].icon = bikeIcon;

      key = '3';
      $scope.markers[key] = {
        lat: 37.74785345,
        lng: -122.41817051,
        message: 'Carecen',
        focus: false,
        draggable: false
      };
      $scope.markers[key].icon = bikeIcon;

      key = '4';
      $scope.markers[key] = {
        lat: 37.74751200,
        lng: -122.41830800,
        message: 'medical building',
        focus: false,
        draggable: false
      };
      $scope.markers[key].icon = bikeIcon;

      key = '5';
      $scope.markers[key] = {
        lat: 37.74764800,
        lng: -122.41944900,
        message: 'Career Link Center',
        focus: false,
        draggable: false
      };
      $scope.markers[key].icon = bikeIcon;

      key = '6';
      $scope.markers[key] = {
        lat: 37.74699800,
        lng: -122.41865300,
        message: 'Coffee Shop',
        focus: false,
        draggable: false
      };
      $scope.markers[key].icon = bikeIcon;

    };


    //*******************************
    // GeoLocation
    //*******************************

    function successFunction(position) {
      $scope.myLat = position.coords.latitude;
      $scope.myLng = position.coords.longitude;

      $scope.markers['me'] = {
        lat: $scope.myLat,
        lng: $scope.myLng,
        message: 'Your Location',
        focus: true,
        draggable: false
      };
      $scope.markers['me'].icon = meIcon;

      $scope.sanfrancisco.lat = $scope.myLat;
      $scope.sanfrancisco.lng = $scope.myLng;
      $scope.sanfrancisco.zoom = 18;

      modalInstance.close();

      findNearByParking();
    };


    function errorFunction(error) {
      console.log('Error getting location:');
      console.log(error);
      modalInstance.close();
    };


    var modalInstance;

    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(successFunction, errorFunction);

      modalInstance = $modal.open({
        templateUrl: 'views/startup.html',
        controller: 'ModalStartupCtrl',
        size: 'sm'
      });
    }
    else {
      alert('It seems like Geolocation, which is required for this page, is not enabled in your browser. Please use a browser that supports it.');
    }



/*
    //*******************************
    // Old Code from Bayes Impact
    //*******************************

    var incidentsDict = {};

    var addLocationToMap = function(data, location) {

      var incidents = data[location];

      var incidentsString = '';
      var violenceLevel = 0;

      for(var i=0; i < incidents.length; i++) {
        incidentsString += incidentsDict[incidents[i]].inc_offense;  //jshint ignore:line

        if(incidentsDict[incidents[i]].violence_level === '1') {  //jshint ignore:line
          incidentsString += ' *<br/>';
        }
        else if(incidentsDict[incidents[i]].violence_level === '2') {  //jshint ignore:line
          incidentsString += ' **<br/>';
        }
        else if(incidentsDict[incidents[i]].violence_level === '3') {  //jshint ignore:line
          incidentsString += ' ***<br/>';
        }

        violenceLevel += parseInt(incidentsDict[incidents[i]].violence_level);  //jshint ignore:line
      }

      var message = '<strong>' + location + ', Total Violence Level: ' + violenceLevel + '</strong><br/><br/>';

      message += incidentsString;

      geocode.latLngForAddress(location + ', High Point, NC').then(function(address) { //jshint ignore:line

        var key = location.replace(/-/g, ' '); //jshint ignore:line

        $scope.markers[key] = {
          lat: address.lat,
          lng: address.lng,
          message: message,
          focus: false,
          draggable: false
        };

        if(violenceLevel <= 10) {
          $scope.markers[key].icon = lowIcon;
        }
        else if(violenceLevel > 10 && violenceLevel <= 20) {
          $scope.markers[key].icon = mediumIcon;
        }
        else if(violenceLevel > 20) {
          $scope.markers[key].icon = highIcon;
        }

      });

    };


    dataloader.fetch('incidents_dict').then(function(data) {
      incidentsDict = data;

      //Load file data to place locations on the map.
      dataloader.fetch('_top_incidents_per_address').then(function(data) {
        for(var object in data) {
          addLocationToMap(data, object);
        }
      });

    });
*/


  }
)
.controller('ModalStartupCtrl',
  function ($scope, $modalInstance) {

    $scope.cancel = function() {
      $modalInstance.close();
    };

  }
);
