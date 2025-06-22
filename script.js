function getDifficulty () {
    return new Promise((resolve, reject) => {
        const short = document.querySelector('.short');
        const medium = document.querySelector('.medium');
        const long = document.querySelector('.long');
        const difficultyBox = document.querySelector('.difficultyBox');

        function handleClick (value) {
            short.disabled = true;
            medium.disabled = true;
            long.disabled = true;

            difficultyBox.classList.add('slideDown');
            setTimeout(() => {
                difficultyBox.style.display = 'none';
                difficultyBox.classList.remove('slideDown');
            }, 2000);
            resolve(value);
        }

        short.onclick = () => handleClick(15);
        medium.onclick = () => handleClick(30);
        long.onclick = () => handleClick(60);
    });
}

function fadeIn (delay, ...classNames) {
    classNames.forEach(className => {
        let element = document.querySelector(`.${className}`);
        setTimeout( () => {
            element.style.display = 'flex';
            element.classList.add('fadeIn');
            setTimeout(() => {
                element.style.opacity = '1';
                element.classList.remove('fadeIn');
            }, 1000);
        }, delay);
    });
}

function fadeOut (delay, ...classNames) {
    classNames.forEach(className => {
        let element = document.querySelector(`.${className}`);
        setTimeout( () => {
            element.classList.add('fadeOut');
            setTimeout(() => {
                element.style.opacity = '0';
                element.style.display = 'none';
                element.classList.remove('fadeOut');
            }, 1000);
        }, delay);
    });
}

function displaySentence (selectionValues) {
    let selection = Math.floor(Math.random() * 100);

    while (selectionValues.indexOf(selection) !== -1){
        selection = Math.floor(Math.random() * 100);
    }

    selectionValues.push(selection);
    
    return fetch('sentences.json')
        .then(response => response.json())
        .then(sentenceData => {
            let sentence = sentenceData.sentences[selection];
            document.querySelector('.displayBox').textContent = `${sentence}`;
            return sentence;
        })
        .catch(error => {
            console.error(error)
            return null; 
        });
}

function handleKeyPress () {
    return new Promise((resolve) => {
        const paperText = document.querySelector('.paperText')
        const underscore = document.querySelector('.underscore');

        function keyPressed (event) {
            let char = null;
            let span = null;
            let nodes = paperText.childNodes;

            switch (event.key) {
                case 'Shift':
                case 'Control':
                case 'Alt':
                case 'CapsLock':
                case 'Tab':
                case 'Enter':
                    break;
                case 'Backspace':
                    char = 'Backspace';
                    if (nodes.length > 1) {
                        paperText.removeChild(nodes[nodes.length - 2]);
                    }
                    break;
                case ' ':
                    char = '\u00A0';
                    break;
                case "'":
                    event.preventDefault();
                    char = '\u2019';
                    break;
                default:
                    char = event.key;
                    break;
            }
            if (char !== null) {
                if (char !== 'Backspace') {
                    span = document.createElement('span');
                    span.textContent = char;
                    paperText.insertBefore(span, underscore);
                    document.removeEventListener('keydown', keyPressed);
                    resolve(span);
                } else {
                    document.removeEventListener('keydown', keyPressed);
                    resolve('Backspace');
                }
            } else {
                document.removeEventListener('keydown', keyPressed);
                resolve('');
            }
        };
    document.addEventListener('keydown', keyPressed);
    });
}

function setCursor () {
    const underscore = document.querySelector('.underscore');
    const opacityValues = [0,1];
    let index = 1;
    setInterval(() => {
        underscore.style.opacity = opacityValues[index];
        index = (index + 1) % 2;
    }, 700);
}

async function test () {
    const displayBox = document.querySelector('.displayBox');
    const paperText = document.querySelector('.paperText');

    fadeIn(2000, 'difficultyBox');
    let timeLimit = await getDifficulty();
    
    const time = document.querySelector('.count');
    time.textContent = `${timeLimit}`;
    fadeIn(2000, 'clock');
    fadeIn(2000, 'count');

    setCursor();

    const paper = document.querySelector('.paperBox');
    setTimeout(() => {paper.classList.add('slideUp')}, 2000);
    setTimeout(() => {
        paper.style.transform = 'translateY(-100%)';
        paper.classList.remove('slideUp')
    }, 4000);

    let selectionValues = [];
    let sentence = await displaySentence(selectionValues);
    let sentenceArray = sentence.split('');
    let typed = [];
    let firstKeyPressed = false;
    let typedCount = 0;
    let timeLeft = true;

    while (timeLeft) {
        let span = await handleKeyPress();

        if (!firstKeyPressed) {
            let timer = setInterval(() => {
                let currentTime = Number(time.textContent);
                currentTime -= 1;
                time.textContent = currentTime;
                if (currentTime === 0) {
                    time.style.color = 'red';
                    timeLeft = false;
                    clearInterval(timer);
                }
            }, 1000);

            firstKeyPressed = true;
        }

        if (span && span !== 'Backspace') {
            typed.push(span);
        }
        if (span === 'Backspace') {
            typed.pop();
        }

        if (typed.length > 0) {
            for (let i=0;i < typed.length; i++) {
                if (typed[i].textContent === sentenceArray[i]) {
                    typed[i].style.color = 'green';
                } else {
                    typed[i].style.color = 'red';
                }
            }
        }

        if (typed.length === sentenceArray.length) {
            let numOfCorrect = 0;

            for(let i=0;i<sentenceArray.length; i++) {
                if (typed[i].textContent === '\u00A0' && sentenceArray[i] === ' ') {
                    numOfCorrect++;
                }
                if (typed[i].textContent === sentenceArray[i]) {
                    numOfCorrect++;
                }
            }

            if (numOfCorrect === sentenceArray.length) {
                typedCount += sentenceArray.filter(char => char !== ' ').length;

                displayBox.textContent = '';
                sentence = await displaySentence(selectionValues);
                sentenceArray = sentence.split('');
                numOfCorrect = 0;
                typed = [];
                paperText.innerHTML = '<span class="underscore">_</span>';
                setCursor();
            }
        }
    }

    let progress = 0;

    for(let i=0;i<typed.length; i++) {
        if (typed[i].textContent === sentenceArray[i] && typed[i].textContent !== '\u00A0') {
            progress++;
        }
    }

    typedCount += progress;
    let wordsPerMinute = (typedCount / 4.27) * (60 / timeLimit);
    wordsPerMinute = Math.trunc(wordsPerMinute*10) / 10;

    paper.classList.add('slideDownPaper');
    setTimeout(() => {
        paper.style.transform = 'translateY(100%)';
        paper.classList.remove('slideDown');
    }, 2000);

    fadeOut(0, 'countBox', 'displayBox');
    document.querySelector('.container').style.display = 'none';

    displayResults(wordsPerMinute);
}

function displayResults (wordsPerMinute) {
    let wpmText = document.querySelector('.wpm');
    let expBox = document.querySelector('.expBox');
    let typedAt = document.querySelector('.youTypedAt');

    typedAt.style.display = 'block';
    expBox.style.display = 'flex';
    wpmText.style.display = 'block';

    wpmText.textContent = `${wordsPerMinute} WPM!`;
    wpmText.classList.add('goldenText');


    setTimeout(() => {
        typedAt.style.opacity = '1';
    }, 3000);
    setTimeout(() => {
        wpmText.style.opacity = '1';
    }, 5000);
    setTimeout(() => {
        expBox.style.opacity = '1';
    }, 7000);
    
    let firstSection = document.querySelector('.section1Background');
    let secondSection = document.querySelector('.section2Background');
    let thirdSection = document.querySelector('.section3Background');
    let fourthSection = document.querySelector('.section4Background');

    setTimeout(() => {
        switch (true) {
            case wordsPerMinute<40:
                firstSection.classList.add('animateFill');
                break;
            case wordsPerMinute<60:
                firstSection.classList.add('animateFill');
                setTimeout(() => {secondSection.classList.add('animateFill');}, 1000);
                break;
            case wordsPerMinute<80:
                firstSection.classList.add('animateFill');
                setTimeout(() => {secondSection.classList.add('animateFill');}, 1000);
                setTimeout(() => {thirdSection.classList.add('animateFill');}, 2000);
                break;
            default:
                firstSection.classList.add('animateFill');
                setTimeout(() => {secondSection.classList.add('animateFill');}, 1000);
                setTimeout(() => {thirdSection.classList.add('animateFill');}, 2000);
                setTimeout(() => {fourthSection.classList.add('animateFill');}, 3000);
                break; 
        }
    }, 9000);
}

const start = document.querySelector('.start');
start.onclick = () => {
    start.disabled = true;
    document.querySelector('.ruleBox').classList.add('slideDown');
    test();
};