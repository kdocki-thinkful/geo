angular.module('myApp', ['ngRoute', 'ngAnimate'])
.config(function($routeProvider){
	$routeProvider
	.when('/', {
	    templateUrl : './home.html',
	    controller : 'HomeCtrl'
	})      
	.when('/countries', {
	    templateUrl : './list.html',
	    controller : 'ListCtrl',
	})
	.when('/country/:countryCode', {
	    templateUrl : './country.html',
	    controller : 'ItemCtrl',
	})
})
.run(function($rootScope, $location, $timeout) {
    $rootScope.$on('$routeChangeStart', function() {
        $rootScope.isLoading = true;
    });
    $rootScope.$on('$routeChangeSuccess', function() {
      $timeout(function() {
        $rootScope.isLoading = false;
      }, 1000);
    });
})
.factory("dataStore", function Data(){
	var country = {};
	var countries = [];

	return {
		getCountry: function(cc){
			for (var i = 0; i < countries.length; i++){
				if (countries[i].countryCode === cc)		
					break;
			}
			return countries[i];
		},
		setCountry: function(countryName, countryCode, capital, area, pop, cont){
			country = {}
			country.countryName = countryName;
			country.countryCode = countryCode;
			country.capital = capital;
			country.area = area; 
			country.pop = pop; 
			country.cont = cont;
			countries.push(country);
		},
		getCountries: function(){
			return countries;
		},
		isLoaded: function(){
			if (countries.length === 0) 
				return false;
			else 
				return true;
		}
	};
})
.controller('ListCtrl', function($scope, $http, dataStore) {
	if (!dataStore.isLoaded()){
	    $http({method: 'GET', url: "http://api.geonames.org/countryInfoJSON?username=paulkav1"})
	    .success(function(data, status, headers, config) {
			for (var i = 0; i < data.geonames.length; i++){
				dataStore.setCountry(data.geonames[i].countryName, data.geonames[i].countryCode, data.geonames[i].capital, 
				data.geonames[i].areaInSqKm, data.geonames[i].population, data.geonames[i].continent);			
			}			
	    })
	    .error(function(data, status, headers, config) {
			alert('fail');	
	    });
	    // put the loading animation here
	}
	$scope.countries = dataStore.getCountries();    
})		
.controller('HomeCtrl', function($scope) {
    //empty
})
.controller('ItemCtrl', function($scope, $http, $routeParams, dataStore) {
	$scope.cc = $routeParams.countryCode;
	$scope.country = dataStore.getCountry($scope.cc);
	$scope.cclc = $scope.cc.toLowerCase();
	cap_url = "http://api.geonames.org/searchJSON?q=london&country=" + $scope.cc + "&name_equals=London&isNameRequired&username=paulkav1";
	neigh_url = "http://api.geonames.org/neighboursJSON?country=" + $scope.cc + "&username=paulkav1";
    $http({method: 'GET', url: cap_url})
    .success(function(data, status, headers, config) {
    	console.log(data);
		$scope.cappop = data.geonames.capital;		
    })
    .error(function(data, status, headers, config) {
		alert('fail');	
    });
    $http({method: 'GET', url: neigh_url})
    .success(function(data, status, headers, config) {
    	console.log(data);
    	$scope.neighbors = [];
		for (var i = 0; i < data.geonames.length; i++){    	
			$scope.neighbors[i] = data.geonames[i].countryName;	//make neighbors links
		}	
    })
    .error(function(data, status, headers, config) {
		alert('fail');	
    });
});
