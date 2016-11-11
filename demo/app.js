var app = angular.module('AndragAndropDemo', [ 'ngMaterial', 'hljs', 'AndragAndrop' ])
.config(function($mdThemingProvider) {
   $mdThemingProvider.theme('default')
   .primaryPalette('deep-orange')
   .accentPalette('indigo');
})
.controller('MainController', function(DragInfo) {
});
