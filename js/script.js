$(document).ready(function() {
  
  //Declare variables
  var deckID,
      cards = [ 'ACE', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'JACK', 'QUEEN', 'KING'],
      correctGuesses,
      score1,
      score2,
      discard = 0,
      lastCard,
      currentCard,
      //track player turns
      player1 = true,
      //change display if no discard pile
      hideLastCard = true,
      //cache jquery selectors
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


  //Set up click listeners
  $("h3").on("click", function() {
    $rules.slideToggle();
  });
  $("#newGame").on("click", newGame);
  $pass.on("click", changePlayer);


  //Start the game
  newGame();

  //Make a guess & drawCard()
  $(".next:not(#pass)").on("click", function() {
    var guess = $(this).attr("id");
    if (hideLastCard) {
      $lastCard.show();
      hideLastCard = false;
    }
    drawCard(guess);
  });


  //Declare functions
  function newGame() {
    //Reset the variables
    $rules.hide();
    $pass.hide();
    $lastCard.hide();
    $answer.text("");
    $buttons.show();
    $gameOver.hide();
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
    //Get a new deck of cards
    $.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1', function(res) {
      deckID = res.deck_id;
      drawCard();
    });
  }

  function drawCard(guess) {
    //Move current card to discard pile
    lastCard = currentCard;
    $previousImg.html($currentImg.html());
    //Get new card and checkAnswer()
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
    //Sweetalert prompt to pass or keep guessing
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
    //If yes, change players
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
      //If no, display "pass" button
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
    //Sweetalert popup with score and newGame() button
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
        //Reset display of turn to first player if needed
        if ($("#score:last-child").hasClass("turn")) {
          $("#score:last-child").removeClass("turn");
          $("#score:first-child").addClass("turn");
        }
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