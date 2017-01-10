# Hi-Lo
Higher/lower guessing game implemented with Angular.  
* [View the jQuery version here](https://github.com/evwilkin/hi-lo "Hi-Lo Game w/jQuery")

### Rules:
 - The dealer will draw a card from the deck. Your goal is to guess if the next card will be higher or lower than that card.
 - Guess correctly 3 times in a row and you can choose to pass play to the other player or keep guessing.
 - If you guess incorrectly you get a point for each card in the discard pile, then those cards are cleared.
 - Winner is the person with the fewest points when the cards run out.
#### Notes:
 - Aces are low (they count as "1").
 - Drawing the same card as the previous card doesn't count as a correct or incorrect guess, but does add one point to the discard pile.

### Technologies:
 - HTML5
 - CSS3
 - JavaScript
 - Angular (focus)

This game is a continuation of my original Hi-Lo game implemented with jQuery (link above).  When creating the original I intentionally utilized solely jQuery as a refresher and a way to focus on a single technology, but realized quickly the advantages that Angular's 2-way data binding would afford in syncing data between the model and view with every turn.

I also wanted a chance to utilize Flexbox in my page layout, and found it useful through this entire app.  I have plenty of practice with Flexbox but little practical usage, and found applying it as easy as I had hoped - I find it truly a valuable tool for quick and easy responsive layouts without having to load an external library or framework.

### Process
I started by creating a mobile-first wireframe in Adobe Xd to plan out the positioning of items to ensure everything fits on one page, and from there utilized media queries to take advantage of progressive enhancement.
![Image of Hi-Lo wireframe]
(https://raw.githubusercontent.com/evwilkin/hi-lo/master/iPhone%2067%20%E2%80%93%201.png)

### Next Steps
With the game logic complete in both jQuery and Angular, I look forward to cleaning up the extra HTML to slim it down to just what's required for the Angular code.  Once this is complete, I look forward to refactoring the code one more time to use React.  

Having studied React I have an understanding of the basics but am looking forward to confirming my knowledge in recreating a simple and familiar game with it.

### Bugs
 - Sweetalert loads too wide on mobile.