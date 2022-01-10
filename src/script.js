const gameBoard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];

    const reset = () => {
        for (let i = 0; i < 9; i++) {
            board[i] = "";
        }
    }

    const getBoard = () => {
        return board;
    }

    const getField = (index) => {
        return board[index];
    }

    const setField = (index, sign) => {
        board[index] = sign;
    }

    return { setField, getBoard, getField, reset }; 

})();

const gameController = (() => {

    let round = 1;

    const lookup = {
        O: 1, // ai
        X: -1, // player
        draw: 0 // draw game
    }

    const playRound = (index) => {
        gameBoard.setField(index, 'X'); // player turn
        if (getWinner(gameBoard.getBoard()) !== null) {
            displayController.showResult(getWinner(gameBoard.getBoard()));
            return;
        }
        ++round;
        if (round < 9) {
            playAI(); // AI's turn
            if (getWinner(gameBoard.getBoard()) !== null) {
                displayController.showResult(getWinner(gameBoard.getBoard()));
                return;
            }
            ++round;
        }
    }

    const playAI = () => {
        let tttBoard = gameBoard.getBoard();
        let bestScore = -Infinity, bestIndex;

        for (let i = 0; i < 9; i++) {
            if (tttBoard[i] === '') {
                tttBoard[i] = 'O'; // make a move
                let score = minimax(tttBoard, false);
                if (score > bestScore) {
                    bestScore = score;
                    bestIndex = i;
                }
                tttBoard[i] = ''; // backtrack move
            }
        }
        gameBoard.setField(bestIndex, 'O');
    }

    const calculateScore = (board) => {
        let emptyFields = 1;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                emptyFields++;
            }
        }
        return emptyFields;
    }


    function minimax(board, isMaximizing) {
        let winner = getWinner(board);
        if (winner !== null) {
            return calculateScore(board) * lookup[winner];
        }
        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] == "") {
                    board[i] = 'O'; // make move
                    let score = minimax(board, false);
                    board[i] = ''; // backtrack
                    bestScore = Math.max(score, bestScore);
                }
            }
            
            return bestScore;
        }
        else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] == "") {
                    board[i] = 'X'; // make a move
                    let score = minimax(board, true);
                    board[i] = ''; // backtrack
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }

    const getWinner = (board) => {
        const winCombinations = [
            // horizontal
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            // vertical 
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            // diagonal
            [0, 4, 8],
            [2, 4, 6],
        ];

        // check if x won
        let x_win = winCombinations.some(possibleCombination => possibleCombination.every(index => board[index] === 'X'));
        if (x_win === true) {
            return 'X';
        }

        // check if o won
        let o_win = winCombinations.some(possibleCombination => possibleCombination.every(index => board[index] === 'O'));
        if (o_win === true) {
            return 'O';
        }

        // nobody won and there is still place for further moves
        for (let i = 0;i < 9; i++) {
            if (board[i] === '') {
                return null;
            }
        }

        // match is drawn
        return 'draw';
    } 

    const reset = () => {
        round = 1;
    }
    return { playRound, reset };

})();

const displayController = (() => {
    const fields = document.querySelectorAll(".field");
    const gameWindow = document.getElementById("game-window");
    const resultWindow = document.getElementById("result-window");
    const result = document.getElementById("result");
    const replay = document.getElementById("btn-replay");

    const updateGameboard = () => {
        for (let i = 0; i < fields.length; i++) {
            fields[i].textContent = gameBoard.getField(i);
            if (gameBoard.getField(i) == 'X') {
                fields[i].classList.add("blue");
            } else if (gameBoard.getField(i) == 'O') {
                fields[i].classList.add("red");
            }
        }
    }

    replay.addEventListener("click", () => {
        initiate();
    })

    fields.forEach(field => field.addEventListener("click", (e) => {
        if (e.target.innerHTML != '') {
            return;
        }
        gameController.playRound(parseInt(e.target.id));
        updateGameboard();
    }))

    // display result
    const showResult = (res) => {
        setTimeout(function() {
            gameWindow.style.display = "none";
            resultWindow.style.display = "flex";
            
            if (res === 'draw') {
                result.innerHTML = "It's a draw";
            } else if (res === 'X') {
                result.innerHTML = "You Win!";
            } else {
                result.innerHTML = "You Lose!";
            }
        }, 300);
        
    }

    // reset the game
    const initiate = () => {
        gameWindow.style.display = "flex";
        resultWindow.style.display = "none";
        fields.forEach((field, index) => field.className = `field field${index}`);
        gameBoard.reset();
        gameController.reset();
        updateGameboard();
    }

    return { showResult, initiate };

})();

// start
displayController.initiate();