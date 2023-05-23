const container = document.querySelector('.container');
const score = document.querySelector('.score span');
const form = document.querySelector('#form');
let minutesLabel = document.querySelectorAll('.minutes');
let secondsLabel = document.querySelectorAll('.seconds');
let totalSeconds = 0;
let myInterval;

//global data
let username;
let numOfPairs;

form.addEventListener('submit', function(e){
    e.preventDefault();

    const elements = e.target.elements;
    if(elements.pairs.value > 30 || elements.pairs.value < 1){
        alert("Number of pairs should be between 1 - 30");
        return;
    }

    if(elements.pairs.value && elements.username.value){
        initGame();
    }
});

//Main initializing function
function initGame(){
    username = document.querySelector('input[name=username]').value;
    numOfPairs = document.querySelector('input[name=pairs]').value;

    document.querySelector('#chosenUsername').innerHTML = username;

    //hiding the form
    document.querySelector('.form').style.display = 'none';

    //showing the game
    document.querySelector('.head').style.display = 'flex';
    container.style.display = 'grid';

    myInterval = setInterval(setTime, 1000);
    

    //setting the number of pairs
    generateCards(numOfPairs);
}

function generateCards(num){
    for(let i = 0; i < num; i++){
        const card = document.createElement('div');
        card.classList.add('cell');
        card.innerHTML = `<div class="front" data-index="${i+1}">${i+1}</div>
                            <div class="back"></div>`;
        container.appendChild(card);
        container.appendChild(card.cloneNode(true));
    }
    const cards = document.querySelectorAll('.cell');
    const fronts = document.querySelectorAll('.front');
    shuffleCards(cards);
    flipCard(fronts, cards);
}



function shuffleCards(cards){
    cards.forEach(card => {
        const num = [...Array(cards.length).keys()]
        const random = Math.floor(Math.random() * num.length);

        card.style.order = num[random];
    });
};


function flipCard(fronts, cards){
    for(let i = 0; i < cards.length; i++){
        fronts[i].classList.add('show');
        setInterval(() => {
            fronts[i].classList.remove('show');
        }, 2500);

        cards[i].addEventListener('click', function(){
            fronts[i].classList.add('flip');

            const flipped = document.querySelectorAll('.flip');
            if(flipped.length == 2){
                container.style.pointerEvents = 'none';
                
                setInterval(() => {
                    container.style.pointerEvents = 'all';
                }, 1000);

                match(flipped[0], flipped[1]);
            }
        });
    }
}

function match(first, second){
    if(first.dataset.index == second.dataset.index){

        score.innerHTML = parseInt(score.innerHTML) + 1;

        first.classList.remove('flip');
        second.classList.remove('flip');

        first.classList.add('match');
        second.classList.add('match');

        isDone();

    }else{
        setTimeout(() => {
            first.classList.remove('flip');
            second.classList.remove('flip');
        }, 1000);
    }
}


function isDone(){
    const matches = document.querySelectorAll('.match');
    if(matches.length == numOfPairs * 2){
        document.querySelector('.head').style.display = 'none';
        container.style.display = 'none';
        document.querySelector('.finish').style.display = 'block';
        document.querySelector('.finishScore span').innerHTML = score.innerHTML;
        clearInterval(myInterval);
    }
}



//time counter function
function setTime() {
    ++totalSeconds;
    minutesLabel.forEach(minute => {
        minute.innerHTML = pad(parseInt(totalSeconds / 60));
    });
    secondsLabel.forEach(second => {
        second.innerHTML = pad(totalSeconds % 60);
    });
}

function pad(val) {
    let valString = val + "";
    if (valString.length < 2) {
    return "0" + valString;
    } else {
    return valString;
    }
}


//restart new game
document.querySelector('.finishButton').addEventListener('click', () => {
    window.location.href=window.location.href;
});