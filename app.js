(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService',MenuSearchService)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
.directive('foundItems', FoundItemsDirective);

  NarrowItDownController.$inject = ['MenuSearchService'];
  function NarrowItDownController(MenuSearchService) {
	console.log("*****enter NarrowItDownController");
    var ctrl = this;
    ctrl.searchTerm = '';  // <input ng-model>
	ctrl.found = [];
	var result = [];
	// <button ng-click="ctrl.getMatchedMenuItems();" >...
	ctrl.getMatchedMenuItems = function() {
		// wrong: was using function(searchTerm)
		// wrong: was using function(ctrl.searchTerm)
	   console.log("searchTerm seen in ctrl: ", ctrl.searchTerm);
	   MenuSearchService.getMatchedMenuItems(ctrl.searchTerm).then(function(result) {
		console.log( "result as seen at ctrl: ", result);
		ctrl.found = result;
 	   });
	   console.log( "ctrl.found as seen at ctrl: ", ctrl.found);
	};
	ctrl.removeItem = function(index) {
	  console.log("*****enter ctrl.removeItem()");
	  ctrl.found.splice(index, 1)
	};
	ctrl.onRemove = function(index) {
	  console.log("*****enter ctrl.onRemove()");
	  ctrl.found.splice(index, 1)
	};
	}
  
  MenuSearchService.$inject = ['$http', 'ApiBasePath'];
  function MenuSearchService($http, ApiBasePath) {
	console.log("*****enter MenuSearchService");
    var service = this;
   
    service.getMatchedMenuItems = function (searchTerm) {
	  console.log("*****enter getMatchedMenuItems()");
	  console.log("searchTerm seen in getMatchedMenuItems(): ", searchTerm);
  	  return $http({
        method: "GET",
        url: (ApiBasePath + "/menu_items.json"),
      })
    // process result and only keep items that match
  	.then(function(result){
	    console.log("*****enter getMatchedMenuItems.then()");
	    console.log("searchTerm seen in getMatchedMenuItems.then(): ", searchTerm);
	    console.log("result passed in getMatchedMenuItems.then(): ", result);
		searchTerm = searchTerm.toLowerCase();
        var found = result.data.menu_items.filter(function(item){
          return item.description.toLowerCase().indexOf(searchTerm) !== -1;
        });
        // return processed items
		console.log( "found as seen at getMatchedMenuItems.then(): ", found);
        return found;
      });
    }
  }
  
  FoundItemsDirective.$inject = [];
  function FoundItemsDirective() {
	console.log("*****enter FoundItemsDirective");
    var ddo = {
      templateUrl: 'foundItems.html',
	  // template: '{{ item.name }}, {{ item.short_name }}, {{ item.description }}',
      scope: {
        found: '<',
        onRemove: '&'
      },
      controller: FoundItemsDirectiveController,
      controllerAs: 'ctrl',
      bindToController: true
    };
    return ddo;
  };
    
  function FoundItemsDirectiveController() {};  
})();