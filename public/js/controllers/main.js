'use strict';

/**
 * @ngdoc function
 * @name sfBikeDock.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sfBikeDock
 */
angular.module('sfBikeDock')
  .controller('MainCtrl', function ($modal, $scope, dataloader, geocode) {

    //*******************************
    // Map Handling
    //*******************************

    var lowIcon = {
        type: 'makiMarker',
        icon: 'circle',
        color: '#9dbad0',
        size: 's'
    };

    var mediumIcon = {
        type: 'makiMarker',
        icon: 'square',
        color: '#4394dd',
        size: 'm'
    };

    var highIcon = {
        type: 'makiMarker',
        icon: 'triangle',
        color: '#d04e4b',
        size: 'l'
    };


    $scope.markers = {};

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


    //Maps
    angular.extend($scope, {
      sanfrancisco: {
        lat: 37.77,
        lng: -122.42,
        zoom: 13
      },
      legend: {
        position: 'bottomleft',
        colors: [ '#d04e4b', '#4394dd', '#9dbad0' ],
        labels: [ 'Very High', 'High', 'Medium' ]
      },
      layers: {
        baselayers: {
          googleRoadmap: {
            name: 'Google Streets',
            layerType: 'ROADMAP',
            type: 'google'
          },
          /*
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
          osm: {
            name: 'OpenStreetMap',
            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            type: 'xyz'
          },
          */
        }
      }
    });


    var incidentsDict = {};

/*
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



    function successFunction(position) {
      var lat = position.coords.latitude;
      var lng = position.coords.longitude;
      console.log('Your latitude is: ' + lat + ' and longitude is: ' + lng);

      $scope.markers['me'] = {
        lat: lat,
        lng: lng,
        message: 'Your Location',
        focus: true,
        draggable: false
      };

      $scope.sanfrancisco.lat = lat;
      $scope.sanfrancisco.lng = lng;
      $scope.sanfrancisco.zoom = 16;

      modalInstance.close();
    };



    function errorFunction(error) {
      console.log('Error getting location:');
      console.log(error);

      modalInstance.close();
    };


    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
    } else {
      console.log('It seems like Geolocation, which is required for this page, is not enabled in your browser. Please use a browser which supports it.');
    }



    var modalInstance = $modal.open({
      templateUrl: 'views/startup.html',
      controller: 'ModalStartupCtrl',
      size: 'sm'
    });



  }
)
.controller('ModalStartupCtrl',
  function ($scope, $modalInstance) {

    $scope.cancel = function() {
      $modalInstance.close();
    };

  }
);
