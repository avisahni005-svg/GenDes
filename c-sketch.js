// Simple "C" with a centre dot. Press SPACE to replace the segments on the outer C with a new random set.
const BG = "#FFF456";
const INK = "#211F20";
const R = 190;          // radius of the base C
const W = 9;            // stroke weight of the base C
const DOT = 38;         // radius of the centre dot
const GAP = 35;         // half-angle of the opening on the right (degrees)

const C_EDGE = R + W / 2; // outer edge of the base C
const MIN_GAP = 6;        // minimum clear space between non-touching shapes
const TOUCH_CHANCE = 0.4; // share of segments that sit flush against the C

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
  stroke(INK);
  strokeCap(SQUARE); // in p5, SQUARE is the flat cap (no overhang), so extents stay exact
  if (s.kind === "tick") {
    strokeWeight(s.thick);
    line(cos(s.a0) * s.rIn, sin(s.a0) * s.rIn, cos(s.a0) * s.rOut, sin(s.a0) * s.rOut);
  } else {
    noFill();
    strokeWeight(s.rOut - s.rIn);
    const r = (s.rIn + s.rOut) / 2;
    arc(0, 0, r * 2, r * 2, s.a0, s.a1);
  }
}

// Two segments are too close if they overlap once padded by MIN_GAP,
// both radially and along the arc.
function tooClose(a, b) {
  const radial = a.rIn < b.rOut + MIN_GAP && b.rIn < a.rOut + MIN_GAP;
  const rMid = (min(a.rIn, b.rIn) + max(a.rOut, b.rOut)) / 2;
  const pad = degrees(MIN_GAP / rMid);
  const angular = a.a0 < b.a1 + pad && b.a0 < a.a1 + pad;
  return radial && angular;
}

function makeCandidate() {
  const lo = GAP + 2, hi = 360 - GAP - 2;
  const kind = random(["wedge", "line", "tick"]);
  const touching = random() < TOUCH_CHANCE;

  let thick, span;
  if (kind === "wedge") { thick = random(14, 36); span = random(15, 80); }
  else if (kind === "line") { thick = random(3, 9); span = random(10, 90); }
  else { thick = random(4, 10); span = 0; }

  // touching: flush against the C's outer edge; otherwise leave at least MIN_GAP
  const rIn = C_EDGE + (touching ? 0 : random(MIN_GAP, 50));
  const len = kind === "tick" ? random(14, 34) : thick;
  const a0 = random(lo, hi - span);
  return { kind, thick, rIn, rOut: rIn + len, a0, a1: a0 + span };
}

function generateSegments() {
  segments = [];
  const target = int(random(8, 16));
  for (let tries = 0; tries < 300 && segments.length < target; tries++) {
    const c = makeCandidate();
    if (!segments.some((s) => tooClose(c, s))) segments.push(c);
  }
}

function keyPressed() {
  if (key === " ") {
    generateSegments();
    redraw();
    return false; // stop page scrolling
  }
}
