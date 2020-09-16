// It uses data_handler.js to visualize elements
import { dataHandler } from "./data_handler.js";

export let dom = {
    init: function () {
        dom.loadBoards()
        const passwordToggle = document.querySelector('.password-toggle')
        console.log(passwordToggle)
        if (passwordToggle) {
            console.log(passwordToggle)
            passwordToggle.addEventListener('click', dom.togglePassword)
            passwordToggle.addEventListener('mouseover', dom.hover);
            passwordToggle.addEventListener('mouseleave', dom.leave);
        }

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
                <button class="board-add-status">Add Status</button>
      
                <button class="board-toggle collapsed" type="button" data-toggle="collapse" data-target="#toggle-${board.id}" aria-expanded="false" aria-controls="board-columns"><i class="fas fa-chevron-down"></i></button>
                <button class="create-card">Create Card</button>
            </div>
            <div class="board-columns collapse" id="toggle-${board.id}">
                  
            </div>
        </section>
   
            `;
        }

        const outerHtml = `${boardList}`;


        let boardsContainer = document.querySelector('.board-container');
        boardsContainer.innerHTML = outerHtml;
        let createButton = document.querySelector('.create-board');
        createButton.addEventListener('click', dom.createBoard);
        createButton.addEventListener('mouseover', dom.hover);
        createButton.addEventListener('mouseleave', dom.leave);
        let createStatusButtons = document.querySelectorAll('.board-add-status');
        for (let statusButton of createStatusButtons) {
            statusButton.addEventListener('click', dom.createStatus);
            statusButton.addEventListener('mouseover', dom.hover);
            statusButton.addEventListener('mouseleave', dom.leave);
        }

        for (let board of boards) {
            dom.loadStatuses(board.id, function () {

            })
        }
        let createCardButtons = document.querySelectorAll('.create-card');
        for (let button of createCardButtons){
            button.addEventListener('click', dom.createCard);
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
                        <div class="board-column-title" data-status="${status.id}"><div class="status-title">${status.title}</div></div>
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

        let renameStatusButtons = document.querySelectorAll('.status-title')
        for (let renameStatusButton of renameStatusButtons) {
            renameStatusButton.addEventListener('click', dom.renameStatus)
            renameStatusButton.addEventListener('mouseover', dom.hover)
            renameStatusButton.addEventListener('mouseleave', dom.leave)
        }
        // it adds necessary event listeners also
    },
    loadCards: function (boardId, statusId) {
            dataHandler.getBoard(boardId, statusId, function(cards) {
                dom.showCards(boardId, statusId, cards);
            });
    },
    showCards: function (boardId, statusId, cards) {
        // shows the cards of a board
        console.log(cards)
        let cardsList = '';

        // data order is given only for testing purposes
        for(let card of cards){
            cardsList += `    
    
                        <div class="card" data-order="${card.order}">
                            <div class="card-remove" data-id="${card.id}"><i class="fas fa-trash-alt"></i></div>
                            <div class="card-title" data-card-id="${card.id}">${card.title}</div>
                        </div>
            `;
        }

        const outerHtml = `${cardsList}`;

        let cardsContainer = document.querySelector(`.board[data-id="${boardId}"] .board-columns .board-column [data-status="${statusId}"]`);
        cardsContainer.insertAdjacentHTML("beforeend", outerHtml);
        let renameCardButtons = document.querySelectorAll('.card-title')
        for (let renameCardButton of renameCardButtons) {
            renameCardButton.addEventListener('click', dom.renameCard)
            renameCardButton.addEventListener('mouseover', dom.hover)
            renameCardButton.addEventListener('mouseleave', dom.leave)
        }
        let deleteButton = document.querySelectorAll(".card-remove")
        for (let deleteButtonElement of deleteButton) {
            deleteButtonElement.addEventListener('click', dom.deleteCard)
        }
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
    createStatus: function(evt){
        let createStatusButton = evt.target;
        createStatusButton.classList.add('hidden');
        const input_field = '<input class="create-board-title" placeholder="Write status title then press enter"/>'
        createStatusButton.insertAdjacentHTML('afterend', input_field);
        let inputField = document.querySelector(".create-board-title")
        inputField.addEventListener('keypress', (e) => {
                    console.log(e.key)
                    if (e.key === 'Enter') {
                        let status_title = e.target.value;
                        let board_id = evt.target.closest('section').dataset.id;
                        console.log(status_title)
                        dataHandler.createNewStatus(status_title, board_id, dom.loadBoards)
                        inputField.remove()
                        createStatusButton.classList.remove('hidden');
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
        document.addEventListener('click', (e) => {
            if (!renameBoardButton.contains(e.target) && !(inputField === e.target)) {
                inputField.remove()
                renameBoardButton.classList.remove('hidden');
            }
        })
        inputField.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        let board_title = e.target.value
                        dataHandler.renameBoard(board_id, board_title, () => {})
                        inputField.remove()
                        renameBoardButton.innerHTML = board_title
                        renameBoardButton.classList.remove('hidden');
                    }
                }
            )
    },
    renameStatus: function (event) {
    let renameStatusButton = event.target;
        renameStatusButton.classList.add('hidden')
        const input_field = '<input class="create-board-title" placeholder="Write status title then press enter"/>'
        renameStatusButton.insertAdjacentHTML('afterend', input_field);
        let status_id = renameStatusButton.closest('.board-column-title').dataset.status
        let inputField = document.querySelector(".create-board-title")
        document.addEventListener('click', (e) => {
            if (!renameStatusButton.contains(e.target) && !(inputField === e.target)) {
                inputField.remove()
                renameStatusButton.classList.remove('hidden');
            }
        })

    inputField.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    let status_title = e.target.value
                    console.log(status_title)
                    dataHandler.renameStatus(status_id, status_title,
                        () => {renameStatusButton.innerHTML = status_title})
                    inputField.remove()
                    renameStatusButton.classList.remove('hidden');
                }
            }
        )
    },
    renameCard: function(event){
        let renameCardButton = event.target;
        renameCardButton.classList.add('hidden')
        const input_field = '<input class="create-board-title" placeholder="Write card title then press enter"/>'
        renameCardButton.insertAdjacentHTML('afterend', input_field);
        let card_id = renameCardButton.closest('.card-title').dataset.cardId;
        let inputField = document.querySelector(".create-board-title")
        document.addEventListener('click', (e) => {
            if (!renameCardButton.contains(e.target) && !(inputField === e.target)) {
                inputField.remove()
                renameCardButton.classList.remove('hidden');
            }
        })

    inputField.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    let card_title = e.target.value
                    console.log(card_title)
                    dataHandler.renameCard(card_title, card_id, () => {})
                    inputField.remove()
                    renameCardButton.innerHTML = card_title
                    renameCardButton.classList.remove('hidden');
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
    },

    togglePassword: function (event) {
        event.preventDefault()
        const passwordElement = document.querySelector('.password')
        if (passwordElement.type === 'text') {
            passwordElement.type = 'password'
        } else {
            passwordElement.type = 'text'
        }

    },
    createCard: function(event){
                let createCardButton = event.target;
                let board = createCardButton.closest("section.board")
                let boardID = board.dataset.id
                let statusID = board.querySelector(".board-column-title").dataset.status
                createCardButton.classList.add('hidden');

                const input_field = '<input class="create-card-title" placeholder="Write down the Card title then press enter"/>'
                createCardButton.insertAdjacentHTML('afterend', input_field);
                let inputField = document.querySelector(".create-card-title");
                inputField.addEventListener('keypress', (e) => {
                    console.log(e.key)
                    if (e.key === 'Enter') {
                        let card_title = e.target.value
                        console.log(card_title)
                        dataHandler.createCard(card_title, boardID, statusID, dom.loadCards)
                        inputField.remove()
                        createCardButton.classList.remove('hidden');
                    }
                })
            },
    deleteCard: function(event){
        let deleteCardButton = event.target.parentNode
        let card_id = deleteCardButton.dataset.id
        document.addEventListener('click', (e) => {
            dataHandler.deleteCard(card_id, function (cards) {
                let cardToDelete = deleteCardButton.parentNode
                cardToDelete.remove()
            })

        })
    },
};
