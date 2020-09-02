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

        const outerHtml =
            `<button class="create-board">Add New Board</button>` +
            `<ul class="board-container">
                ${boardList}
            </ul>`;



        let boardsContainer = document.querySelector('#boards');
        boardsContainer.insertAdjacentHTML("beforeend", outerHtml);
        let createButton = document.querySelector('.create-board')
        createButton.addEventListener('click', dom.createBoard)

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
    createBoard: function (event) {
        let createBoardButton = event.target;
        createBoardButton.classList.add('hidden');

        const input_field = '<input class="create-board-title" placeholder="Write board title then press enter"/>'
        createBoardButton.insertAdjacentHTML('afterend', input_field);

        document.querySelector(".create-board-title")
            .addEventListener('keypress', (e) => {
                    console.log(e.key)
                    if (e.key === 'Enter') {
                        let board_title = e.target.value
                        console.log(board_title)
                        dataHandler.createNewBoard(board_title, dom.loadBoards)
                    }
                }
            )

        // () => {
        // todo add callback function to print newly created board
        // dataHandler.createNewBoard(board_title, () => console.log("HEY"))}
    }
};
