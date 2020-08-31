// It uses data_handler.js to visualize elements
import { dataHandler } from "./data_handler.js";

export let dom = {
    init: function () {
        // This function should run once, when the page is loaded.
        //main szerű használat:
            // loadBoards
            // showBoards
            // loadCards
            // showCards

    },
    loadBoards: function () {
        // retrieves boards and makes showBoards called
        dataHandler.getBoards(function(boards){
            dom.showBoards(boards);
        });
    },
    showBoards: function (boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also

        let boardList = '';

        for(let board of boards){
            boardList += `
                <div><li>${board.title}</li></div>
            `;
        }

        const outerHtml = `
            <ul class="board-container">
                ${boardList}
            </ul>`;



        let boardsContainer = document.querySelector('#boards');
        boardsContainer.insertAdjacentHTML("beforeend", outerHtml);
    },
    loadCards: function (boardId) {
        let cardsList = '';

        for(let card of cards){
            cardsList += `
                <div><li>${card.title}</li></div>
            `;
        }
    },
    showCards: function (cards) {
        // shows the cards of a board
        // it adds necessary event listeners also
    },
    // here comes more features
};
