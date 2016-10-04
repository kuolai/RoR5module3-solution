(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService',MenuSearchService)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
.directive('foundItems', FoundItemsDirective);

  function FoundItemsDirective() {
    var ddo = {
      templateUrl: 'foundItems.html',
      scope: {
        found: '<',
		myTitle: '@title',
        onRemove: '&'
      },
      controller: NarrowItDownController,
      controllerAs: 'ctrl',
      bindToController: true
    };
    return ddo;
  }
  
  NarrowItDownController.$inject = ['MenuSearchService'];
  function NarrowItDownController(MenuSearchService) {
    var ctrl = this;
	ctrl.title = "Matched menu list";
	ctrl.found = [];
	
    ctrl.searchTerm = '';
    ctrl.found = MenuSearchService.getMatchedMenuItems(ctrl.searchTerm);
	
	ctrl.removeItem = function(index) {
		ctrl.found.splice(index, 1)
	}
  }
  
  MenuSearchService.$inject = ['$http', 'ApiBasePath']
  function MenuSearchService($http, ApiBasePath) {
    var service = this;
   
    service.getMatchedMenuItems = function (searchTerm) {
  	return $http({
        method: "GET",
        url: (ApiBasePath + "/menu_items.json"),
      })
    // process result and only keep items that match
  	.then(function(result){
        var found = result.data.menu_items.filter(function(item){
          return item.description.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1;
        });
        // return processed items
        return found;
      });
    }
  }

})();