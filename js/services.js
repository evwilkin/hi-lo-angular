angular.module("HiLoServices", [])
.factory("Cards", function($http) {
  return {
    newDeck: function() {
      var req = {
        url: "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1",
        method: 'GET'
      };
      return $http(req);
    },
    nextCard: function(id) {
      var req = {
        url: 'https://deckofcardsapi.com/api/deck/' + id +'/draw/?count=1',
        method: 'GET'
      };
      return $http(req);
    }
  };
});