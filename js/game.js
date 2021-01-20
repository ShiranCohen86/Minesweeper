const MINE = '💣';
const FLAG = '🚩';

var gBoard;
var gSizeBoard = 4;
var gMinesNum = 2;
var gCurrTime = 0;
var gMin = 0
var gSec = 0
var gHour = 0
var gFirstClick = true;

function init() {
    gBoard = buildBoard();
    addMines(gMinesNum)
    setMinesNegsCount();
    renderBoard(gBoard);
}

function buildBoard() {
    var board = [];
    var cell = {};
    for (var i = 0; i < gSizeBoard; i++) {
        board.push([]);
        for (var j = 0; j < gSizeBoard; j++) {
            cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            };

            board[i][j] = cell;
        }
    }

    return board;
};

function renderBoard() {
    var strHTML = '';
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += `<tr>\n`;
        for (var j = 0; j < gBoard[0].length; j++) {
            var cellClass = getClassName({ i: i, j: j })

            strHTML += `\t<td class="cell ${cellClass}" oncontextmenu="cellMarked(this, ${i}, ${j})" onclick="cellClicked(this, ${i}, ${j}), event" >\n`;
            if (gBoard[i][j].isShown) {
                strHTML += (gBoard[i][j].isMine) ? MINE : gBoard[i][j].minesAroundCount;
            }


            strHTML += `\t</td>\n`;
        }
        strHTML += `</tr>\n`;
    }


    // console.log('strHTML is:');
    // console.log(strHTML);
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
};

function setMinesNegsCount() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isMine) {

            }
            gBoard[i][j].minesAroundCount = getNegCount(i, j);
        }
    }
};

function getNegCount(idxI, idxJ) {
    var countMine = 0;
    for (var i = idxI - 1; i <= idxI + 1; i++) {
        for (var j = idxJ - 1; j <= idxJ + 1; j++) {
            if (i < 0 || i >= gBoard.length || j < 0 || j >= gBoard.length) continue; // skipping when outside the board size
            if (idxI === i && idxJ === j) continue; // skipping the cell checking itself
            if (gBoard[i][j].isMine) countMine++;
        }
    }
    return countMine;
};

function addMines(minesNum) { //fix while loop 
    var i, j;
    var count = 0;
    while (count < minesNum) {
        i = getRandomInt(0, gBoard.length - 1)
        j = getRandomInt(0, gBoard[0].length - 1)
        if (!gBoard[i][j].isMine) {
            gBoard[i][j].isMine = true;
            count++;
        }
    }
}

function cellClicked(elCell, idxI, idxJ, ev) {
    if (gFirstClick) {
        gCountTimeInterval = setInterval(setTime, 1000);
        gFirstClick = false;
    }
    if (gBoard[idxI][idxJ].isShown) return;
    if (!gBoard[idxI][idxJ].isMine) {
        gBoard[idxI][idxJ].isShown = true;
        for (var i = idxI - 1; i <= idxI + 1; i++) {
            for (var j = idxJ - 1; j <= idxJ + 1; j++) {
                if (i < 0 || i >= gBoard.length || j < 0 || j >= gBoard[0].length) continue;
                if (idxI === i && idxJ === j) continue;
                if (!gBoard[i][j].isMine) {
                    gBoard[i][j].isShown = true;

                }
            }
        }
        renderBoard()
    } else {
        checkGameOver(); // fix
    }
}

function renderCell(elCell, i, j) {

    elCell.innerText = gBoard[i][j].minesAroundCount;
}

function checkGameOver() {
    console.log('game over');
}
function cellMarked(elFlag, i, j) {
    if (gBoard[i][j].isMarked) {
        elFlag.innerHTML = '';
        gBoard[i][j].isMarked = false;
    } else {
        elFlag.innerHTML = FLAG;
        gBoard[i][j].isMarked = true;
    }
    if (gBoard[i][j].isShown) return;

}



