const game = (() => {
    const gameBoard = (() => {

        const box = () => {
            let mark = 0;
            const getMark = () => mark;
            const setMark = (value) => { mark = value; };
            return { getMark, setMark };
        };

        const board = [[box(), box(), box()],
                       [box(), box(), box()],
                       [box(), box(), box()]];

        const getBoard = () => board.map(row => row.map(box => box.getMark()));
        const getBoardMark = (row, column) => board[row][column].getMark();
        const markBoard = (row, column, value) => {
            const selectedBox = board[row][column];
            if (!selectedBox.getMark()) {
                selectedBox.setMark(value);
                return true;
            }
            return false
        };
        const resetBoard = () => { board.forEach(row => row.forEach(box => box.setMark(0))); };

        return { getBoard, getBoardMark, markBoard, resetBoard };
    })();

    const players = (() => {
        const data = { 
            player1: { name: 'Player 1', mark: 1, },
            player2: { name: 'Player 2', mark: 2, }
        };
        const getPlayerData = () => data;
        const setPlayerNames = (playerOneName = 'Player 1', playerTwoName = 'Player 2') => {
            data.player1.name = playerOneName;
            data.player2.name = playerTwoName;
        };
        return { getPlayerData, setPlayerNames };
    })();

    const gameController = (() => {
        const playerList = [players.getPlayerData().player1, players.getPlayerData().player2];
        let currentPlayer = playerList[0];

        const getCurrentPlayerName = () => currentPlayer.name;
        const switchPlayer = () => {
            currentPlayer = currentPlayer === playerList[0] ? playerList[1] : playerList[0];
        };

        const weHaveAWinner = () => {
            const board = gameBoard.getBoard();
            const rowA = board[0];
            const rowB = board[1];
            const rowC = board[2];
            const columnA = [board[0][0], board[1][0], board[2][0]];
            const columnB = [board[0][1], board[1][1], board[2][1]];
            const columnC = [board[0][2], board[1][2], board[2][2]];
            const diagonalA = [board[0][0], board[1][1], board[2][2]];
            const diagonalB = [board[0][2], board[1][1], board[2][0]];
            const winConditions = (
                rowA.every(value => value === rowA[0] && value !== 0) ||
                rowB.every(value => value === rowB[0] && value !== 0) ||
                rowC.every(value => value === rowC[0] && value !== 0) ||
    
                columnA.every(value => value === columnA[0] && value !== 0) ||
                columnB.every(value => value === columnB[0] && value !== 0) ||
                columnC.every(value => value === columnC[0] && value !== 0) ||
    
                diagonalA.every(value => value === diagonalA[0] && value !== 0) ||
                diagonalB.every(value => value === diagonalB[0] && value !== 0)
            );
            
            return winConditions;
        };

        const weHaveATie = () => {
            const board = gameBoard.getBoard();
            const tieCondition = board.flat().every(value => value !== 0);
            return tieCondition;
        };
        
        const gameResult = (() => {
            const data = { win: false, tie: false, winner: '' };
            const resetResultData = () => { data.win = data.tie = false; data.winner = '' };
            const isGameOver = () => data.win || data.tie;
            const isWin = () => data.win && !data.tie;
            const isTie = () => !data.win && data.tie;
            const win = () => { data.win = true; data.winner = currentPlayer.name };
            const tie = () => { data.tie = true };
            const getWinner = () => data.winner;
            return { resetResultData, isGameOver, isWin, isTie, win, tie, getWinner };
        })();
        
        const resetGame = () => {
            currentPlayer = playerList[0];
            gameBoard.resetBoard();
            gameResult.resetResultData();
        };
        
        const playTurn = (row, column) => {
            if (gameResult.isGameOver()) {
            return
            }
            if (gameBoard.markBoard(row, column, currentPlayer.mark)) {
                if (weHaveAWinner()) {
                    gameResult.win();
                } else if (weHaveATie()) {
                    gameResult.tie();
                } else {
                    switchPlayer();
                }
            };
        };

        return { getCurrentPlayerName, resetGame, playTurn, gameResult };
    })();

    return {
        playTurn: gameController.playTurn,
        getCurrentPlayerName: gameController.getCurrentPlayerName,
        getBoardMark: gameBoard.getBoardMark,
        resetGame: gameController.resetGame,
        setPlayerNames: players.setPlayerNames,
        isGameOver: gameController.gameResult.isGameOver,
        isWin: gameController.gameResult.isWin,
        getWinner: gameController.gameResult.getWinner
    }
})();

const display = (() => {
    
    const getDisplayBoxes = () => document.querySelectorAll('.box');

    const renderBoard = () => {
        const displayBoxes = getDisplayBoxes();
        displayBoxes.forEach(displayBox => {
            const displayBoxRow = Number(displayBox.dataset.row);
            const displayBoxColumn = Number(displayBox.dataset.column);
            const mark = game.getBoardMark(displayBoxRow, displayBoxColumn);
            displayBox.style.backgroundImage = mark === 1 ? 'url(./assets/images/cross.svg)' :
                                               mark  === 2 ? 'url(./assets/images/circle.svg)' :
                                               'none';
        });

        const resultParagraph = document.querySelector('.gameResult');
        resultParagraph.textContent = !(game.isGameOver()) ? `${game.getCurrentPlayerName()}'s turn.` :
                                      game.isWin() ? `${game.getWinner()} wins!`:
                                      'It\'s a tie!';
    };
    renderBoard();

    const boardClickHandler = (element) => {
        const row = Number(element.dataset.row);
        const column = Number(element.dataset.column);
        game.playTurn(row, column);
    };

    const newGameButtonClickHandler = () => {
        game.resetGame();
    };

    const clickHandler = (e) => {
        const element = e.target;
        if (element.classList.contains('box')) {
            boardClickHandler(element);
        }
        if (element.classList.contains('newGame')) {
            newGameButtonClickHandler();
        }
        renderBoard();
    }
    
        const form = document.querySelector('.namesForm');
        const playerOneInput = document.getElementById('playerOneInput');
        const playerTwoInput = document.getElementById('playerTwoInput');
        
    const submitHandler = () => {
        const playerOneName = playerOneInput.value;
        const playerTwoName = playerTwoInput.value;
        game.setPlayerNames(playerOneName, playerTwoName);
        form.reset();
        renderBoard();
    };

    document.addEventListener('click', clickHandler);
    form.addEventListener('submit', submitHandler);
})();
