const rotate = 0;
let g;
let myFont;
const tw = 200;
const th = 500;
let canvases = [];
const slice = 5;
let theta = 0.0;
const amplitude = 10.0;
let yvalues;
const xspacing = 21;
const period = 500.0;
let dx;
let canvas;

function preload () {
  myFont = loadFont("assets/fff-forward.regular.ttf");
}

function setup () {
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.position(0, 0);
  canvas.style('z-index', '-1');
  g = createGraphics(tw, th);
  g.background(0, 0);
  g.textSize(30);
  g.fill(255);
  g.textFont(myFont);
  g.textAlign(CENTER);
  const p = 'p';
  for (let i = 0; i < th; i += 40) {
    g.text("PHAGES", tw / 2, i);
  }
  makePlanes();
  dx = (TWO_PI / period) * xspacing;
}

function draw () {
  background(20);
  // rotateZ(-1);
  rotateX(0);
  // rotateY(1);
  translate(-800, -900, -1000);

  noStroke();
  // orbitControl();

  // stroke(255);
  theta += 0.02;
  let x = theta;
  for (let i = 0; i < yvalues.length; i++) {
    yvalues[i] = sin(x) * amplitude;
    x += dx;
  }

  let locY = 0;
  for (let i = 0; i < canvases.length; i++) {
    translate(0, slice + 14, yvalues[i]);
    texture(canvases[i]);
    plane(200, 20);
    locY += i;
  }
}

function makePlanes () {
  canvases = [];
  for (let y = 0; y < th / slice; y++) {
    canvases[y] = createGraphics(200, slice);
    canvases[y].copy(g, 0, y * slice, 200, slice, 0, 0, 200, slice);
  }
  yvalues = new Array(canvases.length);
}

function windowResized () {
  resizeCanvas(windowWidth, windowHeight);
}
