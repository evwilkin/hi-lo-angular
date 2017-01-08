//jQuery
$(document).ready(function() {
  
  //Declare variables
  var deckID,
      cards = [ 'A', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'J', 'Q', 'K'],
      guess,
      answer,
      score1,
      score2,
      discard, //keep track of correct guesses (and points to award when wrong guess)
      cardPic,
      lastCard,
      currentCard,
      $currentImg = $("#current"),
      $remaining = $("#remaining"),
      $guess = $("#guess");

  //Start the game
  newGame();
  $("#newGame").on("click", newGame);

  //Draw a card
  $(".next").on("click", function() {
  //$("#higher").on("click", function() {
    guess = $(this).attr("id");
    drawCard(guess);
  });

  function newGame() {
    $.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1', function(res) {
      deckID = res.deck_id;
      score1 = 0;
      score2 = 0;
      discard=0;
      lastCard = "";
      currentCard = "";
      $guess.text("");
      drawCard();
    });
  }

  function drawCard(guess) {
    //Move current card to discard pile
    lastCard = currentCard;
    //if guess then draw card, else prompt guess first
    $.get('https://deckofcardsapi.com/api/deck/' + deckID + '/draw/?count=1', function(res) {
      cardPic = res.cards[0].image;
      $currentImg.html("<img src='" + cardPic + "' alt='playing card'/>");
      $remaining.text(res.remaining);
      currentCard = res.cards[0].code[0];
      console.log(currentCard);
      if (res.remaining < 51) {
        $guess.text(guess);
        checkAnswer(lastCard, currentCard, guess);
      }
    });
  }

  function checkAnswer(lastCard, currentCard, guess) {
    console.log("last: " + lastCard + " current: " + currentCard + " guess: " + guess);
    switch (guess) {
      case "higher":
        if (cards.indexOf(currentCard) > cards.indexOf(lastCard)) {
          console.log("right guess!");
        } else if (cards.indexOf(currentCard) < cards.indexOf(lastCard)) {
          console.log("Sorry - this card is lower than the last!");
        } else {
          console.log("Same value card - pass.");
        }
        console.log(cards.indexOf(currentCard) + " " + cards.indexOf(lastCard));
        break;
      case "lower":
        if (cards.indexOf(currentCard) < cards.indexOf(lastCard)) {
          console.log("right guess!");
        } else if (cards.indexOf(currentCard) > cards.indexOf(lastCard)) {
          console.log("Sorry - this card is higher than the last!");
        } else {
          console.log("Same value card - pass.");
        }
        console.log(cards.indexOf(currentCard) + " " + cards.indexOf(lastCard));
        break;
      default:
        console.log(cards.indexOf(currentCard) + " " + cards.indexOf(lastCard));
        break;
    }
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