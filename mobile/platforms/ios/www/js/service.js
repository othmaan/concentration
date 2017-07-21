/* 
    Reveal module pattern
    Ref. https://addyosmani.com/resources/essentialjsdesignpatterns/book/#modulepatternjavascript
*/

function GameStore() {

    //////// Private ////////
    let _cache = [];
    let url = 'http://localhost:1337';

    //////// Interface ////////
    return {
        getRandomPhotos: _getRandomPhotos,
        createNewUser: _createUser,
        getUserDetails: _getUser,
        addScoreToUser: _createScore,
        getTopScore: _getTopScore
    }


    //////// Implementation ////////
    /* Returns number of random photos */
    function _getRandomPhotos(number) {
        // 1.
        return new Promise((resolve, reject) => {
            _get().then(photos => {
                let all = [];
                let rand = Math.floor(Math.random() * (photos.length - number));
                for (i = 0; i < number; i++) {
                    all.push(photos[rand + i]);
                }
                resolve(all);
            }).catch(error => {
                reject(error);
            })
        });
    }

    /* Returns array of photos from cache first then API */
    function _get() {
        // 1.
        return new Promise((resolve, reject) => {
            if (_cache.size) {
                resolve(_cache);
            } else {
                let params = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
                fetch('https://api.500px.com/v1/photos/search?term=kitten&feature=popular&only=11&include_store=0' +
                    '&tags=0&include_states=0&image_size=3&consumer_key=UpwVHaShpniIM00n77hIPTsjWc8tLV4RfTay9PqJ', params)
                    .then(_checkStatus)
                    .then(_parseJSON)
                    .then(json => {
                        resolve(json.photos);
                    }).catch(e => {
                        reject(e);
                    });
            }
        });
    }

    /* Add user to db - Should take user object, for simplicity takes name only */
    function _createUser(name) {
        return new Promise((resolve, reject) => {
            let params = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'name': name
                })
            };
            fetch(url + '/user', params)
                .then(_checkStatus)
                .then(_parseJSON)
                .then(json => {
                    resolve(json);
                }).catch(e => {
                    reject(e);
                });
        });
    }

    function _getUser() {
        return new Promise((resolve, reject) => {
            fetch(url + '/user' + '?sort=score%20DESC')
                .then(_checkStatus)
                .then(_parseJSON)
                .then(json => {
                    resolve(json);
                }).catch(e => {
                    reject(e);
                });
        });
    }

    function _createScore(id, score) {
         return new Promise((resolve, reject) => {
            let params = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'owner': id,
                    'score': score
                })
            };
            fetch(url + '/score', params)
                .then(_checkStatus)
                .then(_parseJSON)
                .then(json => {
                    resolve(json);
                }).catch(e => {
                    reject(e);
                });
        });
    }

    function _getTopScore() {
        return new Promise((resolve, reject) => {
            fetch(url + '/score' + '?sort=score%20DESC')
                .then(_checkStatus)
                .then(_parseJSON)
                .then(json => {
                    resolve(json);
                }).catch(e => {
                    reject(e);
                });
        });
    }

    /* Promise returned from fetch() won't reject on HTTP error even if the response is an HTTP 404 or 500. */
    function _checkStatus(res) {
        if (res.status >= 200 && res.status < 300) {
            return res;
        } else {
            var error = new Error(res.statusText);
            error.res = res;
            throw error;
        }
    }

    /* Parse JSON returned by fetch() */
    function _parseJSON(res) {
        return res.json();
    }
}

/* Generate random names & other stuff */
function Utils() {

    //////// Private ////////
    const adjectives = ["adamant", "adroit", "amatory", "animistic", "antic", "arcadian", "baleful", "bellicose", "bilious", "boorish", "calamitous", "caustic", "cerulean", "comely", "concomitant", "contumacious", "corpulent", "crapulous", "defamatory", "didactic", "dilatory", "dowdy", "efficacious", "effulgent", "egregious", "endemic", "equanimous", "execrable", "fastidious", "feckless", "fecund", "friable", "fulsome", "garrulous", "guileless", "gustatory", "heuristic", "histrionic", "hubristic", "incendiary", "insidious", "insolent", "intransigent", "inveterate", "invidious", "irksome", "jejune", "jocular", "judicious", "lachrymose", "limpid", "loquacious", "luminous", "mannered", "mendacious", "meretricious", "minatory", "mordant", "munificent", "nefarious", "noxious", "obtuse", "parsimonious", "pendulous", "pernicious", "pervasive", "petulant", "platitudinous", "precipitate", "propitious", "puckish", "querulous", "quiescent", "rebarbative", "recalcitant", "redolent", "rhadamanthine", "risible", "ruminative", "sagacious", "salubrious", "sartorial", "sclerotic", "serpentine", "spasmodic", "strident", "taciturn", "tenacious", "tremulous", "trenchant", "turbulent", "turgid", "ubiquitous", "uxorious", "verdant", "voluble", "voracious", "wheedling", "withering", "zealous"];
    const nouns = ["ninja", "chair", "pancake", "statue", "unicorn", "rainbows", "laser", "senor", "bunny", "captain", "nibblets", "cupcake", "carrot", "gnomes", "glitter", "potato", "salad", "toejam", "curtains", "beets", "toilet", "exorcism", "stick figures", "mermaid eggs", "sea barnacles", "dragons", "jellybeans", "snakes", "dolls", "bushes", "cookies", "apples", "ice cream", "ukulele", "kazoo", "banjo", "opera singer", "circus", "trampoline", "carousel", "carnival", "locomotive", "hot air balloon", "praying mantis", "animator", "artisan", "artist", "colorist", "inker", "coppersmith", "director", "designer", "flatter", "stylist", "leadman", "limner", "make-up artist", "model", "musician", "penciller", "producer", "scenographer", "set decorator", "silversmith", "teacher", "auto mechanic", "beader", "bobbin boy", "clerk of the chapel", "filling station attendant", "foreman"];

    //////// Interface ////////
    return {
        pickRandomName: _pickName
    }

    //////// Implementation ////////
    function _pickName() {
        var first = adjectives[Math.floor(Math.random() * adjectives.length)];
        var last = nouns[Math.floor(Math.random() * nouns.length)];
        return first.toUpperCase() + " " + last.toUpperCase();
    }
}

/* User class */
class User {
    constructor(id, name, scores) {
        this.id = id ? id : 0;
        this.name = name ? name : '';
        this.scores = scores ? scores : [];
    }

    addGameScore(score) {
        this.scores.push(score);
    }

    /* Returns to scores in descending order */
    getTopScores() {
        // TBD
    }

    /* Returns recent scores */ 
    getRecentScores() {
        // TBD
    }
}
/* [[ARCHITECUTRE]]: More absctaction is needed. Make Scores class that has id, timestamp, score
*/