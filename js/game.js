const MINE = '💣';
const FLAG = '🚩';
const SMILE = '😊';

var gBoard;
var gCurrTime = 0;
var gMin = 0
var gSec = 0
var gHour = 0
var gFirstClick = true;
var gGame = { isOn: false, shownCount: 0, markedCount: 0, secsPassed: 0, lives: 3 }
var gLevels;

function init(size) {
    gGame.isOn = true;
    gLevels = levelGame(size || 4);
    gBoard = buildBoard();
    renderBoard();
    var elTimer = document.querySelector("#timer")
    elTimer.innerHTML = '000'
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
            if (gBoard[i][j].isMine && gBoard[i][j].isShown) {
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

    var elFlag = document.getElementById('flags');
    elFlag.innerText = gLevels.SIZE ** 2 - gGame.markedCount;
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
    var elSmile = document.getElementById('smile');
    elSmile.innerHTML = SMILE;
    var elLives = document.getElementById('lives');
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
    var elSmile = document.getElementById('smile');
    elSmile.innerHTML = '🙃';
};

function toggleCellMark(i, j) {
    if (!gGame.isOn) return;
    if (gBoard[i][j].isShown) return;
    if (gBoard[i][j].isMarked) {

        gBoard[i][j].isMarked = false;
        gGame.markedCount--;
    } else {

        gBoard[i][j].isMarked = true;
        gGame.markedCount++;
        checkWin();
    }
    renderBoard();

};

function checkWin() {
    if (gGame.markedCount === gLevels.MINES && (gGame.shownCount === gLevels.SIZE ** 2 - gLevels.SIZE)) {
        console.log('Winner');
        clearInterval(gCountTimeInterval);
        var elSmile = document.getElementById('smile');
        elSmile.innerHTML = '😎';
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

function restartGame(elSmile) {
    gBoard = buildBoard();
    renderBoard(gBoard);

};
