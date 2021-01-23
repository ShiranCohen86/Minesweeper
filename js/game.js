'use strict'
const MINE = '💣';
const FLAG = '🚩';
const SMILE = '😊';
const SAD_SMILE = '🙃'
const HAPPY_SMILE = '😎'

var gFirstClick;
var gBoard;
var gCurrTime;
var gMin;
var gSec;
var gHour;
var gLevels;
var gGame;
var gCountTimeInterval;
var elTimer = document.getElementById('timer');
var elSmile = document.getElementById('smile');
var elFlag = document.getElementById('flags');
var elBoard = document.querySelector('.board');
var elLives = document.getElementById('lives');

function init(size) {
    clearInterval(gCountTimeInterval);
    elSmile.innerHTML = SMILE;
    elTimer.innerHTML = '000'
    gCurrTime = 0;
    gMin = 0
    gSec = 0
    gHour = 0
    gFirstClick = true;
    gGame = { isWin: false, isOn: true, shownCount: 0, markedCount: 0, secsPassed: 0, lives: 3 }

    gLevels = levelGame(size || 4);
    gBoard = buildBoard();
    renderBoard();
}

function buildBoard() {
    var board = [];
    var cell = {};
    for (var i = 0; i < gLevels.SIZE; i++) {
        board.push([]);
        for (var j = 0; j < gLevels.SIZE; j++) {
            cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
                isMineKill: false
            };
            board[i][j] = cell;
        }
    }
    return board;
};

function renderBoard() {

    var strHTML = '';
    var cellContent = '';
    for (var i = 0; i < gLevels.SIZE; i++) {
        strHTML += `<tr>\n`;
        for (var j = 0; j < gLevels.SIZE; j++) {
            var cellClass = getClassName({ i: i, j: j });
            if (gGame.isWin && gBoard[i][j].isMine) {
                cellContent = FLAG;
            } else if (gBoard[i][j].isMine && gBoard[i][j].isShown) {
                if (gBoard[i][j].isMineKill) {
                    cellClass += ' deadMine';
                }
                cellClass += ' shown';
                cellContent = MINE;
            } else if (gBoard[i][j].isMarked) {
                cellContent = FLAG;
            } else if (gBoard[i][j].isShown) {
                cellClass += ' shown'
                cellContent = (gBoard[i][j].minesAroundCount || '');
            }

            strHTML += `\t<td class="cell ${cellClass}" oncontextmenu="toggleCellMark(${i}, ${j})" onclick="cellClicked(${i}, ${j})" >\n`;
            strHTML += cellContent;
            strHTML += `\t</td>\n`;
            cellContent = '';
        }
        strHTML += `</tr>\n`;
    }
    // console.log('strHTML is:');
    // console.log(strHTML);


    elFlag.innerText = gLevels.MINES - gGame.markedCount;

    elBoard.innerHTML = strHTML;


    elLives.innerHTML = `Lives: ${gGame.lives}`;

};

function setMinesNegsCount() {
    for (var i = 0; i < gLevels.SIZE; i++) {
        for (var j = 0; j < gLevels.SIZE; j++) {
            gBoard[i][j].minesAroundCount = getNegCount(i, j);
        }
    }
};

function getNegCount(idxI, idxJ) {
    var countMine = 0;
    for (var i = idxI - 1; i <= idxI + 1; i++) {
        for (var j = idxJ - 1; j <= idxJ + 1; j++) {
            if (i < 0 || i >= gLevels.SIZE || j < 0 || j >= gLevels.SIZE) continue; // skipping when outside the board size
            if (idxI === i && idxJ === j) continue; // skipping the cell checking itself
            if (gBoard[i][j].isMine) countMine++;
        }
    }
    return countMine;
};

function addMines(minesNum, firstClickI, firstClickJ) {
    var i, j;
    var count = 0;
    while (count < minesNum) {
        i = getRandomInt(0, gLevels.SIZE - 1)
        j = getRandomInt(0, gLevels.SIZE - 1)

        if (!gBoard[i][j].isMine && !(firstClickI === i && firstClickJ === j)) {
            gBoard[i][j].isMine = true;
            count++;
        }
    }
};

function cellClicked(idxI, idxJ) {
    if (gFirstClick) {
        setTime();
        gCountTimeInterval = setInterval(setTime, 1000);
        addMines(gLevels.MINES, idxI, idxJ)
        setMinesNegsCount();
        gFirstClick = false;

    }
    if (!gGame.isOn) return;
    if (gBoard[idxI][idxJ].isMarked) return;
    if (gBoard[idxI][idxJ].isShown) return;
    if (gBoard[idxI][idxJ].isMine) {
        gGame.lives--;
        if (gGame.lives === 0) {
            return gameOver(idxI, idxJ);
        }
    }

    gBoard[idxI][idxJ].isShown = true;
    gGame.shownCount++;
    if (!gBoard[idxI][idxJ].isMine && gBoard[idxI][idxJ].minesAroundCount === 0) {
        for (var i = idxI - 1; i <= idxI + 1; i++) {
            for (var j = idxJ - 1; j <= idxJ + 1; j++) {
                if (i < 0 || i >= gBoard.length || j < 0 || j >= gBoard[0].length) continue;
                if (idxI === i && idxJ === j) continue;
                if (gBoard[i][j].isMine || gBoard[i][j].isMarked || gBoard[i][j].isShown) continue;
                gBoard[i][j].isShown = true;
                gGame.shownCount++;
            }
        }
    }
    checkWin();
    renderBoard();
};

function gameOver(idxI, idxJ) {
    clearInterval(gCountTimeInterval);
    if (gBoard[idxI][idxJ].isMine) {
        gBoard[idxI][idxJ].isMineKill = true
    }
    for (var i = 0; i < gLevels.SIZE; i++) {
        for (var j = 0; j < gLevels.SIZE; j++) {
            if (gBoard[i][j].isMine) {
                gBoard[i][j].isShown = true;
            }
        }
    }
    gGame.isOn = false;
    renderBoard();
    elSmile.innerHTML = SAD_SMILE;
};

function toggleCellMark(i, j) {
    if (!gGame.isOn) return;
    if (gBoard[i][j].isShown) return;
    gGame.markedCount += gBoard[i][j].isMarked ? -1 : 1;
    gBoard[i][j].isMarked = !gBoard[i][j].isMarked;
    renderBoard();

};

function checkWin() {
    if (gGame.shownCount === (gLevels.SIZE ** 2 - gLevels.MINES + 3 - gGame.lives)) {
        console.log('Winner');
        clearInterval(gCountTimeInterval);
        elSmile.innerHTML = HAPPY_SMILE;
        gGame.isOn = false;
        gGame.isWin = true;
    }
};

function levelGame(size) {
    if (size === 4) {
        return { SIZE: 4, MINES: 2 };
    } else if (size === 8) {
        return { SIZE: 8, MINES: 12 };
    } else if (size === 12) {
        return { SIZE: 12, MINES: 20 };
    }
};


