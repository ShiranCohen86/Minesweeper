function getClassName(location) {
    var cellClass = 'cell-' + location.i + '-' + location.j;
    return cellClass;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
};

function setTime() { //fix
    var strHtml = ""
    var elTimer = document.querySelector("#timer")
    gSec++;

    if (gSec % 10 === 0) {
        gSec = 0;
        gMin++
    }
    if (gMin % 10) {
        gMin = 0;
        gHour++;
    }
    strHtml += `${gHour}:${gMin}${gSec}`
    elTimer.innerHTML = strHtml
}
