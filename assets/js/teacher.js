/**
 * teacher.js
 * 
 * This file includes functions that display the teacher's view
 * 
 * Written by: Oded Cnaan
 * Date: March 2024
 */

function generateRiddles() {
    generateTeamRiddle('blue')
    generateTeamRiddle('green')
    generateTeamRiddle('red')
}

function generateTeamRiddle(team) {
    var innerHtml = ""
    var html = `<div class="swiper-slide">
                    <div class="testimonial-item">
                    <p>
                        <i class="bx bxs-quote-alt-left quote-icon-left"></i>
                        {0}
                        <i class="bx bxs-quote-alt-right quote-icon-right"></i>
                    </p>
                    <img src="{1}" class="testimonial-img" alt="">
                    <h3>חידה {2}</h3>
                    <h4>{3}</h4>
                    </div>
                </div>`

    const data = riddles[team];

    for (var i=1 ; i <= 5 ; i++) {
        const rdl = data.riddles.filter((rdl) => (rdl.index == i) )[0]
        var vectors = calcVectors(rdl.vecSize, rdl.vecAngle)
        innerHtml += formatString(html, rdl.riddle, "assets/img/rdl/"+rdl.img, i, vectors)
    }
    el = findElement("swiper-wrapper-"+team)
    el.innerHTML  = innerHtml
}

function calcVectors(vecSize, vecAngle) {
    var result = ""
    for (var i=0; i < vecSize.length ; i++) {
        result += `(${vecSize[i]}, ${vecAngle[i]}°)`
        if (i<vecSize.length-1)
            result += "<br/>"
    }
    return result
}

/**
 * Event handler - page loaded
 */
window.addEventListener('load', () => {
    loadRiddles(generateRiddles); // Load the riddle data from Json file
    loadStrings();

    let el = findElement("imgBig")
    el.addEventListener("click", function(e){        
        findElement("overlay").style.display = "none"
        findElement("overlayContent").style.display = "none"
    }); 
    el = findElement("bluemap")
    el.addEventListener("click", function(e){        
        showZoom(this)
    });    
    el = findElement("greenmap")
    el.addEventListener("click", function(e){        
        showZoom(this)
    });    
    el = findElement("redmap")
    el.addEventListener("click", function(e){        
        showZoom(this)
    });    
});

function showZoom(img) { 
    findElement("imgBig").src = img.src
    findElement("overlay").style.display = "inline"
    findElement("overlayContent").style.display = "inline"
}
