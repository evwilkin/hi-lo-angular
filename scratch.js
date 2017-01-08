//jQuery
$(document).ready(function() {
  
  //Declare variables
  var deckID,
      guess,
      score1,
      score2,
      $current = $("#current"),
      $remaining = $("#remaining");

  //Start the game
  newGame();
  $("#newGame").on("click", newGame);

  //Draw a card
  $(".next").on("click", drawCard);

  function newGame() {
    $.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1', function(res) {
      deckID = res.deck_id;
      score1 = 0;
      score2 = 0;
      drawCard();
      console.log(res);
    });
  }

  function drawCard() {
    //if guess then draw card, else prompt guess first
    $.get('https://deckofcardsapi.com/api/deck/' + deckID + '/draw/?count=1', function(res) {
      var cardPic = res.cards[0].image;
      $current.html("<img src='" + cardPic + "' alt='playing card'/>");
      $remaining.text(res.remaining);
    });
  }

  function checkAnswer() {
    //
  }

});



/* Vanilla JS
var xhr = new XMLHttpRequest();
xhr.onload = function() {
  console.log(xhr.responseText);
};
xhr.open('get', 'https://deckofcardsapi.com/api/deck/new/', false);
xhr.send();
*/

/* Functions

Game start
Draw a new deck & save deckID
Shuffle the deck
Draw a card

After card drawn
Compare stored guess to drawn card
-If wrong, points++ and set correctCount = 0
-If right, correctCount++
-Move card to discard pile (display) and set pointCount++
Prompt for guess after card drawn & store guess
Else
-

*/