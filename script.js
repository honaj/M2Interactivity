var player;
var lastX = 0;
var lastY = 0;
let touching = false;
let names = [];
let pointerX = 0;
let pointerY = 0;
let nameArray = ["MUSEUM", "TRAIN STATION", "BEACH", "MALL", "OLD TOWN"];

function onDocumentReady() {
  document.addEventListener('pointermove', onPointerMove);
  document.addEventListener("pointerdown", onPointerDown);
  document.addEventListener("pointerup", onPointerUp);
  for(let i = 0; i < nameArray.length; i++) {
    names.push(new name(Math.random() * window.innerWidth, Math.random() * window.innerHeight, nameArray[i]));
    
  }
  setInterval(updateText, 16);
}

function lerp(v0, v1, t) {
  return v0*(1-t)+v1*t;
}

function remap(value, low1, high1, low2, high2) {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

//Set text object
function name(x, y, inName) {
  this.x = x;
  this.y = y;
  let startX = x;
  let startY = y;
  let container = document.createElement("H1");
  let nameText = document.createTextNode(inName);
  container.appendChild(nameText);
  document.body.appendChild(container);
  container.style.position = "absolute";
  container.style.left = x + "px";
  container.style.top = y + "px";
  container.style.fontFamily = 'funkisMAUdemo';

  //Animate text
  this.update = function() {
     //x = lerp(x, pointerX, 0.1);
   // y = lerp(y, pointerY, 0.05);
    /* (window.innerWidth / 2)
    (window.innerHeight / 2) */
    //Get distance and convert to 0-1
   /*  let a = x - (window.innerWidth / 2);
    let b = y - (window.innerHeight / 2); */
    let a = x - (window.innerWidth / 2);
    let b = y - (window.innerHeight / 2);
    let distance = Math.sqrt(a*a + b*b);
    let distanceRemapped = remap(distance, 0, 750, 0, 1);
    container.style.left = x + "px";
    container.style.top = y + "px";
    let targetSize = lerp(80, 35, distanceRemapped);
    let newSize = lerp(parseFloat(window.getComputedStyle(container).getPropertyValue("font-size")), targetSize, 0.1);
    container.style.fontSize = newSize + "px";
    container.style.fontVariationSettings = "wght" + targetSize;
  }
}

//Updte text objects
function updateText() {
  names.forEach((name) => {
    name.update();
  });
}

// Function to map a percent 0..1 to a min/max range
function mapRelative(percent, min, max) {
  return percent * (max - min) + min;
}

function onPointerDown(e) {
  touching = true;
}

function onPointerUp(e) {
  touching = false;
}

function onPointerMove(e) {
  // Convert pixel coordinates into amounts relative
  // to window size. Using Math.min to make sure we don't exceed 1.0
  const relativeX = Math.min(1, e.clientX / document.body.clientWidth);
  const relativeY = Math.min(1, e.clientY / document.body.clientHeight);
  pointerY = e.clientY;
  pointerX = e.clientX;
  // Cancel existing animation if it's there
  if (player != null) player.cancel();

  // Map relative values to useful ranges for YTAS + YOPQ
  var newX = parseInt(mapRelative(relativeX, 0, 1000));
  var newY = parseInt(mapRelative(relativeY, 0, 200));

  // Two keyframes: beginning and end
  const keyframes = [
    { fontVariationSettings: '\'wght\' ' + lastX + ', \'wght\' ' + lastY },
    { fontVariationSettings: '\'wght\' ' + newX + ', \'wght\' ' + newY }
  ];

  // Keep track of last values so we can
  // start new animations from old position
  lastX = newX;
  lastY = newY;

  let el = document.getElementById('pangram');
  player = el.animate(keyframes, {
    fill: 'forwards',
    duration: 300,
    easing: 'ease-in'
  });
}

if (document.readyState != 'loading') {
  onDocumentReady();
} else {
  document.addEventListener('DOMContentLoaded', onDocumentReady);
}
