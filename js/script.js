var xhr = new XMLHttpRequest();
xhr.onload = function() {
  console.log(xhr.responseText);
};
xhr.open('get', 'https://deckofcardsapi.com/api/deck/new/', false);
xhr.send();