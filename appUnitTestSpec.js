describe("the data store", function() {

    var dataStore, $httpBackend, $rootScope;

    beforeEach(module('myApp'));

    beforeEach(inject(function (_dataStore_, _$httpBackend_, _$rootScope_) {
        dataStore = _dataStore_;
        $httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingRequest();
    });

    //
    // tests below
    //
    it('should fetch countries', function(){
        var response = {geonames: [{ countryName: 'USA', countryCode : 123, capital: 'Springfield', areaInSqKm: 100000, population: 60000, continent: "North America" } ]};
        $httpBackend.expect('GET', 'http://api.geonames.org/countryInfoJSON?username=paulkav1').respond(200, response);
        dataStore.fetchCountries();
        $rootScope.$digest();
        $httpBackend.flush();
        expect(dataStore.getLength()).toEqual(1);
    });

});
