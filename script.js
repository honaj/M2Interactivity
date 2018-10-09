let touching = false;
let names = [];
let pointerX = 0;
let pointerY = 0;
let nameArray = ["MUSEUM", "TRAIN STATION", "BEACH", "MALL", "OLD TOWN", "RIVER", "PARK", "THEATRE", "OPERA", "SHOPPING STREET", "RESTAURANT", "CAFÈ", "ZOO", "HOTEL"];
let compassHeading = {x: 0, y: 0, z: 0};

function onDocumentReady() {
  document.addEventListener('pointermove', onPointerMove);
  document.addEventListener("pointerdown", onPointerDown);
  document.addEventListener("pointerup", onPointerUp);
  window.addEventListener("deviceorientation", handleOrientation);
  document.body.style.backgroundColor = "rgb(252, 234, 209)";
  for(let[index, nameText] of nameArray.entries()) {
    names.push(new name(nameText, 80 + index * 15, index * 150));
  }
  setInterval(updateText, 16);
}

function handleOrientation(e) {
  compassHeading = {x: event.alpha, y: event.beta, z: event.gamma};
}

//Interpolation
function lerp(v0, v1, t) {
  return v0*(1-t)+v1*t;
}

//Remap value to arbitrary range
function remap(value, low1, high1, low2, high2) {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

//Random in range
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

//Random color
function random_rgba() {
  var o = Math.round, r = Math.random, s = 255;
  return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + 1 + ')';
}

//Create text object
function name(inName, inRadius, inAngle) {
  let nameText = document.createTextNode(inName);
  let splitText = [];
  let characters = [];
  let color = random_rgba();
  let radius = inRadius;
  let baseAngle = inAngle;
  let posAngle = 0;
  let rotAngle = 0;
  splitText = nameText.textContent.split("");
  nameText.remove();
  //
  for(char of splitText) {
    let charContainer = document.createElement("H1");
    charContainer.style.color = color;
    charContainer.style.position = "absolute";
    let newChar = document.createTextNode(char);
    charContainer.style.position = "absolute";
    charContainer.style.fontFamily = 'funkisMAUdemo';
    charContainer.appendChild(newChar);
    document.body.appendChild(charContainer);
    characters.push(charContainer);
  }

  //Calculate angle for character rotation
  function angle(cx, cy, ex, ey) {
    var dy = ey - cy;
    var dx = ex - cx;
    var theta = Math.atan2(dy, dx); // range (-PI, PI]
    theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
    return theta;
  }
  function angle360(cx, cy, ex, ey) {
    var theta = angle(cx, cy, ex, ey); // range (-180, 180]
    if (theta < 0) theta = 360 + theta; // range [0, 360)
    return theta;
  }
  
  //Animate text
  this.update = function() {
    let oldPosAngle = posAngle;
    let oldRotation = compassHeading.x;
    posAngle = lerp(oldPosAngle, (compassHeading.x - baseAngle) * (Math.PI / 180), 0.07);
    let distanceRemapped = remap(radius, 0, window.innerWidth / 2, 0, 1);
    let weight = (Math.abs((window.innerWidth / 2) - radius)) / 2;
    let targetWeight = lerp(200, 50, distanceRemapped);
    
    for(let i = characters.length -1; i >= 0; i--){
      let oldRotAngle = rotAngle;
      let newRot = remap(i, 0, characters.length, 0, 360);
      rotAngle = lerp(oldRotAngle, (compassHeading.x - newRot) * (Math.PI / 180), 0.05);
      
      //characters[i].style.textShadow = "10px 10px 5px #BFBFBF"; 
      let textDistance = remap(radius, 0, (window.innerWidth / 2), 30, 20);
      let pos = {x: (window.innerWidth / 2) + Math.cos(posAngle + (i * textDistance / radius)) * radius + (compassHeading.z * distanceRemapped), 
      y: (window.innerHeight / 2) + Math.sin(posAngle + (i * textDistance / radius)) * radius  + (compassHeading.y * distanceRemapped)};
      let textSize = remap(radius, 0, (window.innerWidth / 2), 60, 30);
      //let textSize = Math.abs(0 - posAngle) * 10
      //console.log(textSize)
      characters[i].style.fontSize = textSize + "px";
      characters[i].style.fontVariationSettings = '\'wght\' ' + targetWeight + ', \'shrp\' ' + 100;
      let textAngle = angle360(pos.x, pos.y, window.innerWidth / 2, window.innerHeight / 2) -90; 
      characters[i].style.transform = "rotate(" + textAngle + "deg)";
      characters[i].style.left = pos.x + "px";
      characters[i].style.top = pos.y + "px";
    }
  }
}

//Updte text objects
function updateText() {
  for(name of names) {
    name.update();
  }
}

function onPointerDown(e) {
  touching = true;
}

function onPointerUp(e) {
  touching = false;
}

function onPointerMove(e) {
  pointerY = e.clientY;
  pointerX = e.clientX;
}

if (document.readyState != 'loading') {
  onDocumentReady();
} else {
  document.addEventListener('DOMContentLoaded', onDocumentReady);
}
