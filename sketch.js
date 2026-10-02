let sliderSpacing, sliderSize, sliderColor, sliderChange;

function setup() {
  createCanvas(800, 800);

  sliderSpacing = createSlider(50, 400, 100, 50);
  sliderSpacing.position(10, 810);
  sliderSpacing.size(200);

  sliderSize = createSlider(0, 800);
  sliderSize.position(250, 810);
  sliderSize.size(200);

  sliderColor = createSlider(0, 255);
  sliderColor.position(460, 810);
  sliderColor.size(200);

  sliderChange = createSlider(10, 100);
  sliderChange.position(670, 810);
  sliderChange.size(200);
}

function draw() {
  background(0);

  let g = sliderSpacing.value();
  let f = sliderSize.value();
  let y = sliderChange.value();
  let q = sliderColor.value();

  // Draw rings from largest to smallest so inner rings sit on top.
  for (let i = f; i > 0; i -= y) {
    // Colour depends on the ring size: inner rings are darker, outer brighter.
    let b = map(i, 0, f, 0, 255);
    gridBase(g, i, q, b);
  }
}

function gridBase(space, d, q, b) {
  stroke(0);
  fill(q, 163, b);

  for (let x = space; x < 759; x += space) {
    for (let y = space; y < 759; y += space) {
      circle(x, y, d);
    }
  }
}
