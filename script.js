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

function checkStatus (playerTotal, playerHand, dealerTotal, playerTurn, dealerTurnFinished) {
  if (playerTurn){
    if (playerTotal === 21 && playerHand.length === 2) {
      return 'playerBlackjack';
    } else if (playerTotal > 21) {
      return 'lose';
    } else {
      return null;
    }
  } else if (!playerTurn) {
    //dealers turn
    if (dealerTurnFinished) {
      if (dealerTotal > playerTotal && dealerTotal <= 21) {
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

function evaluate(result, betSize, cash, playerHand, dealerHand) {
  let element = null;
  let cashChange = null;

  if (result !== null) {
    roundCount.value += 1;

    element = document.querySelector('.hit');
    fadeOut(element, 0);
    element = document.querySelector('.stand');
    fadeOut(element, 0);
    element = document.querySelector('.pays');
    fadeOut(element, 3000);
    element = document.querySelector('.standText');
    fadeOut(element, 3000);

    let another = document.querySelector('.hand');
    fadeIn(another, 7000);
    let stop = document.querySelector('.stop');
    fadeIn(stop, 7000);
    let report = document.querySelector('.cashReport');

    if (result === 'playerBlackjack'){
      element = document.querySelector('.blackJack');
      cashChange = Math.round(betSize*3/2 + betSize);

      setTimeout(() => {
        fadeIn(element, 1000);
        report.style.color = '#2bb021';
        report.textContent = `+$${cashChange}`;
        fadeIn(report, 1000);
      }, 5000);
    } else if (result === 'win'){
      element = document.querySelector('.youWin');
      cashChange = betSize*2;

      setTimeout(() => {
        fadeIn(element, 1000);
        report.style.color = '#2bb021';
        report.textContent = `+$${cashChange}`;
        fadeIn(report, 1000);
      }, 5000);
    } else if (result === 'lose'){
      element = document.querySelector('.youLose');
      cashChange = 0;

      setTimeout(() => {
        fadeIn(element, 1000);
        report.style.color = '#cf364f';
        report.textContent = `+$${cashChange}`;
        fadeIn(report, 1000);
      }, 5000);
    } else if (result === 'push') {
      element = document.querySelector('.push');
      cashChange = betSize;

      setTimeout(() => {
        fadeIn(element, 1000);
        report.style.color = 'black';
        report.textContent = `+$${cashChange}`;
        fadeIn(report, 1000);
      }, 5000);
    }

    cash.value += cashChange;

    setTimeout(() => {
        document.querySelector('.cash').textContent = `$${cash.value}`;
    }, 6000);

    function clearTable(playerHand, dealerHand) {

      another.style.display = 'none';
      stop.style.display = 'none';

      for(let i=0; i<playerHand.length; i++){
        let playerCard = document.querySelector(`#${playerHand[i].name}`);
        fadeOut(playerCard, 0);
      }

      for(let i=0; i<dealerHand.length; i++){
        let dealerCard = document.querySelector(`#${dealerHand[i].name}`);
        fadeOut(dealerCard, 0);
      }

      setTimeout(() => {
        //move player cards and dealer cards back to original spot

        for(let i=0; i<playerHand.length; i++){
          let img = document.querySelector(`#${playerHand[i].name}`);
          document.querySelector(`body`).appendChild(img);
        }

        for(let i=0; i<dealerHand.length; i++){
          let img = document.querySelector(`#${dealerHand[i].name}`);
          document.querySelector(`body`).appendChild(img);
        }

      }, 2000);

      fadeOut(document.querySelector('#hidden'), 0);
      fadeOut(document.querySelector('.youWin'), 0);
      fadeOut(document.querySelector('.youLose'), 0);
      fadeOut(document.querySelector('.blackJack'), 0);
      fadeOut(document.querySelector('.push'), 0);
      fadeOut(report, 0);

    }

    function handleAnotherClick () {
      //Another hand
        
      clearTable(playerHand, dealerHand);

      setTimeout(() => {
        fadeIn(document.querySelector('.pays'), 1000);
        fadeIn(document.querySelector('.standText'), 1000);

        document.querySelector('.lowerBetText').textContent = `(1-${cash.value})`;
        fadeIn(document.querySelector('.betArea'), 100);
      }, 3000);

      main(cash, roundCount);
    }

    function handleStopClick() {
      //Cash out
      
      clearTable(playerHand, dealerHand);

      setTimeout(() => {
        endGame();
      }, 2000);
    }

    setTimeout(() => {
      another.onclick = () => handleAnotherClick();
    }, 7000);

    setTimeout(() => {
      stop.onclick = () => handleStopClick();
    }, 7000);
  }
}

function endGame () {
  let total = document.querySelector('.totalWin');
  let rounds = document.querySelector('.roundsPlayed');

  total.textContent = `You started with $100 and ended with $${cash.value}`;

  if (roundCount.value === 1) {
    rounds.textContent = `You played a total of 1 hand`;
  } else {
    rounds.textContent = `You played a total of ${roundCount.value} hands`;
  }

  fadeIn(total, 1500);
  fadeIn(rounds, 1500);
}

function bet(cash){
  return new Promise((resolve, reject) => {

    let inputButton = document.querySelector('.submitInput');
    function handleBetClick () {
      let betSize = Number(document.querySelector('.betInput').value.trim());

      if (betSize >= 1 && betSize <= cash.value && betSize%1 === 0) {
        let div = document.querySelector('.betArea');
        fadeOut(div, 0);

        resolve(betSize);
      } else {
        let text = document.querySelector('.lowerBetText');
        text.classList.add('flashText');

        setTimeout(() => {
          text.classList.remove('flashText');
        }, 2000);
      }
    }
    inputButton.onclick = () => handleBetClick();
  });
}

function handleHitClick (playerHand, deck, playerTotal, playerTurn, status, dealerTotal, dealerTurnFinished, result, betSize, cash, dealerHand) {
  //add another card to hand
  playerHand = deal(deck, playerHand);
  img = document.querySelector(`#${playerHand[playerHand.length-1].name}`);
  document.querySelector(`.playerCards`).appendChild(img);
  fadeIn(img, 100);

  //recount player hand
  playerTotal = count(playerHand);

  // Auto-stand if player hits 21
  if (playerTotal === 21) {
    handleStandClick(playerHand, deck, playerTotal, playerTurn, status, dealerTotal, dealerTurnFinished, result, betSize, cash, dealerHand);
    return;
  }

  //check status
  status = checkStatus(playerTotal, playerHand, dealerTotal, playerTurn, dealerTurnFinished);

  if (status === 'playerBlackjack' || status === 'lose') {
    result = status;
  }
  evaluate(result, betSize, cash, playerHand, dealerHand);
}

function handleStandClick (playerHand, deck, playerTotal, playerTurn, status, dealerTotal, dealerTurnFinished, result, betSize, cash, dealerHand) {
  // dealers turn
  playerTurn = false;
  document.querySelector('#hidden').style.display = 'none';

  img = document.querySelector(`#${dealerHand[0].name}`);
  document.querySelector(`.dealerCards`).appendChild(img);
  fadeIn(img, 100);

  let counter = 1;
  while (count(dealerHand) < 17) {
    dealerHand = deal(deck, dealerHand);
    img = document.querySelector(`#${dealerHand[dealerHand.length-1].name}`);
    document.querySelector(`.dealerCards`).appendChild(img);
    fadeIn(img, 1000*counter);

    dealerTotal = count(dealerHand);
    counter += 1;
  }
  playerTotal = count(playerHand);
  dealerTurnFinished = true;
  status = checkStatus(playerTotal, playerHand, dealerTotal, playerTurn, dealerTurnFinished);
  result = status;
  evaluate(result, betSize, cash, playerHand, dealerHand);
}

function onDealClick() {
  handleDealClick(betSize, cash);
}

function handleDealClick(betSize, cash) {

  let dealButton = document.querySelector('.deal');
  dealButton.style.display = 'none';

  //round
  let status = null;
  let result = null;
  let playerTurn = true;
  let dealerTurnFinished = false;
  let playerHand = [];
  let dealerHand = [];
  let deck = shuffle(unshuffledDeck);

  //initial deal

  //visible 1st card
  playerHand = deal(deck, playerHand);
  let img = document.querySelector(`#${playerHand[playerHand.length-1].name}`);
  document.querySelector(`.playerCards`).appendChild(img);
  fadeIn(img, 1000);

  //hidden 2nd card
  dealerHand = deal(deck, dealerHand);
  img = document.querySelector('#hidden');
  document.querySelector(`.dealerCards`).appendChild(img);
  fadeIn(img, 2000);

  //visible 3rd card
  playerHand = deal(deck, playerHand);
  img = document.querySelector(`#${playerHand[playerHand.length-1].name}`);
  document.querySelector(`.playerCards`).appendChild(img);
  fadeIn(img, 3000);

  //visible 4th card
  dealerHand = deal(deck, dealerHand);
  img = document.querySelector(`#${dealerHand[dealerHand.length-1].name}`);
  document.querySelector(`.dealerCards`).appendChild(img);
  fadeIn(img, 4000);

  //count players initial hand
  let playerTotal = count(playerHand);
  let dealerTotal = count(dealerHand);

  //check status (player's turn)
  status = checkStatus(playerTotal, playerHand, dealerTotal, playerTurn, dealerTurnFinished);

  if (status === 'playerBlackjack') {
    result = status;
  } else if (status === null) {

    //hit and stand buttons
    let hitButton = document.querySelector('.hit');
    let standButton = document.querySelector('.stand');

    fadeIn(standButton, 4000);
    fadeIn(hitButton, 4000);

    hitButton.onclick = () => handleHitClick(playerHand, deck, playerTotal, playerTurn, status, dealerTotal, dealerTurnFinished, result, betSize, cash, dealerHand);
    standButton.onclick = () => handleStandClick(playerHand, deck, playerTotal, playerTurn, status, dealerTotal, dealerTurnFinished, result, betSize, cash, dealerHand);
  }
  evaluate(result, betSize, cash, playerHand, dealerHand);
}

async function main (cash, roundCount){
  try {
    let betSize = await bet(cash);
    cash.value -= betSize;
    document.querySelector('.cash').textContent = `$${cash.value}`;

    let dealButton = document.querySelector('.deal');
    fadeIn(dealButton, 1500);

    dealButton.onclick = () => handleDealClick(betSize, cash);

  } catch (error) {
    alert("If you're seeing this, something has gone terribly wrong.");
  }
}

let cash = { value: 100 };
let roundCount = { value: 0};
main(cash, roundCount);