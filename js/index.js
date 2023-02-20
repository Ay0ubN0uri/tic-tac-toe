$(document).ready(function () {
    bt_play.click(function (e) {
        startGame();
    });
    // restart button
    $('#restart_btn').click(function (e) {
        restart();
    });
    // main menu button
    $('#main_menu_btn').click(function (e) {
        main_menu();
    });
    // auto button
    $('#auto_btn').click(function (e) {
        auto_play();
    });
});
const winCombinations = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7],
];
var origBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];
class Player {
    constructor(symbol, name) {
        this.name = name;
        this.symbol = symbol;
        this.list = [];
        this.wins = 0;
    }
    isWinner() {
        if (numPlays < 5)
            return false;

        if (this.getWinCombination().length == 0) {
            return false;
        }

        return true;
    }
    getWinCombination() {
        for (let item of winCombinations) {
            if (item.every(e => currentPlayer.list.includes(e))) {
                return item;
            }
        }
        return [];
    }
    incrementWins() {
        this.wins++;
    }
}
const bt_play = $('#play_btn');
const result = $('.status');
const listCell = $('.gameList');
const modal = $('.modalWrapp');
let music = $(".music");
let numPlays = 0;
let play = false;
let autoplay = false;
music.attr('loop','true');
const selectCharacter = Math.floor(Math.random() * 2);
let player1;
let player2;
if (selectCharacter === 0) {
    player1 = new Player('X', 'player1');
    player2 = new Player('O', 'player2');
}
else {
    player1 = new Player('O', 'player1');
    player2 = new Player('X', 'player2');
}
let currentPlayer = player1;




function startGame() {
    music.trigger('play');
    result.text('Fight');
    play = true;
    modal.addClass('show');
    $('.menu').toggle();
    $('.second__menu').toggle();
    $('.player').removeClass('hide');
    $('.player1__output').text('(0)');
    $('.player2__output').text('(0)');
    // $('.player').children(':first').text('You');
    $('.player:last-child').children(':first').text('Player 2');
    $(".gameItem").each(function (index) {
        $(this).off('click');
        $(this).click(function (e) {
            let item = $(this);
            if (item.text() === '' && numPlays < 9) {
                numPlays++;
                console.log(numPlays);
                console.log('current player : ', currentPlayer);
                origBoard[Number(item.attr('data-ceil')) - 1] = currentPlayer.symbol;
                console.log(origBoard);
                item.text(currentPlayer.symbol);
                item.addClass(currentPlayer.name + 'Step');
                currentPlayer.list.push(Number(item.attr('data-ceil')));
                if (currentPlayer.isWinner()) {
                    // alert(`Winner : ${currentPlayer.name}`);
                    showWinner();
                }
                if (!currentPlayer.isWinner() && numPlays == 9) {
                    draw();
                }
                currentPlayer = currentPlayer === player1 ? player2 : player1;
            }
        });
    });
}
function restart() {
    $('.gameItem').each(function (index) {
        let item = $(this);
        item.text('');
        item.removeClass('win loose player1Step player2Step draw');
    });
    player1.list = []
    player2.list = []
    // player1.wins = 0
    // player2.wins = 0
    numPlays = 0;
    currentPlayer = player1;
    result.text('Fight');
    modal.addClass('show');
    origBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];
}

function main_menu() {
    restart();
    result.text('tic-tac-toe');
    $('.menu').toggle();
    $('.second__menu').toggle();
    $('.player').addClass('hide');
    player1.list = []
    player2.list = []
    player1.wins = 0
    player2.wins = 0
    numPlays = 0;
    currentPlayer = player1;
    modal.removeClass('show');
    play = false;
    autoplay = false;
    player2.name = 'player2';
    music.trigger('pause');
    origBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];
}


function showWinner() {
    currentPlayer.incrementWins();
    $(`.${currentPlayer.name}__output`).text(`(${currentPlayer.wins})`);
    console.log(currentPlayer.getWinCombination());
    for (let item of currentPlayer.getWinCombination()) {
        $(`.gameItem[data-ceil="${item}"]`).addClass('win');
    }
    result.text(`${currentPlayer.name} Win`);
    modal.removeClass('show');
}

function auto_play() {
    music.trigger('play');
    result.text('Fight');
    autoplay = true;
    modal.addClass('show');
    $('.menu').toggle();
    $('.second__menu').toggle();
    $('.player').removeClass('hide');
    $('.player1__output').text('(0)');
    $('.player2__output').text('(0)');
    $('.player:last-child').children(':first').text('Computer');
    $(".gameItem").each(function (index) {
        $(this).off('click');
        $(this).click(function (e) {
            let item = $(this);
            if (item.text() === '' && numPlays < 9) {
                numPlays++;
                console.log(numPlays);
                console.log('current player : ', currentPlayer);
                origBoard[Number(item.attr('data-ceil')) - 1] = currentPlayer.symbol;
                console.log(origBoard);
                item.text(currentPlayer.symbol);
                item.addClass(currentPlayer.name + 'Step');
                currentPlayer.list.push(Number(item.attr('data-ceil')));
                if (currentPlayer.isWinner()) {
                    showWinner();
                }
                if (!currentPlayer.isWinner() && numPlays === 9) {
                    draw();
                }
                if (!currentPlayer.isWinner()) {
                    computerStep();
                }
                currentPlayer = currentPlayer === player1 ? player2 : player1;
            }
        });
    });
}

function draw() {
    result.text('Draw');
    $('.gameItem').each(function (index) {
        let item = $(this);
        item.addClass('draw');
    });
}

function getitemFromEmptyItems(row) {
    let empty = [];
    $('.gameItem').each(function (index) {
        let item = $(this);
        if (item.text() === '' && row.includes(Number(item.attr('data-ceil')))) {
            empty.push(item);
        }
    });
    return empty[Math.floor(Math.random() * empty.length)];
}

function getAllEmtpyItems() {
    let empty = [];
    $('.gameItem').each(function (index) {
        let item = $(this);
        if (item.text() === '') {
            empty.push(item);
        }
    });
    return empty[Math.floor(Math.random() * empty.length)];
}

function computerStep() {
    setTimeout(() => {
        numPlays++;
        let list = [];
        let otherPlayer = currentPlayer === player1 ? player2 : player1;
        console.log(otherPlayer.list);
        let bestItem = minimax(origBoard, player2.symbol);
        let item = $(`.gameItem[data-ceil="${bestItem.index+1}"]`);
        origBoard[Number(item.attr('data-ceil')) - 1] = currentPlayer.symbol;


        item.text(currentPlayer.symbol);
        item.addClass(currentPlayer.name + 'Step');
        currentPlayer.list.push(Number(item.attr('data-ceil')));
        if (currentPlayer.isWinner()) {
            showWinner();
        }
        if (!currentPlayer.isWinner() && numPlays === 9) {
            draw();
        }

        currentPlayer = currentPlayer === player1 ? player2 : player1;
    }, 500);
}


function getAllEmptyCellsIndexes(currBdSt) {
    return currBdSt.filter(i => i != "X" && i != "O");
}

function checkIfWinnerFound(currBdSt, player) {
    if (
        (currBdSt[0] === player.symbol && currBdSt[1] === player.symbol && currBdSt[2] === player.symbol) ||
        (currBdSt[3] === player.symbol && currBdSt[4] === player.symbol && currBdSt[5] === player.symbol) ||
        (currBdSt[6] === player.symbol && currBdSt[7] === player.symbol && currBdSt[8] === player.symbol) ||
        (currBdSt[0] === player.symbol && currBdSt[3] === player.symbol && currBdSt[6] === player.symbol) ||
        (currBdSt[1] === player.symbol && currBdSt[4] === player.symbol && currBdSt[7] === player.symbol) ||
        (currBdSt[2] === player.symbol && currBdSt[5] === player.symbol && currBdSt[8] === player.symbol) ||
        (currBdSt[0] === player.symbol && currBdSt[4] === player.symbol && currBdSt[8] === player.symbol) ||
        (currBdSt[2] === player.symbol && currBdSt[4] === player.symbol && currBdSt[6] === player.symbol)
    ) {
        return true;
    } else {
        return false;
    }
}

function minimax(currBdSt, currMark) {

    const availCellsIndexes = getAllEmptyCellsIndexes(currBdSt);

    if (checkIfWinnerFound(currBdSt, player1)) {
        return { score: -1 };
    } else if (checkIfWinnerFound(currBdSt, player2)) {
        return { score: 1 };
    } else if (availCellsIndexes.length === 0) {
        return { score: 0 };
    }

    const allTestPlayInfos = [];

    for (let i = 0; i < availCellsIndexes.length; i++) {
        const currentTestPlayInfo = {};

        currentTestPlayInfo.index = currBdSt[availCellsIndexes[i]];

        currBdSt[availCellsIndexes[i]] = currMark;

        if (currMark === player2.symbol) {
            const result = minimax(currBdSt, player1.symbol);

            currentTestPlayInfo.score = result.score;
        } else {
            const result = minimax(currBdSt, player2.symbol);

            currentTestPlayInfo.score = result.score;
        }

        currBdSt[availCellsIndexes[i]] = currentTestPlayInfo.index;

        allTestPlayInfos.push(currentTestPlayInfo);
    }

    let bestTestPlay = null;

    if (currMark === player2.symbol) {
        let bestScore = -Infinity;
        for (let i = 0; i < allTestPlayInfos.length; i++) {
            if (allTestPlayInfos[i].score > bestScore) {
                bestScore = allTestPlayInfos[i].score;
                bestTestPlay = i;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < allTestPlayInfos.length; i++) {
            if (allTestPlayInfos[i].score < bestScore) {
                bestScore = allTestPlayInfos[i].score;
                bestTestPlay = i;
            }
        }
    }

    return allTestPlayInfos[bestTestPlay];

}