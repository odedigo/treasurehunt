let riddles = {}
let team = ""
let rindex = ""
let debugMode = true

function debugLog(msg) {
    if (debugMode) 
        for (var i=0; i<arguments.length; i++) console.log(arguments[i]);
}

window.addEventListener('load', () => {
    team = getParameterValues('team')
    rindex = getParameterValues('index')
    if (!isValidParams(team,rindex)) {
        //window.location = "err.html"
        return;
    }
    loadRiddles();

    let el = findElement("checkForm")
    el.addEventListener("submit", function(e){
        checkVector(this)
        e.preventDefault();    //stop form from submitting
    });
});

/**
 * gets a param from the URL
 * @param {*} param 
 * @returns 
 */
function getParameterValues(param) {
    var url = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < url.length; i++) {
        var urlparam = url[i].split('=');
        if (urlparam[0] == param) {
            return urlparam[1];
        }
    }
}

/**
 * Checks if the URL params are valid
 * @param {*} team 
 * @param {*} index 
 * @returns 
 */
function isValidParams(team,index) {
    if (team != "blue" && team != "green" && team != "red")
        return false;
    if (index <= 0 || index > 5)
        return false;
    return true
}

/**
 * Loads the riddles' json
 */
function loadRiddles() {
    fetch("https://odedigo.github.io/treasurehunt/assets/data/vectors.json")
    .then((response) => response.json())
    .then((json) => {
        riddles = json
        populateData()
    });    
}

/**
 * Populate page data based on URL params and riddles json
 */
function populateData() {
    let data = riddles[team];

    debugLog(team,rindex)
    debugLog(data)    

    let el = findElement('teamColor');
    el.innerHTML = data.team;
    el.style.color = data.color;

    el = findElement('aboutContainer');
    el.style.backgroundColor = data.bgColor;

    el = findElement('team');
    el.value = team

    el = findElement('rIndex');
    el.value = rindex
}

function checkVector(form) {
    let data = riddles[team];

    /*console.log("index",form.rIndex.value)
    console.log("team",form.team.value)
    console.log("size",form.vectorSize.value)
    console.log("angle",form.vectorAngle.value)*/

    const rdl = data.riddles.filter((rdl) => (rdl.index == rindex) )
    console.log(rdl.vecSize)
    console.log(rdl.vecAngle)
}
  
