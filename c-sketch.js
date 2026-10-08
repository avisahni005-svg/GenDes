// Simple "C" with a centre dot. Press SPACE to add random segments to the outer C.
const BG = "#FFF456";
const INK = "#211F20";
const R = 190;          // radius of the base C
const W = 9;            // stroke weight of the base C
const DOT = 38;         // radius of the centre dot
const GAP = 35;         // half-angle of the opening on the right (degrees)

let segments = [];

function setup() {
  createCanvas(800, 800);
  angleMode(DEGREES);
  noLoop();
}

function draw() {
  background(BG);
  translate(width / 2, height / 2);

  // base C
  noFill();
  stroke(INK);
  strokeWeight(W);
  strokeCap(SQUARE);
  arc(0, 0, R * 2, R * 2, GAP, 360 - GAP);

  // centre dot
  noStroke();
  fill(INK);
  circle(0, 0, DOT * 2);

  for (const s of segments) drawSegment(s);
}

function drawSegment(s) {
  if (s.kind === "wedge") {
    // thick filled ring sector
    noFill();
    stroke(INK);
    strokeWeight(s.thick);
    strokeCap(SQUARE);
    arc(0, 0, s.r * 2, s.r * 2, s.a, s.a + s.span);
  } else if (s.kind === "line") {
    // thin concentric arc
    noFill();
    stroke(INK);
    strokeWeight(s.thick);
    strokeCap(SQUARE);
    arc(0, 0, s.r * 2, s.r * 2, s.a, s.a + s.span);
  } else if (s.kind === "tick") {
    // short radial block
    stroke(INK);
    strokeWeight(s.thick);
    strokeCap(SQUARE);
    const x1 = cos(s.a) * s.r, y1 = sin(s.a) * s.r;
    const x2 = cos(s.a) * (s.r + s.len), y2 = sin(s.a) * (s.r + s.len);
    line(x1, y1, x2, y2);
  }
}

function generateSegments() {
  segments = [];
  const lo = GAP + 2, hi = 360 - GAP - 2;

  // a few thick wedges hugging the outside of the C
  for (let i = 0; i < int(random(2, 5)); i++) {
    const thick = random(14, 36);
    const span = random(15, 80);
    const a = random(lo, hi - span);
    segments.push({ kind: "wedge", r: R + W / 2 + thick / 2 + random(0, 6), thick, a, span });
  }

  // thin concentric arcs at various distances
  for (let i = 0; i < int(random(3, 7)); i++) {
    const span = random(10, 90);
    const a = random(lo, hi - span);
    segments.push({ kind: "line", r: R + random(14, 48), thick: random(3, 9), a, span });
  }

  // small radial ticks
  for (let i = 0; i < int(random(3, 8)); i++) {
    segments.push({
      kind: "tick",
      r: R + random(8, 30),
      len: random(14, 34),
      thick: random(4, 10),
      a: random(lo, hi),
    });
  }
}

function keyPressed() {
  if (key === " ") {
    generateSegments();
    redraw();
    return false; // stop page scrolling
  }
}
