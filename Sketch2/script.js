let getOrientation = {x: 0, y: 0, z: 0};
let oldOrientation = {x: 0, y: 0, z: 0};
let pointerLoc = {x: 0, y: 0};
let oldPointerLoc = {x: 0, y: 0};
let letters = [];

function onDocumentReady() {
    window.addEventListener("deviceorientation", handleOrientation);
    document.addEventListener('pointermove', onPointerMove);
    document.body.style.backgroundColor = "rgba("+0+","+0+","+0+",1)";
    for(let i = 0; i < 5; i ++) {
        letters.push(new letter(i));
    }
    setInterval(drawText, 16);
  }
  
function handleOrientation(event) {
    getOrientation = {x: event.alpha, y: event.beta, z: event.gamma};
  }

function onPointerMove(e) {
    oldPointerLoc = pointerLoc;
    pointerLoc = {x: e.clientX, y: e.clientY};
  }

//Interpolation
function lerp(v0, v1, t) {
    return v0*(1-t)+v1*t;
  }
  
  //Remap value to arbitrary range
  function remap(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
  }

  function letter(i) {
    let distance = remap(i, 0, 5, 0, 1);
    let textContainer = document.createElement("H1");
    document.body.appendChild(textContainer);
    let char = document.createTextNode("METRO");
    textContainer.appendChild(char);
    textContainer.style.position = "absolute";
    textContainer.style.fontFamily = 'fun
    kisMAUdemo';
    let colorFade = lerp(0, 255, distance);
    textContainer.style.color =  "rgba("+colorFade+","+colorFade+","+colorFade+",1)";
    textContainer.style.fontSize = lerp(10, 200, distance) + "px";
    let targetWeight = lerp(200, 50, distance)
    let targetSharpess = lerp(100, 0, distance)
    textContainer.style.fontVariationSettings = '\'wght\' ' + targetWeight + ', \'shrp\' ' + targetSharpess;
    let center = {x: window.innerWidth / 2, y: window.innerHeight};
    this.update = function(lerpedPointer) {
        textContainer.style.fontSize = lerp(10, 200, distance) + "px";
        /* textContainer.style.left = lerp(center.x, lerpedPointer.x, distance) + "px";
        textContainer.style.top = lerp(center.y, lerpedPointer.y, distance) + "px"; */
        textContainer.style.left = center.x + getOrientation.x + "px";
        textContainer.style.top = center.y + getOrientation.y - lerp(10, 900, distance) + "px";
        }
    }



function drawText() {
    let lerpedPointer = {x: lerp(oldPointerLoc.x, pointerLoc.x, 0.01), y: lerp(oldPointerLoc.y, pointerLoc.y , 0.0001)};
    //console.log(Math.abs(lerpedPointer.x - pointerLoc.x));
    for(letter of letters) {
        letter.update(lerpedPointer);
    }
}

if (document.readyState != 'loading') {
    onDocumentReady();
  } else {
    document.addEventListener('DOMContentLoaded', onDocumentReady);
  }