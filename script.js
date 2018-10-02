let touching = false;
let names = [];
let pointerX = 0;
let pointerY = 0;
let nameArray = ["MUSEUM", "TRAIN STATION", "BEACH", "MALL", "OLD TOWN", "RIVER"];
let compassHeading = 0;

function onDocumentReady() {
  document.addEventListener('pointermove', onPointerMove);
  document.addEventListener("pointerdown", onPointerDown);
  document.addEventListener("pointerup", onPointerUp);
  window.addEventListener("deviceorientation", handleOrientation);
  document.body.style.backgroundColor = "rgb(252, 234, 209)";
  for(nameText of nameArray) {
    names.push(new name(nameText));
  }
  setInterval(updateText, 16);
}

function handleOrientation(e) {
  compassHeading = event.webkitCompassHeading;
}

//Interpolation
function lerp(v0, v1, t) {
  return v0*(1-t)+v1*t;
}

//Remap value to arbitrary range
function remap(value, low1, high1, low2, high2) {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}


function random_rgba() {
  var o = Math.round, r = Math.random, s = 255;
  return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + 1 + ')';
}

//Create text object
function name(inName) {
  let nameText = document.createTextNode(inName);
  let splitText = [];
  let characters = [];
  let color = random_rgba();
  let radius = getRandomArbitrary(50, (window.innerWidth / 2));
  let baseAngle = Math.random() * 360;
  let posAngle = 0;
  let rotAngle = 0;
  splitText = nameText.textContent.split("");
  splitText.reverse();
  nameText.textContent = "";
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
  
  //Animate text
  this.update = function() {
    let textDistance = 25;
    let oldPosAngle = posAngle;
    //let oldRotAngle = rotAngle;
    let oldRotation = compassHeading;
    //rotAngle = lerp(oldRotAngle, (compassHeading - baseAngle), 0.05);
    posAngle = lerp(oldPosAngle, (compassHeading - baseAngle) * (Math.PI / 180), 0.05);
    //let pos = {x: (window.innerWidth / 2) + Math.cos(angle) * radius, y: (window.innerHeight / 2) + Math.sin(angle) * radius};
    let distanceRemapped = remap(radius, 0, window.innerWidth / 2, 0, 1);
    let targetWeight = lerp(200, 50, distanceRemapped);
    //let targetSize = lerp(50, 20, distanceRemapped);
    
    for(let i = characters.length -1; i >= 0; i--){
      let oldRotAngle = rotAngle;
      let newRot = remap(i, 0, characters.length, 0, 360);
      rotAngle = lerp(oldRotAngle, (compassHeading - newRot) * (Math.PI / 180), 0.05);
      let textSize = remap(radius, 0, window.innerWidth / 2, 60, 20);
      characters[i].style.transform = "rotate("+ rotAngle * (Math.PI / i) +"deg)";
      characters[i].style.fontSize = textSize + "px";
      characters[i].style.fontVariationSettings = '\'wght\' ' + targetWeight + ', \'shrp\' ' + 100;
      textDistance = remap(textSize, 60, 20, 25, 30);
      let pos = {x: (window.innerWidth / 2) + Math.cos(posAngle + (i * textDistance)) * radius, 
        y: (window.innerHeight / 2) + Math.sin(posAngle + (i * textDistance)) * radius};
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
