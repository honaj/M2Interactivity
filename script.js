let touching = false;
let names = [];
let pointerX = 0;
let pointerY = 0;
let nameArray = ["MUSEUM", "TRAIN STATION", "BEACH", "MALL", "OLD TOWN", "RIVER"];
let deviceRotation = 0;
let centerDiv;

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
  deviceRotation = event.alpha;
}

//Interpolation
function lerp(v0, v1, t) {
  return v0*(1-t)+v1*t;
}

//Remap value to arbitrary range
function remap(value, low1, high1, low2, high2) {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

function random_rgba() {
  var o = Math.round, r = Math.random, s = 255;
  return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + .5 + ')';
}

/* function circleText(txt, radius) {
  txt = txt.split("");
      //classIndex = document.getElementsByClassName("circTxt")[classIndex];
  
    var deg = 180 / txt.length,
      origin = 180;
  
    txt.forEach((ea) => {
      ea = `<p style='height:${radius}px;position:absolute;transform:rotate(${origin}deg);transform-origin:0 100%'>${ea}</p>`;
      nameText.textContent += ea;
      origin += deg;
    });
}
 */
//Set text object
function name(inName) {
  let container = document.createElement("H1");
  let nameText = document.createTextNode(inName);
  let splitText = [];
  let characters = [];
  let color = random_rgba();
  splitText = nameText.textContent.split("");
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
  container.appendChild(nameText);
  document.body.appendChild(container);
  let radius = Math.random() * (window.innerWidth / 2);
  let baseAngle = Math.random() * 360;
  let angle = 0;
  
  //Animate text
  this.update = function() {
    //Rotate text
    let oldAngle = angle;
    let oldRotation = deviceRotation;
    let rawAngle = lerp(oldAngle, (deviceRotation - baseAngle), 0.05);
    angle = lerp(oldAngle, (deviceRotation - baseAngle) * (Math.PI / 180), 0.05);
    let pos = {x: (window.innerWidth / 2) + Math.cos(angle) * radius, y: (window.innerHeight / 2) + Math.sin(angle) * radius};
    let distanceRemapped = remap(radius, 0, window.innerWidth / 2, 0, 1);
      let targetWeight = lerp(200, 50, distanceRemapped);
      let targetSize = lerp(50, 20, distanceRemapped);
    
    for(let i = 0; i < characters.length; i++){
      characters[i].style.left = (window.innerWidth / 2) + Math.cos(angle + (i * 25)) * radius + "px";
      characters[i].style.top = (window.innerHeight / 2) + Math.sin(angle + (i * 25)) * radius + "px";
      //characters[i].style.transform = "rotate("+ rawAngle + (i * 25) +"deg)";
      characters[i].style.fontSize = targetSize + "px";
      characters[i].style.fontVariationSettings = '\'wght\' ' + targetWeight + ', \'shrp\' ' + 100;
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
