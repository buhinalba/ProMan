// this object contains the functions which handle the data and its reading/writing
// feel free to extend and change to fit your needs

// (watch out: when you would like to use a property/function of an object from the
// object itself then you must use the 'this' keyword before. For example: 'this._data' below)
export let dataHandler = {
    _data: {}, // it is a "cache for all data received: boards, cards and statuses. It is not accessed from outside.
    _api_get: function (url, callback) {
        // it is not called from outside
        // loads data from API, parses it and calls the callback with it

        fetch(url, {
            method: 'GET',
            credentials: 'same-origin'
        })
        .then(response => response.json())  // parse the response as JSON
        .then(json_response => callback(json_response));  // Call the `callback` with the returned object
    },
    _api_post: function (url, data, callback) {
        // it is not called from outside
        // sends the data to the API, and calls callback function

        fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
            credentials: "same-origin"
        })
        .then(response => response.json())  // parse the response as JSON
        .then(json_response => callback(json_response))
        .catch(error => {
                console.log("Fetch error: " + error);
            });
    },
    _api_delete: function (url, data, callback) {
        // it is not called from outside
        // sends the data to the API, and calls callback function

        fetch(url, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
            credentials: "same-origin"
        })
            .then(response => response.json())  // parse the response as JSON
            .then(json_response => callback(json_response))
            .catch(error => {
                console.log("Fetch error: " + error);
            });
    },

    init: function () {
    },
    getBoards: function (callback) {
        // the boards are retrieved and then the callback function is called with the boards

        // Here we use an arrow function to keep the value of 'this' on dataHandler.
        //    if we would use function(){...} here, the value of 'this' would change.
        this._api_get('/get-boards', (response) => {
            this._data['boards'] = response;
            callback(response);
        });
    },
    getBoard: function (boardId, statusId, callback) {
        // the board is retrieved and then the callback function is called with the board
        this._api_get(`/get-cards/${boardId}/get-statuses/${statusId}`, (boardId, statusId, response) => {
            this._data['cards'] = response;
            callback(boardId, statusId, response);
        });
    },
    getStatuses: function (boardId, callback) {
        // the statuses are retrieved and then the callback function is called with the statuses
        this._api_get(`/get-status-for-board/${boardId}`, (boardId, response) => {
            this._data['statuses'] = response;
            callback(boardId, response);
        });
    },
    getStatus: function (statusId, callback) {
        // the status is retrieved and then the callback function is called with the status
        this._api_get(`/get-statuses/${statusId}`, (statusId, response) => {
            this._data['statuses'] = response;
            callback(statusId, response);
        });
    },
    getCardsByBoardId: function (boardId, callback) {
        // the cards are retrieved and then the callback function is called with the cards
    },
    getCard: function (cardId, callback) {
        // the card is retrieved and then the callback function is called with the card
    },
    createNewBoard: function (board_title, callback) {
        // creates new board, saves it and calls the callback function with its data
        let data = {board_title: board_title}
        this._api_post("/create-board", data, callback)
        // is event handler should trigger this function, the use fetch with post method, the
        // callback to print??
    },
    createCard: function (cardTitle, boardId, statusId, callback) {
        let data = {card_title: cardTitle, board_id: boardId, status_id: statusId}
        this._api_post("/create-card", data, callback)
    },
    createNewStatus: function(status_title, board_id, callback){
        let data = {status_title: status_title, board_id: board_id}
        this._api_post('/create-status', data, callback)
    },
    createNewCard: function (cardTitle, boardId, statusId, callback) {
        // creates new card, saves it and calls the callback function with its data
    },
    renameBoard: function (board_id, board_title, callback) {
        let data = {board_id: board_id, board_title:board_title}
        this._api_post('/rename-board', data, callback)
    },
    renameStatus: function (status_id, status_title, callback) {
        let data = {status_id: status_id, status_title: status_title}
        this._api_post('/rename-status', data, callback)
    },
    renameCard: function (card_title, card_id, callback) {
        let data = {card_title: card_title, card_id: card_id}
        this._api_post('/rename-card', data, callback)
    },
    deleteBoard: function (board_id, callback){
        this._api_get(`/delete-board/${board_id}`, (response)=>{
            callback(response)
        })
    },
    deleteStatus: function (status_id, callback){
        this._api_get(`/delete-status/${status_id}`, (response)=>{
            callback(response)
        })
    },
    deleteCard: function (card_id, callback){
        this._api_get(`/delete-card/${card_id}`, (response)=>{
            callback(response)
        })
    },
    updateCardPosition(status_id, previousSibling, card_id) {
        let previousOrder = previousSibling ? previousSibling.dataset.order : 0
        this._api_get(`/update-card/${card_id}/${status_id}/${previousOrder}`, () => {})
    }

    // here comes more features
};
