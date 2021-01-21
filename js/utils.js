function getClassName(location) {
    var cellClass = 'cell-' + location.i + '-' + location.j;
    return cellClass;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
};

function setTime() { 
    var strHtml = ""
    gSec++;
    if (gSec < 10) {
        strHtml += `00${gSec}`
    } else if (gSec < 100) {
        strHtml += `0${gSec}`;
    } else if (gSec < 1000) {
        strHtml += gSec;
    } else {
        clearInterval(gCountTimeInterval);
    }
    var elTimer = document.querySelector("#timer")
    elTimer.innerHTML = strHtml
}
