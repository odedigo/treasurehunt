let riddles = {}
let team = ""
let index = ""

window.addEventListener('load', () => {
    team = getParameterValues('team')
    index = getParameterValues('index')
    if (!isValidParams(team,index)) {
        window.location = "err.html"
        return;
    }
    loadRiddles();
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
    fetch("https://odedigo.github.io/treasure/assets/data/vectors.json")
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

    let tc = findElement('teamColor');
    tc.innerHTML = data.team;
    console.log(team, index)
}

