// It uses data_handler.js to visualize elements
import { dataHandler } from "./data_handler.js";

export let dom = {
    init: function () {
        //this.loadBoards()
        //this.loadCards()
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
                  
                 <div class="board-column-content">
                          
                 </div>
            </div>
        </section>
   
            `;
        }

        const outerHtml = `${boardList}`;

        let boardsContainer = document.querySelector('.board-container');
        boardsContainer.insertAdjacentHTML("beforeend", outerHtml);
        for (let board of boards) {
            dom.loadStatuses(board.id, function () {
                dom.loadCards(board.id)
            })
        }
    },
    loadStatuses: function (boardId, callback){
        dataHandler.getStatuses(function(statuses){
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
                        <div class="board-column-title data-${status.id}">${status.title}</div>
                    </div>
            `;
        }

        let outerHtml = `${statusList}`;

        let statusContainer = document.querySelector(`[data-id="${boardId}"] .board-columns`);
        statusContainer.insertAdjacentHTML("beforeend", outerHtml);
        // it adds necessary event listeners also
    },
    loadCards: function (boardId) {
            dataHandler.getBoard(boardId, function(cards) {
                dom.showCards(boardId, cards);
            });
    },
    showCards: function (boardId, cards) {
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

        let cardsContainer = document.querySelector(`[data-id="${boardId}"] .board-column`);
        cardsContainer.insertAdjacentHTML("beforeend", outerHtml);
        // it adds necessary event listeners also
    },
    // here comes more features
};
