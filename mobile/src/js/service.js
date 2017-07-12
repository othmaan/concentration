/* 
    Reveal module pattern
    Ref. https://addyosmani.com/resources/essentialjsdesignpatterns/book/#modulepatternjavascript
*/

let PhotoStore = function () {

    //////// Private ////////
    let _cache = [];
    let url = 'http://localhost:1337';

    //////// Interface ////////
    return {
        getRandomPhotos: _getRandomPhotos,
        createUser: _createUser,
        getUser: _getUser,
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
            fetch(url + '/user')
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

    function _getTopScore() {
        return new Promise((resolve, reject) => {
            fetch(url + '/score' + '?sort=score%20DESC')
                .then(_checkStatus)
                .then(_parseJSON)
                .then(json => {
                    // Filtering duplicate users
                    
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