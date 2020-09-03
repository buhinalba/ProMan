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
        
        <section class="board" data-id="${board.id}">
            <div class="board-header"><span class="board-title">${board.title}</span>
                <button class="board-add">Add Card</button>
                <button class="board-toggle"><i class="fas fa-chevron-down"></i></button>
            </div>
            <div class="board-columns">
                  
            </div>
        </section>
   
            `;
        }

        const outerHtml = `${boardList}`;


        let boardsContainer = document.querySelector('.board-container');
        boardsContainer.innerHTML = outerHtml;
        let createButton = document.querySelector('.create-board');
        createButton.addEventListener('click', dom.createBoard);
        createButton.addEventListener('mouseover', dom.hover)
        createButton.addEventListener('mouseleave', dom.leave)
        for (let board of boards) {
            dom.loadStatuses(board.id, function () {

            })
        }
        // todo add rename feature for boards
        let renameBoardButtons = document.querySelectorAll('.board-title')
        for (let renameBoardButton of renameBoardButtons) {
            renameBoardButton.addEventListener('click', dom.renameBoard)
            renameBoardButton.addEventListener('mouseover', dom.hover)
            renameBoardButton.addEventListener('mouseleave', dom.leave)
        }
    },
    loadStatuses: function (boardId, callback){
        dataHandler.getStatuses(boardId, function(statuses){
            dom.showStatuses(boardId, statuses);
            callback();
        });
    },
    showStatuses: function (boardId, statuses) {
        // shows the cards of a board
        let statusList = '';

        for(let status of statuses){
            statusList += `
                    <div class="board-column">    
                        <div class="board-column-title" data-status="${status.id}">${status.title}</div>
                    </div>
            `;
        }

        let outerHtml = `${statusList}`;

        let statusContainer = document.querySelector(`.board[data-id="${boardId}"] .board-columns`);
        statusContainer.insertAdjacentHTML("beforeend", outerHtml);
        for (let status of statuses) {
            dom.loadCards(boardId, status.id)
        }
        // todo add rename feature to statuses
        // it adds necessary event listeners also
    },
    loadCards: function (boardId, statusId) {
            dataHandler.getBoard(boardId, statusId, function(cards) {
                dom.showCards(boardId, statusId, cards);
            });
    },
    showCards: function (boardId, statusId, cards) {
        // shows the cards of a board
        let cardsList = '';

        for(let card of cards){
            cardsList += `    
                        <div class="card">
                            <div class="card-remove"><i class="fas fa-trash-alt"></i></div>
                            <div class="card-title">${card.title}</div>
                        </div>
            `;
        }

        const outerHtml = `${cardsList}`;

        let cardsContainer = document.querySelector(`.board[data-id="${boardId}"] .board-columns .board-column [data-status="${statusId}"]`);
        cardsContainer.insertAdjacentHTML("beforeend", outerHtml);

        // it adds necessary event listeners also
    },
    // here comes more features
    createBoard: function (event) {
        let createBoardButton = event.target;
        createBoardButton.classList.add('hidden');

        const input_field = '<input class="create-board-title" placeholder="Write board title then press enter"/>'
        createBoardButton.insertAdjacentHTML('afterend', input_field);

        let inputField = document.querySelector(".create-board-title")
        inputField.addEventListener('keypress', (e) => {
                    console.log(e.key)
                    if (e.key === 'Enter') {
                        let board_title = e.target.value
                        console.log(board_title)
                        dataHandler.createNewBoard(board_title, dom.loadBoards)
                        inputField.remove()
                        createBoardButton.classList.remove('hidden');
                    }
                }
            )
    },
    renameBoard: function (event) {
        let renameBoardButton = event.target;
        renameBoardButton.classList.add('hidden')
        const input_field = '<input class="create-board-title" placeholder="Write board title then press enter"/>'
        renameBoardButton.insertAdjacentHTML('afterend', input_field);
        let board_id = renameBoardButton.closest('.board').dataset.id
        let inputField = document.querySelector(".create-board-title")

        inputField.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        let board_title = e.target.value
                        console.log(board_title)
                        dataHandler.renameBoard(board_id, board_title, dom.loadBoards)
                        inputField.remove()
                        renameBoardButton.classList.remove('hidden');
                    }
                }
            )
    },
    hover: function (event) {
        let button = event.target
        button.classList.add('hover')
    },
    leave: function (event) {
        let button = event.target
        button.classList.remove('hover')
    }
};
