var app = angular.module('myApp', ['ngRoute', 'ngAnimate', 'ui.bootstrap']);

app.config(function($routeProvider){
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
	    resolve: {
	    	countries: function(dataStore){
		    	return dataStore.fetchCountries();
		    }
	    }
	})
});

app.run(function($rootScope, $location) {
    $rootScope.$on('$routeChangeStart', function() {
        $rootScope.isLoading = true;
    });
    $rootScope.$on('$routeChangeSuccess', function() {
        $rootScope.isLoading = false;
    });
});

app.factory("dataStore", function Data($rootScope, $http){
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

	return {
		fetchCountries: function(){
			if ($rootScope.ajaxLoaded === true)
				return;
			console.log('here 0');
		    return $http({method: 'GET', url: "http://api.geonames.org/countryInfoJSON?username=paulkav1"})
		    .success(function(data, status, headers, config) {
					console.log('here 1');
				for (var i = 0; i < data.geonames.length; i++){
					setCountry(data.geonames[i].countryName, data.geonames[i].countryCode, data.geonames[i].capital, 
						data.geonames[i].areaInSqKm, data.geonames[i].population, data.geonames[i].continent);
					$rootScope.ajaxLoaded = true;
				}			
		    })
		    .error(function(data, status, headers, config) {
					console.log('fail');
				alert('fail');
				$rootScope.ajaxLoaded = false;			
		    });
		},		
		getCountry: function(cc){
			for (var i = 0; i < countries.length; i++){
				if (countries[i].countryCode === cc)		
					break;
			}
			return countries[i];
		},
		getCountries: function(start, chunk){
			var first = (start - 1) * chunk;			
			return countries.slice(first, first + chunk); //
		},
		getLength: function(){		
			return countries.length;
		},
	};
});

app.controller('ListCtrl', function($scope, dataStore) {
 	 $scope.currentPage = 1;
 	 $scope.chunk = 20;

 	 dataStore.fetchCountries();
	 $scope.ajaxLoading = true;
     setTimeout(function() {
     	$scope.countries = dataStore.getCountries($scope.currentPage, $scope.chunk);
		$scope.totalItems = dataStore.getLength(); 	 
	    $scope.numPages = $scope.totalItems / $scope.chunk; 
		$scope.ajaxLoading = false;	        	
     	$scope.$apply();
     }, 2000);  	 	

  	 $scope.setPage = function (pageNo) {
     	$scope.currentPage = pageNo;	
  	 };

     $scope.pageChanged = function() {
	 	$scope.countries = dataStore.getCountries($scope.currentPage, $scope.chunk);
     }; 	    
});

app.controller('HomeCtrl', function($scope) {
	$scope.home = true;
});

app.controller('ItemCtrl', function($scope, $http, $routeParams, dataStore) {
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
