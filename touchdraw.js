const shapes = ['circle', 'square', 'triangle', 'star'];
const colors = ['#ff4d4d', '#4dff88', '#4da6ff', '#ffd24d'];
let mode = 0;
let twoFingers = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(20);
  noStroke();
}

function draw() {
  // two fingers down: advance shape + color once per gesture
  if (touches.length >= 2 && !twoFingers) mode = (mode + 1) % 4;
  twoFingers = touches.length >= 2;

  // one finger: draw
  if (touches.length === 1) {
    fill(colors[mode]);
    drawShape(touches[0].x, touches[0].y, 30);
  }
}

function drawShape(x, y, s) {
  if (mode === 0) circle(x, y, s);
  else if (mode === 1) square(x - s / 2, y - s / 2, s);
  else if (mode === 2) triangle(x, y - s / 2, x - s / 2, y + s / 2, x + s / 2, y + s / 2);
  else {
    beginShape();
    for (let i = 0; i < 10; i++) {
      const r = i % 2 ? s / 4 : s / 2;
      const a = (i * PI) / 5 - HALF_PI;
      vertex(x + cos(a) * r, y + sin(a) * r);
    }
    endShape(CLOSE);
  }
}

// stop the page from scrolling/zooming while drawing
function touchMoved() { return false; }
function windowResized() { resizeCanvas(windowWidth, windowHeight); background(20); }
