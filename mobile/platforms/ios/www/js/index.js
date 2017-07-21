const app = {
    initialize: _initialize,
    onDeviceReady: _deviceReady
};

app.initialize();


// 1. Reference elements
let gameScore = document.querySelector('game-score');
let gameCards = document.querySelectorAll('game-card');
let allCards = document.querySelector('#all-cards');
let currentUser = new User();
let store = new GameStore();
let utils = new Utils();
var cards = [];
var trials = 0;
gameScore.hidden = true;

// 2. Create new user
store.createNewUser(utils.pickRandomName()).then(user => {
    currentUser.id = user.id;
    currentUser.name = user.name;
});

// 3. Get high score
store.getTopScore().then(json => {
    // 3.1 Filter to get number

    // 3.2 Update UI
    gameScore.score = 1000;
    gameScore.items = [{name:'aa', score: 2000}];

}).catch(e => {
    console.error(e);
});


// 4. Get random images & update cards
store.getRandomPhotos(3).then(photos => {

    // 4.1 Get random list idx 
    let idx = _randomIdx(6);

    // 4.2 Get list of photos
    let allPhotos = photos.concat(photos);

    // 4.3 Update each element's id & url
    idx.forEach(i => {
        gameCards[i].url = allPhotos[i].image_url;
        gameCards[i].id = allPhotos[i].id;
    }, this);

}).catch(e => {
    console.error(e);
});

// 4. Called when user clicks a card
function onReveal(id, index) {
    // 4.1
    ++trials;

    // 4.2
    gameCards.forEach(el => {
        // 4.2.1 Only look for revealed & enabled cards
        if (!el.unrevealed && !el.disable) {

            // 4.2.2 Make sure to push unique cards that isn't already existing
            if (!cards.find(c => { return c.idx === el.idx })) {

                // 4.2.3 
                cards.push(el);
            }
        }
    }, this);

    // 4.3
    setTimeout(() => {

        // 4.3.1 
        if (cards.length >= 2) {

            // 4.3.2 To escape user selecting the same card twice
            if (cards[0].id === cards[1].id && cards[0].idx !== cards[1].idx) {
                cards[0].disable = true;
                cards[1].disable = true;
                cards = [];
            } else {

                // 4.3.3 Unreveal all cards if no matches are found
                cards.forEach(c => {
                    c.unrevealed = !c.unrevealed;
                    c.classList.toggle("ff");
                });
                cards = [];
            }
        }

        var allDisabled = [];
        for(el of gameCards) {
            if (el.disable) { allDisabled.push(el) }
        }
        if(allDisabled.length == 6) {
            _finishGame();
        }

        // 4.3.4 Add small delay for usability
    }, 1500);

}


/* Scoring system */
function _calculateScore(trials) {
    // Best scenario is  (26 - 6) * 500 = 10,000. Worst scenario (26 - 26) * 500 = 0.
    return (26 - trials) * 500;
}

/* Finish game */
function _finishGame() {
    // 1. Calculate score
    var score = _calculateScore(trials);

    // 2. Update ViewModel local & remote
    currentUser.addGameScore(score);
    store.addScoreToUser(currentUser.id, score);

    // 3. Update UI
    gameScore.hidden = false;
    allCards.hidden = true;
    gameScore.name = currentUser.name;
    gameScore.score = currentUser.scores[0];
    trials = 0;
}
/* [[ARCHITECUTRE]]: After submitting score, make method to update user ViewModel. 

2 options:
  - Call getUserById() 'TBD'
  - Push changes in ViewModel after success to server. Order depends if offline first apporach is prefered or not.

If game is offline first (I support that) a network queue must be created to manage request/response/success/failure cycle.
*/


/* Restart game */
function _restartGame() {
    // TBD
}

/* Generate random Idx */
function _randomIdx(n) {
    let arr = Array.apply(null, { length: n }).map(Number.call, Number);
    let current = arr.length, temp, random;

    while (0 !== current) {
        // Pick a remaining element...
        random = Math.floor(Math.random() * current);
        current -= 1;

        // And swap it with the current element.
        temp = arr[current];
        arr[current] = arr[random];
        arr[random] = temp;
    }

    return arr;
}


/* App initialize */
function _initialize() {
    document.addEventListener('deviceready', app.onDeviceReady.bind(this), false);
}

/* Device ready event listener */
function _deviceReady() {
    if ('addEventListener' in document) {

        /* Fastclick polyfill */
        document.addEventListener('DOMContentLoaded', () => {
            FastClick.attach(document.body);
        }, false);

        /* Remove grey highlight in iOS */
        document.addEventListener("touchstart", () => { }, true);
    }
}



/*
References
https://css-tricks.com/snippets/css/remove-gray-highlight-when-tapping-links-in-mobile-safari/
https://github.com/ftlabs/fastclick
https://stackoverflow.com/questions/3746725/create-a-javascript-array-containing-1-n
https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
*/