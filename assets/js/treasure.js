/**
 * treasure.js
 * 
 * This file includes functions that handle the game's logic
 * 
 * Written by: Oded Cnaan
 * Date: March 2024
 */

// Globals
let riddles = {}
let strings = {}
let team = ""
let rindex = ""
let debugMode = false
let deltaAngle = 5;
let deltaSize = 5;

/**
 * Prints data only if in debug mode
 * @param {*} msg 
 */
function debugLog(msg) {
    if (debugMode) 
        for (var i=0; i<arguments.length; i++) console.log(arguments[i]);
}

/**
 * Event handler - page loaded
 */
window.addEventListener('load', () => {
    // Validate URL params.
    // 2 params are required: team (red/green/blue) and index (1 to 5)
    team = getParameterValues('team')
    rindex = getParameterValues('index')
    if (!isValidParams(team,rindex)) {
        window.location = "err.html" // redirect to an error page
        return;
    }
    loadRiddles(); // Load the riddle data from Json file
    loadStrings();

    // Register for form submission events (checking vector correctness)
    let el = findElement("checkForm")
    el.addEventListener("submit", function(e){
        checkVector(this)
        e.preventDefault();    //stop form from submitting
    });    
});

/**
 * gets a param from the URL
 * @param {*} param 
 * @returns string
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
 * @returns boolean
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
    })
    .catch(function() {
        console.log("TREASURE: Could not load data JSON")
    }); 
}

/**
 * Loads the riddles' json
 */
function loadStrings() {
    fetch("https://odedigo.github.io/treasurehunt/assets/lang/he.json")
    .then((response) => response.json())
    .then((json) => {
        strings = json
    })
    .catch(function() {
        console.log("TREASURE: Could not load strings")
    }); 
}

/**
 * Populate page data based on URL params and riddles json
 */
function populateData() {
    let data = riddles[team]; // this team's data

    debugLog(team,rindex)
    debugLog(data)    

    updateTeamStatus(team,rindex)

    // Colors
    var el = findElement('teamColor');
    el.innerHTML = data.team;
    el.style.color = data.color;

    el = findElement('aboutContainer');
    el.style.backgroundColor = data.bgColor;

    // Form hidden fields
    el = findElement('team');
    el.value = team

    el = findElement('rIndex');
    el.value = rindex
    
    // Riddle related texts
    el = findElement('theRiddle');
    el.innerHTML = generateRiddleHtml(data)

    el = findElement('riddleIndex');
    el.innerHTML = rindex
}

/**
 * Validates if the queried vector (size and angle) are correct
 * @param {*} form 
 * @returns boolean
 */
function checkVector(form) {
    clearMsgs();
    var data = riddles[team];

    // form data
    var vs = form.vectorSize.value
    var va = form.vectorAngle.value

    // Form fields cannot be empty
    if (vs === "" || va === "") {
        var el = findElement("errorMsg")
        el.innerHTML = strings.js.formEmpty
        el = findElement("instructions")
        el.innerHTML = ""
        return false;
    }

    // filter the riddle in the given index
    const rdl = data.riddles.filter((rdl) => (rdl.index == rindex) )[0]
    var i = 0

    var success = -1; // may be -1 (error), 0 (success of a single vector) or 1-5 (success of multiple vectors)
    if (rdl.vecSize.length == 1) {
        // single vector 
        success = checkAnswer(vs, va, rdl.vecSize[0], rdl.vecAngle[0], 1) ? 0 : -1
    }
    else {        
        // multiple vectors in this riddle
        for (; i < rdl.vecSize.length; i++) {
            if (checkAnswer(vs,va,  rdl.vecSize[i], rdl.vecAngle[i], i+1)) {
                success = i+1 // mark the index of this vector in the array
            }
        }
    }

    // Add message on the page
    el = findElement("instructions")
    if (success == -1) {
        el.innerHTML = strings.js.badVector
    }
    else {
        var num = 0
        el.innerHTML = strings.js.goodVector
        if (success > 0) {
            num = success-1
            el.innerHTML += strings.js.vectorInfo 
        }
        el.innerHTML += strings.js.riddleLine 
    }
    return success;
}

/**
 * Checks if the angle and size in the form match those in the json for this riddle
 * @param {*} formSize 
 * @param {*} formAngle 
 * @param {*} jsonSize 
 * @param {*} jsonAngle 
 * @param {*} index 
 * @returns boolean
 */
function checkAnswer(formSize, formAngle, jsonSize, jsonAngle, index) {
    if(Math.abs(formSize - jsonSize) > deltaSize || Math.abs(formAngle - jsonAngle) > deltaAngle) {
        return false;
    }
    return true
}
  
/**
 * Clears the message from page labels
 */
function clearMsgs() {
    var el = findElement("errorMsg")
    el.innerHTML = ""
    el = findElement("instructions")
    el.innerHTML = ""
}

/**
 * Generates the HTML of the riddle itself
 * @param {*} data 
 * @returns string
 */
function generateRiddleHtml(data) {
    const rdl = data.riddles.filter((rdl) => (rdl.index == rindex) )[0]
    var str = `<p class="fst-italic">
      ${rdl.riddle[0]}
    </p>
    <ul>`;

    var i=1
    for (; i < rdl.riddle.length -1 ; i++) {
            str += `<li><i class="bi bi-check-circle"> ${rdl.riddle[i]}</i></li>`;
    }
      
    str += `</ul>
    <p class="final-inst">
      ${rdl.riddle[i]}
    </p>`

    el = findElement("riddleImg")
    el.src = `assets/img/rdl/${rdl.img}`
    return str;
}

async function updateTeamStatus(tm,ind) {
    let _id = "65f7db30ce61ed8986782f66"
    if (tm == 'red') {
        _id = "65f7dadfce61ed8986782f64"
    }    
    else if (tm == 'green') {
        _id = "65f7db26ce61ed8986782f65"
    }
    console.log("updating status "+team+" "+rindex)
    const response = await fetch('https://eu-central-1.aws.data.mongodb-api.com/app/data-ffvzc/endpoint/data/v1/action/updateOne', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Request-Headers': '*',
        'api-key': 'NmEFsBslI3f1pOIE7dcEX62esJwx2j9ME61TL2Z2KNAX8fDoEdLdWWIiqtJJfOg8',
        },
        body: {            
            "collection":"gameStatus",
            "database":"treasurehunt",
            "dataSource":"ClusterMashar",
            "filter": {
                "_id": { "$oid": _id }
            },
            "update": {
                "$set": {
                    "riddle": ind
                }
            }            
        }
    });
    const myJson = await response.json(); //extract JSON from the http response
    // do something with myJson
    console.log(myJson)
}