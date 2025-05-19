unshuffledDeck = [
  { name: 'twoHearts', value: 2 },
  { name: 'twoDiamonds', value: 2 },
  { name: 'twoSpades', value: 2 },
  { name: 'twoClubs', value: 2 },
  { name: 'threeHearts', value: 3 },
  { name: 'threeDiamonds', value: 3 },
  { name: 'threeSpades', value: 3 },
  { name: 'threeClubs', value: 3 },
  { name: 'fourHearts', value: 4 },
  { name: 'fourDiamonds', value: 4 },
  { name: 'fourSpades', value: 4 },
  { name: 'fourClubs', value: 4 },
  { name: 'fiveHearts', value: 5 },
  { name: 'fiveDiamonds', value: 5 },
  { name: 'fiveSpades', value: 5 },
  { name: 'fiveClubs', value: 5 },
  { name: 'sixHearts', value: 6 },
  { name: 'sixDiamonds', value: 6 },
  { name: 'sixSpades', value: 6 },
  { name: 'sixClubs', value: 6 },
  { name: 'sevenHearts', value: 7 },
  { name: 'sevenDiamonds', value: 7 },
  { name: 'sevenSpades', value: 7 },
  { name: 'sevenClubs', value: 7 },
  { name: 'eightHearts', value: 8 },
  { name: 'eightDiamonds', value: 8 },
  { name: 'eightSpades', value: 8 },
  { name: 'eightClubs', value: 8 },
  { name: 'nineHearts', value: 9 },
  { name: 'nineDiamonds', value: 9 },
  { name: 'nineSpades', value: 9 },
  { name: 'nineClubs', value: 9 },
  { name: 'tenHearts', value: 10 },
  { name: 'tenDiamonds', value: 10 },
  { name: 'tenSpades', value: 10 },
  { name: 'tenClubs', value: 10 },
  { name: 'jackHearts', value: 10 },
  { name: 'jackDiamonds', value: 10 },
  { name: 'jackSpades', value: 10 },
  { name: 'jackClubs', value: 10 },
  { name: 'queenHearts', value: 10 },
  { name: 'queenDiamonds', value: 10 },
  { name: 'queenSpades', value: 10 },
  { name: 'queenClubs', value: 10 },
  { name: 'kingHearts', value: 10 },
  { name: 'kingDiamonds', value: 10 },
  { name: 'kingSpades', value: 10 },
  { name: 'kingClubs', value: 10 },
  { name: 'aceHearts', value: 11 },
  { name: 'aceDiamonds', value: 11 },
  { name: 'aceSpades', value: 11 },
  { name: 'aceClubs', value: 11 }
];

function shuffle(deck) {
  const shuffledDeck = structuredClone(deck);
  for (let i = shuffledDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];
  }
  return shuffledDeck;
}

function deal(deck, hand) {
  let cardDealt = deck.pop();
  hand.push(cardDealt);
  return hand;
}

function count(hand) {
  function countAces() {
    let aceCount = 0;
    hand.forEach(card => {
      if (card.name.includes('ace')) {
        aceCount++;
      }
    });
    return aceCount;
  }

  let handTotal = 0;
  hand.forEach(card => {
        handTotal += card.value;
  });

  for (let i=0; i<countAces(); i++) {
    if (handTotal > 21) {
        handTotal -= 10;
      }
  }

  return handTotal;
}

function checkStatus (playerTotal, dealerTotal, playerTurn, dealerTurnFinished) {
  if (playerTurn){
    if (playerTotal === 21) {
      return 'playerBlackjack';
    } else if (playerTotal > 21) {
      return 'lose';
    } else {
      return null;
    }
  } else if (!playerTurn) {
    //dealers turn
    if (dealerTurnFinished) {
      if (dealerTotal === 21) {
        return 'lose';
      } else if (dealerTotal < 21 && dealerTotal > playerTotal) {
        return 'lose';
      } else if (dealerTotal === playerTotal){
        return 'push';
      } else {
        return 'win';
      }
    } else {
      return null;
    }
  }
}

function fadeIn(item, delay) {
  item.style.opacity = '0';
  item.style.transition = 'opacity 1.5s ease';
  item.style.display = 'inline';
  setTimeout(() => {
    item.style.opacity = '1';
  }, delay);
}

function fadeOut(item, delay) {
  item.style.opacity = '1';
  item.style.transition = 'opacity 1.5s ease';
  setTimeout(() => {
    item.style.opacity = '0';
  }, delay);
  setTimeout(() => {
    item.style.display = 'none';
  }, delay+1500);
}

//at end of round
function evaluate(result) {
  let element = null;

  if (result !== null) {
    element = document.querySelector('.hit');
    fadeOut(element, 0);
    element = document.querySelector('.stand');
    fadeOut(element, 0);
    element = document.querySelector('.pays');
    fadeOut(element, 3000);
    element = document.querySelector('.standText');
    fadeOut(element, 3000);
  }

  if (result === 'playerBlackjack'){
    element = document.querySelector('.blackJack');
    setTimeout(() => {
      fadeIn(element, 1000);
    }, 5000);
  } else if (result === 'win'){
    element = document.querySelector('.youWin');
    setTimeout(() => {
      fadeIn(element, 1000);
    }, 5000);
  } else if (result === 'lose'){
    element = document.querySelector('.youLose');
    setTimeout(() => {
      fadeIn(element, 1000);
    }, 5000);
  } else if (result === 'push') {
    element = document.querySelector('.push');
    setTimeout(() => {
      fadeIn(element, 1000);
    }, 5000);
  }
}

  document.querySelector('.deal').addEventListener('click', function() {
    document.querySelector('.deal').style.display = 'none';

    //round loop
    let status = null;
    let result = null;
    let dealerTurnFinished = false;
    let playerHand = [];
    let dealerHand = [];
    let deck = shuffle(unshuffledDeck);

    //initial deal

    //visible 1st card
    playerHand = deal(deck, playerHand);
    let img = document.querySelector(`#${playerHand[playerHand.length-1].name}`);
    document.querySelector(`.playerCards`).appendChild(img);
    fadeIn(img, 0);

    //hidden 2nd card
    dealerHand = deal(deck, dealerHand);
    img = document.querySelector('#hidden');
    document.querySelector(`.dealerCards`).appendChild(img);
    fadeIn(img, 1000);

    //visible 3rd card
    playerHand = deal(deck, playerHand);
    img = document.querySelector(`#${playerHand[playerHand.length-1].name}`);
    document.querySelector(`.playerCards`).appendChild(img);
    fadeIn(img, 2000);

    //visible 4th card
    dealerHand = deal(deck, dealerHand);
    img = document.querySelector(`#${dealerHand[dealerHand.length-1].name}`);
    document.querySelector(`.dealerCards`).appendChild(img);
    fadeIn(img, 3000);

    //count players initial hand
    let playerTotal = count(playerHand);
    let dealerTotal = count(dealerHand);

    //check status (player's turn)
    status = checkStatus(playerTotal, dealerTotal, true, dealerTurnFinished);

    if (status === 'playerBlackjack') {
      result = status;
    } else if (status === null) {

      //hit and stand buttons
      fadeIn(document.querySelector('.stand'), 4000);
      fadeIn(document.querySelector('.hit'), 4000);

      document.querySelector('.hit').addEventListener('click', function() {

        //add another card to hand
        playerHand = deal(deck, playerHand);
        img = document.querySelector(`#${playerHand[playerHand.length-1].name}`);
        document.querySelector(`.playerCards`).appendChild(img);
        fadeIn(img, 100);

        //recount player hand
        playerTotal = count(playerHand);

        //check status
        status = checkStatus(playerTotal, dealerTotal, true, dealerTurnFinished);

        if (status === 'playerBlackjack' || status === 'lose') {
          result = status;
        }
        evaluate(result);
      });

      document.querySelector('.stand').addEventListener('click', function() {

      // dealers turn
      document.querySelector('#hidden').style.display = 'none';

      img = document.querySelector(`#${dealerHand[0].name}`);
      document.querySelector(`.dealerCards`).appendChild(img);
      fadeIn(img, 100);
      
      if (dealerTotal === 21) {
        dealerTurnFinished = true;
      }
      status = checkStatus(playerTotal, dealerTotal, false, dealerTurnFinished);
      if (status !== null){
        result = status;
        evaluate(result);
      }

      let counter = 1;
      while (dealerTurnFinished !== true) {
        dealerHand = deal(deck, dealerHand);
        img = document.querySelector(`#${dealerHand[dealerHand.length-1].name}`);
        document.querySelector(`.dealerCards`).appendChild(img);
        fadeIn(img, 1000*counter);

        dealerTotal = count(dealerHand);
        counter += 1;

        if (dealerTotal < 17) {
          dealerTurnFinished = false;
        } else {
          dealerTurnFinished = true;
        }
      }
      status = checkStatus(playerTotal, dealerTotal, false, dealerTurnFinished);
      result = status;
      evaluate(result);
    });
  }
  evaluate(result);
});