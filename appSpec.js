describe("the data store", function() {

    var dataStore, $httpBackend, $rootScope;

    beforeEach(module('myApp', 'httpReal'));

    beforeEach(inject(function (_dataStore_, _$httpBackend_, _$rootScope_) {
        dataStore = _dataStore_;
        $httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;
    }));

    //
    // tests below
    //
    it('should fetch countries', function(done){

        dataStore.fetchCountries().then(function(){
            expect(dataStore.getLength()).toBeGreaterThan(200);
            done();
        });

        $rootScope.$digest();

    }, 3000);

});
