let riddles = {}
let team = ""
let rindex = ""
let debugMode = false
let deltaAngle = 5;
let deltaSize = 5;

function debugLog(msg) {
    if (debugMode) 
        for (var i=0; i<arguments.length; i++) console.log(arguments[i]);
}

window.addEventListener('load', () => {
    team = getParameterValues('team')
    rindex = getParameterValues('index')
    if (!isValidParams(team,rindex)) {
        window.location = "err.html"
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

    var el = findElement('teamColor');
    el.innerHTML = data.team;
    el.style.color = data.color;

    el = findElement('aboutContainer');
    el.style.backgroundColor = data.bgColor;

    el = findElement('team');
    el.value = team

    el = findElement('rIndex');
    el.value = rindex
    
    el = findElement('theRiddle');
    el.innerHTML = generateRiddleHtml(data)

    el = findElement('riddleIndex');
    el.innerHTML = rindex

}

function checkVector(form) {
    clearMsgs();
    var data = riddles[team];

    // form data
    var vs = form.vectorSize.value
    var va = form.vectorAngle.value

    if (vs === "" || va === "") {
        var el = findElement("errorMsg")
        el.innerHTML = "יש למלא את גודל הוקטור והזווית"
        el = findElement("instructions")
        el.innerHTML = ""
        return false;
    }

    // json data
    const rdl = data.riddles.filter((rdl) => (rdl.index == rindex) )[0]
    var i = 0

    var success = -1;
    if (rdl.vecSize.length == 1) {
        success = checkAnswer(vs, va, rdl.vecSize[0], rdl.vecAngle[0], 1) ? 0 : -1
    }
    else {        
        for (; i < rdl.vecSize.length; i++) {
            if (checkAnswer(vs,va,  rdl.vecSize[i], rdl.vecAngle[i], i+1)) {
                success = i+1
            }
        }
    }
    el = findElement("instructions")
    if (success == -1) {
        el.innerHTML = "זה לא הוקטור הנכון. חשבו שנית..."
    }
    else {
        var num = 0
        el.innerHTML = "<p>מצאתם את הוקטור הנכון!</p>"
        if (success > 0) {
            num = success-1
            el.innerHTML += `<p>שימו לב שזהו הוקטור ה ${success} ברשימה מתוך ${rdl.vecSize.length}</p>`
        }
        el.innerHTML += `<p class='vector' style="color:${data.color}"> (${rdl.vecSize[num]}m, ${rdl.vecAngle[num]}°)</p>`
    }
    return success;
}

function checkAnswer(formSize, formAngle, jsonSize, jsonAngle, index) {
    if(Math.abs(formSize - jsonSize) > deltaSize || Math.abs(formAngle - jsonAngle) > deltaAngle) {
        return false;
    }
    return true
}
  
function clearMsgs() {
    var el = findElement("errorMsg")
    el.innerHTML = ""
    el = findElement("instructions")
    el.innerHTML = ""
}

function generateRiddleHtml(data) {
    const rdl = data.riddles.filter((rdl) => (rdl.index == rindex) )[0]
    console.log(rdl)
    var str = `<p class="fst-italic">
      ${rdl.riddle[0]}
    </p>
    <ul>`;

    var i=1
    for (; i < rdl.riddle.length -1 ; i++) {
            str += `<li><i class="bi bi-check-circle"> ${rdl.riddle[i]}</i></li>`;
    }
      
    str += `</ul>
    <p>
      ${rdl.riddle[i]}
    </p>`

    el = findElement("riddleImg")
    el.src = `assets/img/rdl/${rdl.img}`
    return str;
}