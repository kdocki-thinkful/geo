describe("HomeCtrl", function() {

    beforeEach(module('myApp'));

    var dataStore;

 //   jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;

    beforeEach(inject(function (_dataStore_) {
        dataStore = _dataStore_;
    }));


    describe('first dataStore test', function(){
        it('should fetch countries', function(done){
            console.log(dataStore);
            dataStore.fetchCountries().then(function(){
                expect(dataStore.getLength()).toBeGreaterThan(500);
                done();
            });
        }, 10000);
    })


  /*    describe('$scope.home', function () {
   it('should say something when called', function () {
   var $scope = {};
   var controller = $controller('HomeCtrl', {$scope: $scope});
   expect($scope.home).toEqual(true);
   });
   });
    describe('$scope.chunk', function () {
        it('should be 20', function () {
            var $scope = {};
            var controller = $controller('ListCtrl', {$scope: $scope});
            expect($scope.chunk).toEqual(20);
        });
    });

    describe('$scope.totalItems', function () {
        it('should be over 200 if we got data', function () {
            var $scope = {};
            var controller = $controller('ListCtrl', {$scope: $scope});
            expect($scope.totalItems).toBeGreaterThan(200);
        });
    });  */

});
