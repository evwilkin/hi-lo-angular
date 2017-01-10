angular.module('HiLoCtrls', ['HiLoServices'])
.controller('GameCtrl', ['$scope', '$http', 'Cards', '$q', function($scope, $http, Cards, $q) {
  
  //Declare variables
  $scope.cards = [ 'ACE', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'JACK', 'QUEEN', 'KING'];
  $scope.correctGuesses = 0;
  $scope.player1 = true;
  $scope.score1 = 0;
  $scope.score2 = 0;
  $scope.discard = 0;
  $scope.lastCard = {};
  $scope.currentCard = {};
  $scope.deckID = "";
  $scope.answer = "";
  $scope.remainingCards = 52;
  $scope.pass = function() {
    changePlayer();
  };
  $scope.newGame = function() {
    $scope.currentCard = {};
    $scope.player1 = true;
    $scope.lastCard = {};
    $scope.score1 = 0;
    $scope.score2 = 0;
    $scope.answer = "";
    var newDeck=Cards.newDeck();
    newDeck.then(function success(res) {
      if (res.status === 200) {
        $scope.deckID = res.data.deck_id;
        $scope.drawCard();
      } else {
        alert("Oops - Error getting a new deck.");
      }
    }, function error(res) {
      alert("Oops - error getting the deck for a new game.");
      console.log(res);
    });
  };
  $scope.drawCard = function(guess) {
    $scope.lastCard = angular.copy($scope.currentCard);
    $scope.pile = true;
    var newCard = Cards.nextCard($scope.deckID);
    newCard.then(function success(res) {
      if (res.status === 200) {
        $scope.currentCard.val = res.data.cards[0].value;
        $scope.currentCard.img = res.data.cards[0].image;
        $scope.remainingCards = res.data.remaining;
        if ($scope.remainingCards < 51) {
          $scope.discard++;
          checkGuess(guess);
        }
      } else {
        alert("Oops - error drawing a card.");
      }
    }, function error(res) {
      alert("Oops - error drawing a card.");
    });
  };

  //Start game on load
  $scope.newGame();

  //Declare functions
  function checkGuess(guess) {
    var current = $scope.cards.indexOf($scope.currentCard.val);
    var previous = $scope.cards.indexOf($scope.lastCard.val);
    switch (guess) {
      case "higher":
        if (current > previous) {
          rightAnswer(guess);
        } else if (current < previous) {
          wrongAnswer(guess);
        } else {
          sameCard();
        }
        break;
      case "lower":
        if (current < previous) {
          rightAnswer(guess);
        } else if (current > previous) {
          wrongAnswer(guess);
        } else {
          sameCard();
        }
        break;
      default:
        break;
    }
    if ($scope.remainingCards === 0) {
      gameOver();
    }
  }

  function rightAnswer(guess) {
    var current = $scope.currentCard.val;
    var previous = $scope.lastCard.val;
    $scope.answer = "Correct - " + current + " is " + guess + " than " + previous + "!";
    $scope.correctGuesses++;
  }

  function wrongAnswer(guess) {
    var current = $scope.currentCard.val;
    var previous = $scope.lastCard.val;
    $scope.answer = "Sorry - " + current + " is not " + guess + " than " + previous + "!";
    updateScore();
  }

  function sameCard() {
    $scope.answer = "Same value card - pass.";
  }

  function updateScore() {
    if ($scope.player1) {
      $scope.score1 += $scope.discard;
    } else {
      $scope.score2 += $scope.discard;
    }
    $scope.correctGuesses = 0;
    $scope.discard = 0;
    $scope.lastCard = {};
  }

  function changePlayer() {
    swal({
      title: "Change players?",
      text: "You've answered 3 or more questions correctly! Trade turns with the other player?",
      type: "warning",
      showCancelButton: true,
      cancelButtonText: "No, I'll keep guessing.",
      confirmButtonText: "Yes, let the other player guess!",
      confirmButtonColor: "#f9584f",
      closeOnConfirm: false
    },
    function(accept){
      if (accept) {
        swal({
          title: "Turn changed!", 
          text: "Sit back and enjoy - time for " + ($scope.player1 ? "player 2" : "player 1") + " to guess.",
          type: "success",
          timer: 2000
        });
        $scope.$apply($scope.correctGuesses = 0);
        $scope.$apply($scope.player1 = !$scope.player1);
        $scope.$apply($scope.answer = "");
        //$(".playerScore").toggleClass("turn");
      }
    });
  }

  function gameOver() {
    var message;
    if ($scope.score1 < $scope.score2) {
      message = "<h3>Congratulations Player 1 - you win!</h3><p>Final Score:</p><br /><p>Player 1: " + $scope.score1 + "</p><p>Player 2: " + $scope.score2 + "</p><br />";
    } else if ($scope.score2 < $scope.score1) {
      message = "<h3>Congratulations Player 2 - you win!</h3><p>Final Score:</p><br /><p>Player 1: " + $scope.score1 + "</p><p>Player 2: " + $scope.score2 + "</p><br />";
    } else {
      message = "<h3>It's a tie!</h3>";
    }
    swal({
      title: "Game Over!",
      text: message + "<h3>Play again?</h3>",
      html: true,
      showCancelButton: true,
      cancelButtonText: "No thanks!",
      confirmButtonText: "Yes, start a new game!",
      confirmButtonColor: "#f9584f"
    },
    function(accept) {
      if (accept) {
        $scope.newGame();
      }
    });
  }

}]);