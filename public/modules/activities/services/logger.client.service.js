'use strict';

angular.module('activities').factory('Logger', ['Activities', 'deviceDetector',
  function(Activities, deviceDetector) {

    // Logger service logic
    var machine = Math.floor(Math.random() * (16777216));

    var setMachineCookie = function() {
      var cookieList = document.cookie.split('; ');
      for(var i in cookieList) {
        var cookie = cookieList[i].split('=');
        var cookieMachineId = parseInt(cookie[1], 10);
        if(cookie[0] === 'machineId' && cookieMachineId && cookieMachineId >= 0 && cookieMachineId <= 16777215) {
          machine = cookieMachineId;
          break;
        }
      }
      document.cookie = 'machineId=' + machine + ';expires=Tue, 19 Jan 2038 05:00:00 GMT;path=/';
    };

    if(typeof (localStorage) !== 'undefined') {
      try {
        var machineId = parseInt(localStorage.machineId);
        if(machineId >= 0 && machineId <= 16777215) {
          machine = Math.floor(localStorage.machineId);
        }
        // Just always stick the value in.
        localStorage.machineId = machine;
      } catch(e) {
        setMachineCookie();
      }
    }
    else {
      setMachineCookie();
    }

    // Public API
    return {
      activity: function(type, activityData, longitude, latitude) {

        var loc = [];

        if(typeof longitude !== 'undefined' && typeof latitude !== 'undefined') {
          loc.push(longitude);  //longitude is always first.
          loc.push(latitude);
        }

        // Create new Activity object
        var activity = new Activities ({
          type: type,
          activityData: activityData,
          userAgent: deviceDetector.raw.userAgent,
          userAgentDeciphered: {
            browser: deviceDetector.browser,
            browserVersion: deviceDetector.browser_version,
            os: deviceDetector.os,
            osVersion: deviceDetector.os_version,
            device: deviceDetector.device,
            isMobile: deviceDetector.isMobile(),
            isTablet: deviceDetector.isTablet(),
            isDesktop: deviceDetector.isDesktop(),
          },
          machineId: machine,
          loc: loc,
        });

        activity.$save();
        /*
        activity.$save(function(response) {
          console.log('logged activity: ' + type);
        }, function(errorResponse) {
          console.log('error: ' + errorResponse.data.message);
        });
        */

      }


    };
  }
]);