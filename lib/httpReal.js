// http://stackoverflow.com/questions/20864764/e2e-mock-httpbackend-doesnt-actually-passthrough-for-me/26992327#26992327
angular.module('httpReal', ['ng'])
.config(['$provide', function($provide) {
    $provide.decorator('$httpBackend', function() {
        return angular.injector(['ng']).get('$httpBackend');
    });
}])
.service('httpReal', ['$rootScope', function($rootScope) {
    this.submit = function() {
        $rootScope.$digest();
    };
}]);