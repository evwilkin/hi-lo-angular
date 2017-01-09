//jQuery
$(document).ready(function() {
  //Declare variables
  var deckID,
      cards = [ 'ACE', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'JACK', 'QUEEN', 'KING'],
      guess, //keep track of player's guess,
      correctGuesses,
      player1 = true,
      score1,
      score2,
      hideLastCard = true,
      discard = 0, //keep track of correct guesses (and points to award when wrong guess)
      cardPic,
      lastCard,
      currentCard,
      $currentImg = $("#current"),
      $previousImg = $("#previous"),
      $remaining = $("#remaining"),
      $answer = $("#answer"),
      $discard = $("#discard"),
      $player1 = $("#player1"),
      $player2 = $("#player2"),
      $rules = $("#rules"),
      $lastCard = $(".lastCard"),
      $trade = $('#trade');

  //Setup screen
  $rules.hide();
  $trade.hide();
  $lastCard.hide();
  $("h3").on("click", function() {
    $rules.slideToggle();
  });

  //Start the game
  newGame();
  $("#newGame").on("click", newGame);

  //Draw a card
  $(".next:not(#trade)").on("click", function() {
    guess = $(this).attr("id");
    if (hideLastCard) {
      $lastCard.show();
      hideLastCard = false;
    }
    drawCard(guess);
  });

  $(trade).on("click", changePlayer);

  function newGame() {
    //Draw a new deck and reset the variables
    $.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1', function(res) {
      deckID = res.deck_id;
      score1 = 0;
      score2 = 0;
      discard=0;
      correctGuesses = 0;
      player1 = true;
      lastCard = "";
      currentCard = "";
      $previousImg.html("");
      $currentImg.html("");
      drawCard();
    });
  }

  function drawCard(guess) {
    //Move current card to discard pile
    lastCard = currentCard;
    $previousImg.html($currentImg.html());
    //if guess then draw card, else prompt guess first
    $.get('https://deckofcardsapi.com/api/deck/' + deckID + '/draw/?count=1', function(res) {
      cardPic = res.cards[0].image;
      $currentImg.html("<img src='" + cardPic + "' alt='playing card' />");
      $remaining.text(res.remaining);
      currentCard = res.cards[0].value;
      if (res.remaining < 51) {
        discard++;
        checkAnswer(lastCard, currentCard, guess, res.remaining);
      }
    });
  }

  function checkAnswer(lastCard, currentCard, guess, remainingCards) {
    switch (guess) {
      case "higher":
        if (cards.indexOf(currentCard) > cards.indexOf(lastCard)) {
          $answer.text("You are correct - " + currentCard + " is higher than " + lastCard + "!");
          correctGuesses++;
          if (correctGuesses === 3) {
            changePlayer();
          }
        } else if (cards.indexOf(currentCard) < cards.indexOf(lastCard)) {
          $answer.text("Sorry - " + currentCard + " is lower than " + lastCard + "!");
          if (player1) {
            score1 += discard;
            $player1.text(score1);
          } else {
            score2 += discard;
            $player2.text(score2);
          }
          correctGuesses = 0;
          discard = 0;
          $lastCard.hide();
          hideLastCard = true;
          $trade.hide();
        } else {
          $answer.text("Same value card - pass.");
        }
        $discard.text(discard);
        break;
      case "lower":
        if (cards.indexOf(currentCard) < cards.indexOf(lastCard)) {
          $answer.text("You are correct - " + currentCard + " is lower than " + lastCard + "!");
          correctGuesses++;
          if (correctGuesses === 3) {
            changePlayer();
          }
        } else if (cards.indexOf(currentCard) > cards.indexOf(lastCard)) {
          $answer.text("Sorry - " + currentCard + " is higher than " + lastCard + "!");
          if (player1) {
            score1 += discard;
            $player1.text(score1);
          } else {
            score2 += discard;
            $player2.text(score2);
          }
          correctGuesses = 0;
          discard = 0;
          $lastCard.hide();
          $trade.hide();
          hideLastCard = true;
        } else {
          $answer.text("Same value card - pass.");
        }
        $discard.text(discard);
        break;
      default:
        break;
    }
    if (remainingCards === 0) {
      gameOver();
    }
  }

  function changePlayer() {
    swal({
      title: "Change players?",
      text: "You've answered 3 or more questions correctly! Trade turns with the other player?",
      type: "warning",
      showCancelButton: true,
      cancelButtonText: "No, I'll keep guessing.",
      //confirmButtonColor: "#DD6B55",
      confirmButtonText: "Yes, let the other player guess!",
      closeOnConfirm: false
    },
    function(accept){
      if (accept) {
        player1 = !player1;
        correctGuesses = 0;
        $(trade).hide();
        $(answer).html("");
        swal("Turn changed!", "Sit back and enjoy - time for " + (player1 ? "player 1" : "player 2") + " to guess.", "success");
      } else {
        $trade.show();
      }
    });
  }

  function gameOver() {
    if (score1 < score2) {
      $("#game").html("<h3>Congratulations Player 1 - you win!</h3>");
    } else if (score2 < score1) {
      $("#game").html("<h3>Congratulations Player 2 - you win!</h3>");
    } else {
      $("#game").html("<h3>It's a tie!</h3>");
    }
  }

});

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