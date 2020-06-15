let g;
let myFont;
let logo;
const tw = 200;
const th = 500;
let canvases = [];
const slice = 5;
let theta = 0.0;
let amplitude = 20.0;
let yvalues;
const xspacing = 21;
const period = 500.0;
let dx;

/*
 * P5js preload function.
 */
function preload () {
  myFont = loadFont("assets/fonts/fff-forward.regular.ttf");
  img = loadImage('assets/images/logoW.png');
}

/*
 * P5js setup function.
 */
function setup () {
  const canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.position(0, 0);
  canvas.style('z-index', '-1');

  logo = createGraphics(600, 600);
  logo.background(0, 0);
  logo.image(img, 0, 0);

  g = createGraphics(tw, th);
  g.background(0, 0);
  g.textSize(30);
  g.fill(255);
  g.textFont(myFont);
  g.textAlign(CENTER);

  for (let i = 0; i < th; i += 40) {
    g.text("PHAGES", tw / 2, i);
  }
  makePlanes();

  dx = (TWO_PI / period) * xspacing;
}

/*
 * P5js draw function.
 */
function draw () {
  background(20);

  if (mouseY != 0) {
    amplitude = map(mouseY, 0, (height / 3), 400.0, 20.0);
  } if (mouseY <= 0 || amplitude < 0) {
    amplitude = constrain(amplitude, 20.0, 0);
  }
  theta += 0.02;
  let x = theta;
  for (let i = 0; i < yvalues.length; i++) {
    yvalues[i] = sin(x) * amplitude;
    x += dx;
  }

  // Check if amplitude is near 0 to show logo.
  push();
  // If mouseY is 0 then then page has just been entered without interaction.
  if (mouseY == 0) {
    translate(0, 0, -500);
    texture(logo);
    plane(600, 600);
  } else {
    // Normal site interaction.
    if (mouseY > height / 5) {
      let moveZ = map(mouseY, 0, height / 3, -6000.0, 0);
      moveZ = constrain(moveZ, -4000.0, -500.0);
      translate(0, 0, moveZ);
      texture(logo);
      plane(600, 600);
    }
  }
  pop();

  translate(0, -900, -1000);
  noStroke();
  let locY = 0;
  for (let i = 0; i < canvases.length; i++) {
    translate(0, slice + 14, yvalues[i]);
    texture(canvases[i]);
    plane(200, 20);
    locY += i;
  }
  // noLoop();
}

/*
 * Create the individual sections of text.
 */
function makePlanes () {
  canvases = [];
  for (let y = 0; y < th / slice; y++) {
    canvases[y] = createGraphics(200, slice);
    canvases[y].copy(g, 0, y * slice, 200, slice, 0, 0, 200, slice);
  }
  // create an array of y values.
  yvalues = new Array(canvases.length);
}

/*
 * Resize canvas if window is resized.
 */
function windowResized () {
  resizeCanvas(windowWidth, windowHeight);
}
