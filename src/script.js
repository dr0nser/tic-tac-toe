const gameBoard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];
    const reset = () => {
        for (let i = 0; i < 9; i++) {
            board[i] = "";
        }
    }
    const getField = (index) => {
        return board[index];
    }
    const setField = (index, sign) => {
        board[index] = sign;
    }
    return { setField, getField, reset }; 
})();

const gameController = (() => {
    let currentPlayer = 'X';
    let round = 1;

    const playRound = (index) => {
        gameBoard.setField(index, currentPlayer);
        if (checkWinner(index)) {
            displayController.showResult(currentPlayer);
            return;
        }
        if (round === 9) {
            displayController.showResult("draw");
            return;
        }
        round++;
        currentPlayer = 'O';
        if (round < 9) {
            let emptyFields = '';
            for (let i = 0; i < 9; i++) {
                if (gameBoard.getField(i) == '') {
                    emptyFields += i;
                }
            }
            let randomIndex = parseInt(emptyFields[Math.floor(Math.random() * emptyFields.length)]);
            gameBoard.setField(randomIndex, currentPlayer);
            if (checkWinner(randomIndex)) {
                displayController.showResult(currentPlayer);
                return;
            }
            if (round === 9) {
                displayController.showResult("draw");
                return;
            }
            round++;
            currentPlayer = 'X';
        } else {
            displayController.showResult("draw");
        }
    }
    const checkWinner = (fieldIndex) => {
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
        return winCombinations
        .filter((combination) => combination.includes(fieldIndex))
        .some((possibleCombination) =>
            possibleCombination.every(
            (index) => gameBoard.getField(index) === currentPlayer
            )
        );
    } 
    const reset = () => {
        round = 1;
        currentPlayer = 'X';
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
        }, 200);
        
    }
    const initiate = () => {
        gameWindow.style.display = "flex";
        resultWindow.style.display = "none";
        fields.forEach(field => field.className = "field");
        gameBoard.reset();
        gameController.reset();
        updateGameboard();
    }
    return { showResult, initiate };
})();

// start
displayController.initiate();