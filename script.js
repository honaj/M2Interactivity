var player;
var lastX = 0;
var lastY = 0;
let touching = false;

let names = [];
let pointerX = 0;
let pointerY = 0;
let nameArray = ["MUSEUM", "TRAIN STATION", "BEACH", "MALL", "OLD TOWN", "RIVER"];
let deviceRotation = 0;

function onDocumentReady() {
  document.addEventListener('pointermove', onPointerMove);
  document.addEventListener("pointerdown", onPointerDown);
  document.addEventListener("pointerup", onPointerUp);
  window.addEventListener("deviceorientation", handleOrientation);
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

//Set text object
function name(inName) {
  let container = document.createElement("H1");
  let nameText = document.createTextNode(inName);
  container.appendChild(nameText);
  document.body.appendChild(container);
  container.style.position = "absolute";
  container.style.fontFamily = 'funkisMAUdemo';

  let radius = Math.random() * (window.innerHeight / 2);
  let baseAngle = Math.random() * 360;
  let angle = 0;
  let pos = {x: 0, y: 0};

  //Animate text
  this.update = function() {
    //Rotate text
    let pointerXMapped = remap(pointerX, 0, window.innerWidth, 0, 150);
    let pointerYMapped = remap(pointerY, 0, window.innerHeight, 0, 150);
    let oldAngle = angle;
    angle = lerp(oldAngle, baseAngle + deviceRotation - radius / 360, 0.05);
    pos = {x: (window.innerWidth / 2) + Math.cos(angle) * radius, y: (window.innerWidth / 2) + Math.sin(angle) * radius};
    container.style.left = pos.x + "px";
    container.style.top = pos.y + "px";
    //Set font size
    let distanceRemapped = remap(radius, 0, window.innerHeight / 2, 0, 1);
    let targetSize = lerp(100, 20, distanceRemapped);
    let newSize = lerp(parseFloat(window.getComputedStyle(container).getPropertyValue("font-size")), targetSize, 0.1);
    container.style.fontSize = newSize + "px";
    container.style.fontVariationSettings = "shrp" + targetSize;
  }
}

//Updte text objects
function updateText() {
  for(name of names) {
    name.update();
  }
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
