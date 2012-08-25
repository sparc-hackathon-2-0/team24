var app = angular.module('app',[]);
var deals = [];
var home = 'active';
var locate = '';

app.config(function($routeProvider) {
    $routeProvider.
      when('/', {controller:HomeCtrl, templateUrl:'home.html'}).
      when('/locate', {controller:LocateCtrl, templateUrl:'locate.html'}).
      otherwise({redirectTo:'/'});
  });

app.directive('pdTap', function() {
  return function(scope, element, attrs) {
    var tapping = false
    element.bind('touchstart', function(){ tapping = true;});
    element.bind('touchmove', function() { tapping = false;});
    if(tapping) {
      element.bind('touchend', function(){ scope.$apply(attrs['pdTap']); });
    }
  }
});

function NavCtrl($scope) {
  $scope.home = home;
  $scope.locate = locate;
}

function HomeCtrl($scope, $window, $http, $location) {
  $scope.deals = [];
  $scope.getDeals = function(){
    $window.navigator.geolocation.getCurrentPosition(function(position) {
      var data = JSON.stringify({ lat: position.coords.latitude, 
        lng:  position.coords.longitude});
      $http.post('/api/deals', data).success(function(data){
        $scope.deals = data;
      });
    });
  }
  $scope.getDeals();
}

function LocateCtrl($scope, $window, $http, $location) {
  $scope.find = function() {
    console.log('clicked find')
    $window.navigator.geolocation.getCurrentPosition(function(position) {
      var data = JSON.stringify({ lat: position.coords.latitude, 
        lng:  position.coords.longitude, name: $scope.name});
      $http.post('/api/locate', data).success(function(data){
        console.log(data);
        $scope.places = data;
      });
    });
  }
}

