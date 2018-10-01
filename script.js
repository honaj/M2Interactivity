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

/*   centerDiv = document.createElement("div");
  centerDiv.style.position = "absolute";
  centerDiv.style.top = window.innerHeight / 2;
  centerDiv.style.left = window.innerWidth / 2;
  document.body.appendChild(centerDiv); */
 
  

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

//Set text object
function name(inName) {
  let container = document.createElement("H1");
  let nameText = document.createTextNode(inName);
  container.appendChild(nameText);
  //centerDiv.appendChild(container);
  document.body.appendChild(container);
  let circleName = new CircleType(container);
  let radius = Math.random() * (window.innerWidth / 2);
  container.style.position = "absolute";
  container.style.fontFamily = 'funkisMAUdemo';
  container.style.color = random_rgba();
  container.style.left = window.innerWidth / 2 + "px";
  //container.style.left = centerDiv.style.left + radius;
  //container.style.top = centerDiv.style.top + radius;
  
  container.style.top = window.innerHeight / 4 + "px";
  let baseAngle = Math.random() * 360;
  let angle = 0;
  
  //Animate text
  this.update = function() {
    //Rotate text
    let oldAngle = angle;
    let oldRotation = deviceRotation;
    let rawAngle = lerp(oldAngle, (deviceRotation - baseAngle), 0.05);
    angle = lerp(oldAngle, (deviceRotation), 0.05);
    let pos = {x: (window.innerWidth / 2) + Math.cos(angle) * radius, y: (window.innerHeight / 2) + Math.sin(angle) * radius};
    //container.style.left = pos.x + "px";
    //container.style.top = pos.y + "px";
    //* (Math.PI / 180)
    document.body.style.transform = "rotate("+ angle +"deg)";
    document.body.style.webkitTransform = "rotate("+ angle +"deg)";
    //container.style.transform = "translate("+ window.innerWidth / 2 + "," + window.innerHeight / 2 +");"
    //circleName.style.left = window.innerWidth / 2;
    //circleName.style.top = window.innerHeight / 2;
    //container.style.transformOrigin = " 0 0"
    
    //ircleName.forceHeight(true);
   // nameText.textContent = parseInt(angle);
    //Set font size
    let distanceRemapped = remap(radius, 0, window.innerWidth / 2, 0, 1);
    let targetWeight = lerp(200, 50, distanceRemapped);
    let targetSize = lerp(50, 20, distanceRemapped);circleName.radius(radius);
    //let newSize = lerp(parseFloat(window.getComputedStyle(container).getPropertyValue("font-size")), targetSize, 0.1);
    container.style.fontSize = targetSize + "px";
    circleName.dir(Math.abs(angle));
    //container.style.transform = "rotate("+ angle +"deg)";
    circleName.radius(radiuss);
    
    container.style.fontVariationSettings = '\'wght\' ' + targetWeight + ', \'shrp\' ' + 100;
    //container.style.fontVariationSettings = '\'shrp\' ' + 100;
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
