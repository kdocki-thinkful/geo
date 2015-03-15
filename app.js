angular.module('myApp', ['ngRoute', 'ngAnimate', 'ngTable', 'angularSpinner'])
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
.factory("dataStore", function Data($rootScope, $http){
	var country = {};
	var countries = [];
	setCountry = function(countryName, countryCode, capital, area, pop, cont){
		country = {}
		country.countryName = countryName;
		country.countryCode = countryCode;
		country.capital = capital;
		country.area = area; 
		country.pop = pop; 
		country.cont = cont;
		countries.push(country);
	};
	fetchCountries = function(){
		$rootScope.ajaxLoading = true;
	    $http({method: 'GET', url: "http://api.geonames.org/countryInfoJSON?username=paulkav1"})
	    .success(function(data, status, headers, config) {
			for (var i = 0; i < data.geonames.length; i++){
				setCountry(data.geonames[i].countryName, data.geonames[i].countryCode, data.geonames[i].capital, 
					data.geonames[i].areaInSqKm, data.geonames[i].population, data.geonames[i].continent);
				$rootScope.ajaxLoading = false;		
			}			
	    })
	    .error(function(data, status, headers, config) {
			alert('fail');
			$rootScope.ajaxLoading = false;
	    });
	};
	return {
		getCountry: function(cc){
			if (countries.length === 0) fetchCountries();
			for (var i = 0; i < countries.length; i++){
				if (countries[i].countryCode === cc)		
					break;
			}
			return countries[i];
		},
		getCountries: function(){
			if (countries.length === 0) fetchCountries();			
			return countries;
		},
		getLength: function(){
			if (countries.length === 0) fetchCountries();			
			return countries.length;
		},
	};
})
.controller('ListCtrl', function($scope, dataStore, ngTableParams) {
	$scope.countries = dataStore.getCountries(); 
	var len = dataStore.getLength();
    $scope.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 25           // count per page
    }, {
        total: len,
        getData: function($defer, params) {
            $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
    });	   
})		
.controller('HomeCtrl', function($scope, usSpinnerService) {
    usSpinnerService.spin('sp1');
})
.controller('ItemCtrl', function($scope, $http, $routeParams, dataStore) {
	$scope.cc = $routeParams.countryCode;
	$scope.country = dataStore.getCountry($scope.cc);
	$scope.cclc = $scope.cc.toLowerCase();
	cap_url = "http://api.geonames.org/searchJSON?q=" + $scope.country.capital + "&country=" + $scope.cc
	 + "&name_equals=" + $scope.country.capital + "&username=paulkav1";
	neigh_url = "http://api.geonames.org/neighboursJSON?country=" + $scope.cc + "&username=paulkav1";
    $http({method: 'GET', url: cap_url})
    .success(function(data, status, headers, config) {
		$scope.cappop = data.geonames[0].population;		
    })
    .error(function(data, status, headers, config) {
		alert('fail');	
    });
    $http({method: 'GET', url: neigh_url})
    .success(function(data, status, headers, config) {	
    	$scope.neighbors = [];
		for (var i = 0; i < data.geonames.length; i++){
    		$scope.neighbor = {};			
			$scope.neighbor.code = data.geonames[i].countryCode;
			$scope.neighbor.name = data.geonames[i].countryName; 			
			$scope.neighbors[i] = $scope.neighbor;
		}
		$scope.nn = data.geonames.length;
    })
    .error(function(data, status, headers, config) {
		alert('fail');	
    });
});
