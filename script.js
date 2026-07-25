function game(playerOneName = 'Player 1', playerTwoName = 'Player 2') {
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
        const boardCopy = board.slice(0, -1);

        const getBoard = () => board;
        const getBoardWithValues = () => board.map(row => row.map(box => box.getMark()));
        const markBoard = (row, column, value) => {
            const selectedBox = board[row][column];
            if (!selectedBox.getMark()) {
                selectedBox.setMark(value);
                return true;
            }
        };
        const resetBoard = () => { gameBoard.getBoard().forEach(row => row.forEach(box => box.setMark(0))); };

        return { getBoard, getBoardWithValues, markBoard, resetBoard };
    })();

    const players = (() => {
        const data = { 
            player1: { name: playerOneName, mark: 1, },
            player2: { name: playerTwoName, mark: 2, }
        };
        const getPlayerData = () => data;
        const resetPlayerNames = (playerOneName = 'Player 1', playerTwoName = 'Player 2') => {
            data.player1.name = playerOneName;
            data.player2.name = playerTwoName;
        };
        return { getPlayerData, resetPlayerNames };
    })();

    const gameController = (() => {
        const playerList = [players.getPlayerData().player1, players.getPlayerData().player2];
        let currentPlayer = playerList[0];

        const getCurrentPlayer = () => currentPlayer;
        const switchPlayer = () => {
            currentPlayer = currentPlayer === playerList[0] ? playerList[1] : playerList[0];
        };

        const weHaveAWinner = () => {
            const board = gameBoard.getBoardWithValues();
            const rowA = board[0];
            const rowB = board[1];
            const rowC = board[2];
            const columnA = [board[0][0], board[1][0], board[2][0]];
            const columnB = [board[0][1], board[1][1], board[2][1]];
            const columnC = [board[0][2], board[1][2], board[2][2]];
            const diagonalA = [board[0][0], board[1][1], board[2][2]];
            const diagonalB = [board[0][2], board[1][1], board[2][0]];
            const winConditions = (
                rowA.every(value => value === rowA[0] & value !== 0) |
                rowB.every(value => value === rowB[0] & value !== 0) |
                rowC.every(value => value === rowC[0] & value !== 0) |
    
                columnA.every(value => value === rowA[0] & value !== 0) |
                columnB.every(value => value === rowA[1] & value !== 0) |
                columnC.every(value => value === rowA[2] & value !== 0) |
    
                diagonalA.every(value => value === rowA[0] & value !== 0) |
                diagonalB.every(value => value === rowC[0] & value !== 0)
            );

            return winConditions;
        };

        const weHaveATie = () => {
            const board = gameBoard.getBoardWithValues();
            return board.flat().every(value => value !== 0);
        };

        const resetGame = () => {
            currentPlayer = playerList[0];
            gameBoard.resetBoard();
        };

        const playTurn = (row, column) => {
            if (gameBoard.markBoard(row, column, currentPlayer.mark)) {
                if (weHaveAWinner()) {
                    const winner = currentPlayer.name;
                    console.log(`${winner} wins!`); // for console version
                    resetGame();
                } else if (weHaveATie()) {
                    console.log('It\'s a Tie!'); // for console version
                    resetGame();
                } else {
                    switchPlayer();
                }
            } else { // for console version
                console.log('That box is already marked!');
            };
        };

        return { getCurrentPlayer, resetGame, playTurn };
    })();

    return {
        playTurn: gameController.playTurn,
        getCurrentPlayer: gameController.getCurrentPlayer,
        getBoardWithValues: gameBoard.getBoardWithValues,
        resetGame: gameController.resetGame,
        resetPlayerNames: players.resetPlayerNames
    }
};
