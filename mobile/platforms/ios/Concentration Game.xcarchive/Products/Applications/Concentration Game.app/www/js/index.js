const app = {
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    onDeviceReady: function () {
        if ('addEventListener' in document) {

            /* Fastclick polyfill */
            document.addEventListener('DOMContentLoaded', () => {
                FastClick.attach(document.body);
            }, false);

            /* Remove grey highlight in iOS */
            document.addEventListener("touchstart", () => {}, true);
        }
    }
};

// 0. App initialize 
app.initialize();

// 1. Reference elements
let gameScore = document.querySelector('game-score');
let gameCards = document.querySelectorAll('game-card');
let store = new PhotoStore();
let cards = [];

// 2. Get high score
gameScore.score = 1000;

// 3. Get 3 random images
store.getRandomPhotos(3).then(photos => {

    gameCards.forEach(el => {
        let random = Math.floor(Math.random() * photos.length);
        el.url = photos[random].image_url;
        el.id = photos[random].id;
    }, this);
}).catch(e => {
    console.error(e);
});

// 4. Implement game logic
function onReveal(id, index) {
    // 1.
    gameCards.forEach(el => {
        // 1.1 Only look for revealed & enabled cards
        if (!el.unrevealed && !el.disable) {
            
            // 1.2 Make sure to push unique cards that isn't already existing
            if(!cards.find(c => {return c.idx === el.idx})) {
                
                // 1.3 
                cards.push(el);
            }
        }
    }, this);
    
    // 2. 
    setTimeout(() => {
        
        // 2.1 
        if (cards.length >= 2) {
            
            // 2.2 To escape user selecting the same card twice
            if (cards[0].id === cards[1].id && cards[0].idx !== cards[1].idx) {
                cards[0].disable = true;
                cards[1].disable = true;
            } else {
                
                // 2.3 Unreveal all cards if no matches are found
                cards.forEach(c => {
                    c.unrevealed = true;
                });
            }
            cards = [];
        }

        // 2.4 Add small delay for usability
    }, 1500);

}

/*
References
https://css-tricks.com/snippets/css/remove-gray-highlight-when-tapping-links-in-mobile-safari/
https://github.com/ftlabs/fastclick
*/