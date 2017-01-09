//jQuery
$(document).ready(function() {
  //Declare variables
  var deckID,
      cards = [ 'ACE', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'JACK', 'QUEEN', 'KING'],
      correctGuesses,
      player1 = true,
      score1,
      score2,
      hideLastCard = true,
      discard = 0, //keep track of correct guesses (and points to award when wrong guess)
      lastCard,
      currentCard,
      $currentImg = $("#current"),
      $previousImg = $("#previous"),
      $remaining = $("#remaining"),
      $answer = $("#answer p"),
      $discard = $("#discard"),
      $player1 = $("#player1"),
      $player2 = $("#player2"),
      $rules = $("#rules"),
      $lastCard = $(".lastCard"),
      $pass = $('#pass'),
      $buttons = $("#buttons"),
      $gameOver = $("#gameOver");

  //Hide elements on page load
  $("h3").on("click", function() {
    $rules.slideToggle();
  });

  //Start the game
  newGame();
  $("#newGame").on("click", newGame);

  //Draw a card
  $(".next:not(#pass)").on("click", function() {
    var guess = $(this).attr("id");
    if (hideLastCard) {
      $lastCard.show();
      hideLastCard = false;
    }
    drawCard(guess);
  });

  $pass.on("click", changePlayer);

  function newGame() {
    //Draw a new deck and reset the variables
    $rules.hide();
    $pass.hide();
    $lastCard.hide();
    $answer.text("");
    $buttons.show();
    $gameOver.hide();
    $.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1', function(res) {
      deckID = res.deck_id;
      score1 = 0;
      score2 = 0;
      discard=0;
      correctGuesses = 0;
      player1 = true;
      currentCard = "";
      $player1.html(score1);
      $player2.html(score2);
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
        checkAnswer(guess, res.remaining);
      }
    });
  }

  function checkAnswer(guess, remainingCards) {
    switch (guess) {
      case "higher":
        if (cards.indexOf(currentCard) > cards.indexOf(lastCard)) {
          rightAnswer(guess);
        } else if (cards.indexOf(currentCard) < cards.indexOf(lastCard)) {
          wrongAnswer(guess);
        } else {
          sameCard();
        }
        $discard.text(discard);
        break;
      case "lower":
        if (cards.indexOf(currentCard) < cards.indexOf(lastCard)) {
          rightAnswer(guess);
        } else if (cards.indexOf(currentCard) > cards.indexOf(lastCard)) {
          wrongAnswer(guess);
        } else {
          sameCard();
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
      confirmButtonText: "Yes, let the other player guess!",
      confirmButtonColor: "#f9584f",
      closeOnConfirm: false
    },
    function(accept){
      if (accept) {
        player1 = !player1;
        correctGuesses = 0;
        swal({
          title: "Turn changed!", 
          text: "Sit back and enjoy - time for " + (player1 ? "player 1" : "player 2") + " to guess.",
          type: "success",
          timer: 2000
        });
        $pass.hide();
        $answer.text("");
        $(".playerScore").toggleClass("turn");
      } else {
        $pass.show();
      }
    });
  }

  function gameOver() {
    var message;
    if (score1 < score2) {
      message = "<h3>Congratulations Player 1 - you win!</h3><p>Final Score:</p><br /><p>Player 1: " + score1 + "</p><p>Player 2: " + score2 + "</p><br />";
    } else if (score2 < score1) {
      message = "<h3>Congratulations Player 2 - you win!</h3><p>Final Score:</p><p>Player 1: " + score1 + "</p><p>Player 2: " + score2 + "</p>";
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
        newGame();
      } else {
        $buttons.hide();
        $gameOver.show();
      }
    });
  }

  function rightAnswer(guess) {
    $answer.text("Correct - " + currentCard + " is " + guess + " than " + lastCard + "!");
    correctGuesses++;
    if (correctGuesses === 3) {
      $pass.show();
    }
  }

  function wrongAnswer(guess) {
    $answer.text("Sorry - " + currentCard + " is not " + guess + " than " + lastCard + "!");
    updateScore();
  }

  function sameCard() {
    $answer.text("Same value card - pass.");
  }

  function updateScore() {
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
    $pass.hide();
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