let corner_1, corner_2, corner_3, center, edge; // shapes
/** @type {{shape, rotation: number}[][][]} */
let corners;
let COLORS;
let MOVES = { U: 0, R: 0, F: 0 };
let algoritmo = "";
let font;
let isMoving = false;

let options = (shape) => ({
  normalize: false,
  successCallback: handleModel(shape),
  failureCallback: handleError,
  fileType: ".obj",
  flipU: false,
  flipV: false,
});

function preload() {
  corner_1 = loadModel("./models/corner_1.obj", options(corner_1));
  corner_2 = loadModel("./models/corner_2.obj", options(corner_2));
  corner_3 = loadModel("./models/corner_3.obj", options(corner_3));
  center = loadModel("./models/center.obj", options(center));
  edge = loadModel("./models/edge.obj", options(edge));
  font = loadFont("./assets/LEMONMILK-Regular.otf");
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  camera(800, -800, 800);
  textFont(font);
  textAlign(CENTER, CENTER);
  textSize(1);
  // debugMode();

  // corners[x][y][z]: {shape, rotation};
  corners = Array.from({ length: 2 }, () =>
    Array.from({ length: 2 }, () =>
      Array.from({ length: 2 }, () => ({ shape: null, rotation: 0 })),
    ),
  );
	
  corners[1][1][1] = { shape: corner_3, rotation: 0 };
  corners[0][1][1] = { shape: corner_2, rotation: 0 };
  corners[1][1][0] = { shape: corner_2, rotation: 0 };
  corners[0][1][0] = { shape: corner_1, rotation: 0 };
  corners[1][0][1] = { shape: corner_2, rotation: 0 };
  corners[0][0][1] = { shape: corner_1, rotation: 0 };
  corners[1][0][0] = { shape: corner_1, rotation: 0 };

  // corners[1][0][0] = { shape: corner_1, rotation: 2 };

  COLORS = {
    [corner_1.gid]: "#4696E5",
    [corner_2.gid]: "#4696E5",
    [corner_3.gid]: "#4696E5",
  };
  // COLORS = {
  // 	[corner_1.gid]: "#4696E5",
  // 	[corner_2.gid]: "#E5BF50",
  // 	[corner_3.gid]: "#308F53",
  // };
}

function draw() {
  background(220, 220, 255);
  sensibility = 0.5;
  orbitControl(sensibility, sensibility, sensibility);
  noStroke();

  scale(50);
  // lights()
  ambientLight(80, 80, 80);
  directionalLight(208, 208, 210, -30, 20, -15);
  drawCorners();
  drawCube();
  rotateY(QUARTER_PI);
  text(algoritmo, 0, -8);
}

// Set the shape variable and print the geometry's
// ID to the console.
function handleModel(shape) {
  return (data) => {
    shape = data;
    console.log(shape.gid);
  };
}

// Print an error message if the file doesn't load.
function handleError(error) {
  console.error("Oops!", error);
}

function drawModel(shape, { pos, color, rotation, u, f, r }) {
  if (shape === null) return;
  if (pos === undefined) pos = { x: 0, y: 0, z: 0 };
  if (rotation === undefined) rotation = { x: 0, y: 0, z: 0, o: 0 };
  if (color === undefined) color = COLORS[shape.gid];
  push();

  if (u) {
    rotateY(MOVES.U);
  }
  if (f) {
    rotateZ(-MOVES.F);
  }
  if (r) {
    rotateX(-MOVES.R);
  }

  fill(color);
  translate(pos.x, pos.y, pos.z);
  if (pos.x !== 0 && pos.y !== 0 && pos.z !== 0)
    rotate(rotation.o * ((2 * PI) / 3), [pos.x, pos.y, pos.z]);
  rotateX(rotation.x);
  rotateY(rotation.y);
  rotateZ(rotation.z);
  model(shape);
  pop();
}

function drawCube() {
  // first layer
  drawModel(center, {
    pos: { x: 0, y: -2, z: 0 },
    color: "#9D50E6",
    rotation: { x: 0, y: 0, z: 0, o: 0 },
    u: true,
  });
  drawModel(edge, {
    pos: { x: 0, y: -2, z: 2 },
    color: "#E5824E",
    rotation: { x: 0, y: 0, z: 0, o: 0 },
    u: true,
    f: true,
  });
  drawModel(edge, {
    pos: { x: -2, y: -2, z: 0, o: 0 },
    color: "#E5824E",
    rotation: { x: 0, y: -PI / 2, z: 0, o: 0 },
    u: true,
  });
  drawModel(edge, {
    pos: { x: 0, y: -2, z: -2 },
    color: "#E5824E",
    rotation: { x: 0, y: PI, z: 0, o: 0 },
    u: true,
  });
  drawModel(edge, {
    pos: { x: 2, y: -2, z: 0 },
    color: "#E5824E",
    rotation: { x: 0, y: PI / 2, z: 0, o: 0 },
    u: true,
    r: true,
  });
  // Second layer
  drawModel(center, {
    pos: { x: 0, y: 0, z: 2 },
    color: "#9D50E6",
    rotation: { x: -PI / 2, y: 0, z: 0, o: 0 },
    f: true,
  });
  drawModel(center, {
    pos: { x: 2, y: 0, z: 0 },
    color: "#9D50E6",
    rotation: { x: 0, y: 0, z: PI / 2, o: 0 },
    r: true,
  });
  drawModel(edge, {
    pos: { x: -2, y: 0, z: 2 },
    color: "#E5824E",
    rotation: { x: 0, y: 0, z: -PI / 2, o: 0 },
    f: true,
  });
  drawModel(edge, {
    pos: { x: 2, y: 0, z: 2 },
    color: "#E5824E",
    rotation: { x: 0, y: 0, z: PI / 2, o: 0 },
    r: true,
    f: true,
  });
  drawModel(edge, {
    pos: { x: 2, y: 0, z: -2 },
    color: "#E5824E",
    rotation: { x: 0, y: PI / 2, z: PI / 2, o: 0 },
    r: true,
  });

  drawModel(corner_3, {
    // === BANDAGE === //
    pos: { x: 0, y: 0, z: 0 },
    color: "gray",
    rotation: { x: PI, y: -PI / 2, z: 0, o: 0 },
  });
  // Third layer

  drawModel(edge, {
    pos: { x: 0, y: 2, z: 2 },
    color: "#E5824E",
    rotation: { x: -PI / 2, y: 0, z: 0, o: 0 },
    f: true,
  });
  drawModel(edge, {
    pos: { x: 2, y: 2, z: 0 },
    color: "#E5824E",
    rotation: { x: -PI / 2, y: 0, z: PI / 2, o: 0 },
    r: true,
  });
}

function drawCorners() {
  // first layer
  drawModel(corners[0][1][0].shape, {
    pos: { x: -2, y: -2, z: -2 },
    rotation: { x: 0, y: PI, z: 0, o: corners[0][1][0].rotation },
    u: true,
  });
  drawModel(corners[0][1][1].shape, {
    pos: { x: -2, y: -2, z: 2 },
    rotation: { x: 0, y: -PI / 2, z: 0, o: corners[0][1][1].rotation },
    u: true,
    f: true,
  });
  drawModel(corners[1][1][0].shape, {
    pos: { x: 2, y: -2, z: -2 },
    rotation: {
      x: 0,
      y: PI / 2,
      z: 0,
      o: corners[1][1][0].rotation - 1,
    },
    u: true,
    r: true,
  });
  drawModel(corners[1][1][1].shape, {
    pos: { x: 2, y: -2, z: 2 },
    rotation: { x: 0, y: 0, z: 0, o: corners[1][1][1].rotation },
    u: true,
    r: true,
    f: true,
  });
  // Third layer
  drawModel(corners[0][0][1].shape, {
    pos: { x: -2, y: 2, z: 2 },
    rotation: { x: -PI / 2, y: -PI / 2, z: 0, o: corners[0][0][1].rotation },
    f: true,
  });
  drawModel(corners[1][0][0].shape, {
    pos: { x: 2, y: 2, z: -2 },
    rotation: { x: -PI / 2, y: 0, z: PI / 2, o: corners[1][0][0].rotation },
    r: true,
  });
  drawModel(corners[1][0][1].shape, {
    pos: { x: 2, y: 2, z: 2 },
    rotation: { x: -PI / 2, y: 0, z: 0, o: corners[1][0][1].rotation },
    r: true,
    f: true,
  });
}

async function moveU() {
  await animate("U", 1);
  const aux = corners[1][1][1];
  corners[1][1][1] = corners[1][1][0];
  corners[1][1][0] = corners[0][1][0];
  corners[0][1][0] = corners[0][1][1];
  corners[0][1][1] = aux;

  corners[1][1][0].rotation += 1;
  corners[1][1][1].rotation += 2;
  corners[1][1][0].rotation %= 3;
  corners[1][1][1].rotation %= 3;
}

async function moveUR() {
  await animate("U", -1);
  const aux = corners[1][1][1];
  corners[1][1][1] = corners[0][1][1];
  corners[0][1][1] = corners[0][1][0];
  corners[0][1][0] = corners[1][1][0];
  corners[1][1][0] = aux;

  corners[1][1][0].rotation += 1;
  corners[0][1][0].rotation += 2;
  corners[1][1][0].rotation %= 3;
  corners[0][1][0].rotation %= 3;
}

async function moveR() {
  await animate("R", 1);
  const aux = corners[1][1][1];
  corners[1][1][1] = corners[1][0][1];
  corners[1][0][1] = corners[1][0][0];
  corners[1][0][0] = corners[1][1][0];
  corners[1][1][0] = aux;

  corners[1][1][0].rotation += 2;
  corners[1][0][1].rotation += 1;
  corners[1][1][0].rotation %= 3;
  corners[1][0][1].rotation %= 3;
}

async function moveRR() {
  await animate("R", -1);
  const aux = corners[1][1][1];
  corners[1][1][1] = corners[1][1][0];
  corners[1][1][0] = corners[1][0][0];
  corners[1][0][0] = corners[1][0][1];
  corners[1][0][1] = aux;

  corners[1][0][0].rotation += 2;
  corners[1][1][1].rotation += 1;
  corners[1][0][0].rotation %= 3;
  corners[1][1][1].rotation %= 3;
}

async function moveF() {
  await animate("F", 1);
  const aux = corners[1][1][1];
  corners[1][1][1] = corners[0][1][1];
  corners[0][1][1] = corners[0][0][1];
  corners[0][0][1] = corners[1][0][1];
  corners[1][0][1] = aux;

  corners[0][1][1].rotation += 1;
  corners[1][1][1].rotation += 1;
  corners[1][0][1].rotation += 1;
  corners[0][1][1].rotation %= 3;
  corners[1][1][1].rotation %= 3;
  corners[1][0][1].rotation %= 3;
}

async function moveFR() {
  await animate("F", -1);
  const aux = corners[1][1][1];
  corners[1][1][1] = corners[1][0][1];
  corners[1][0][1] = corners[0][0][1];
  corners[0][0][1] = corners[0][1][1];
  corners[0][1][1] = aux;

  corners[1][1][1].rotation += 2;
  corners[0][1][1].rotation += 2;
  corners[0][0][1].rotation += 2;
  corners[1][1][1].rotation %= 3;
  corners[0][1][1].rotation %= 3;
  corners[0][0][1].rotation %= 3;
}

async function keyPressed() {
  checkRight();
  if (isMoving) return;
  if (Math.abs(MOVES.U) + Math.abs(MOVES.R) + Math.abs(MOVES.F) !== 0) return;
  if (key === "u") {
    isMoving = true;
    await moveU();
    if (!check()) {
      await moveUR();
    } else {
      algoritmo = algoritmo.concat(" U").trim();
    }
    isMoving = false;
    siplify();
    return;
  }
  if (key === "U") {
    isMoving = true;
    await moveUR();
    if (!check()) {
      await moveU();
    } else {
      algoritmo = algoritmo.concat(" U'").trim();
    }
    isMoving = false;
    siplify();
    return;
  }
  if (key === "r") {
    isMoving = true;
    await moveR();
    if (!check()) {
      await moveRR();
    } else {
      algoritmo = algoritmo.concat(" R").trim();
    }
    isMoving = false;
    siplify();
    return;
  }
  if (key === "R") {
    isMoving = true;
    await moveRR();
    if (!check()) {
      await moveR();
    } else {
      algoritmo = algoritmo.concat(" R'").trim();
    }
    isMoving = false;
    siplify();
    return;
  }
  if (key === "f") {
    isMoving = true;
    await moveF();
    if (!check()) {
      await moveFR();
    } else {
      algoritmo = algoritmo.concat(" F").trim();
    }
    isMoving = false;
    siplify();
    return;
  }
  if (key === "F") {
    isMoving = true;
    await moveFR();
    if (!check()) {
      await moveF();
    } else {
      algoritmo = algoritmo.concat(" F'").trim();
    }
    isMoving = false;
    siplify();
    return;
  }
}

function animate(Move, dir) {
  return new Promise((resolve) => {
    let timer = setInterval(() => {
      if (MOVES[Move] <= -PI / 2 || MOVES[Move] >= PI / 2) {
        clearInterval(timer);
        resolve();
        MOVES[Move] = 0;
        return;
      }
      MOVES[Move] +=
        dir *
        ((MOVES[Move] * MOVES[Move]) / (2 * PI) +
          (dir * MOVES[Move]) / 4 -
          0.01);
    }, 10);
  });
}

function siplify() {
  const alg = algoritmo.split(" ");
  const regDir = /'/;

  for (let i = 1; i < alg.length; i++) {
    const step = alg[i];
    const prevStep = alg[i - 1];

    const move = (step.match(/[F|R|U]/) ?? [""])[0];

    const prevMove = (prevStep.match(/[F|R|U]/) ?? [""])[0];

    if (move !== prevMove) continue;

    const dir = regDir.test(step) ? -1 : 1;
    const amount = Number((step.match(/[0-9]/) ?? [1])[0]);

    const prevDir = regDir.test(prevStep) ? -1 : 1;
    const prevAmount = Number((prevStep.match(/[0-9]/) ?? [1])[0]);

    let nextAmount = dir * amount + prevDir * prevAmount;
    const nextDir = nextAmount > 0 ? 1 : -1;
    nextAmount = Math.abs(nextAmount);

    alg[i - 1] = undefined;

    if (nextAmount === 0) {
      alg[i] = undefined;
      continue;
    }
    if (nextAmount === 1) {
      alg[i] = `${move}${nextDir > 0 ? "" : "'"}`;
      continue;
    }
    if (nextAmount === 2) {
      alg[i] = `2${move}${nextDir > 0 ? "" : "'"}`;
      continue;
    }
    if (nextAmount === 3) {
      alg[i] = `${move}${nextDir * -1 > 0 ? "" : "'"}`;
      continue;
    }
    if (nextAmount === 4) {
      alg[i] = undefined;
      continue;
    }
  }
  algoritmo = alg
    .filter((a) => a !== undefined)
    .join(" ")
    .trim();
}

function check() {
  return checkTop() && checkRight() && checkFront() && checkLeft() && checkBack() && checkDown();
}

function checkTop() {
  // [front, left, back, right, center]
  const top = [0, 0, 0, 0, 0];

  if (corners[1][1][1].shape === corner_1 && corners[1][1][1].rotation === 0) {
    top[3] += 1;
    top[0] += 1;
    top[4] += 1;
  }
  if (corners[1][1][1].shape === corner_2 && corners[1][1][1].rotation === 0) {
    top[3] += 1;
  }
  if (corners[1][1][1].shape === corner_2 && corners[1][1][1].rotation === 2) {
    top[0] += 1;
  }

  if (corners[0][1][1].shape === corner_1 && corners[0][1][1].rotation === 0) {
    top[0] += 1;
    top[1] += 1;
    top[4] += 1;
  }
  if (corners[0][1][1].shape === corner_2 && corners[0][1][1].rotation === 0) {
    top[0] += 1;
  }
  if (corners[0][1][1].shape === corner_2 && corners[0][1][1].rotation === 2) {
    top[1] += 1;
  }

  if (corners[0][1][0].shape === corner_1 && corners[0][1][0].rotation === 0) {
    top[1] += 1;
    top[2] += 1;
    top[4] += 1;
  }
  if (corners[0][1][0].shape === corner_2 && corners[0][1][0].rotation === 0) {
    top[1] += 1;
  }
  if (corners[0][1][0].shape === corner_2 && corners[0][1][0].rotation === 2) {
    top[2] += 1;
  }

  if (corners[1][1][0].shape === corner_1 && corners[1][1][0].rotation === 1) {
    top[2] += 1;
    top[3] += 1;
    top[4] += 1;
  }
  if (corners[1][1][0].shape === corner_2 && corners[1][1][0].rotation === 1) {
    top[2] += 1;
  }
  if (corners[1][1][0].shape === corner_2 && corners[1][1][0].rotation === 0) {
    top[3] += 1;
  }

  return !top.some((d) => d > 1);
}

function checkRight() {
  // [front, up, back, down, center]
  const right = [0, 0, 0, 0, 0];

  if (corners[1][1][1].shape === corner_1 && corners[1][1][1].rotation === 1) {
    right[0] += 1;
    right[1] += 1;
    right[4] += 1;
  }
  if (corners[1][1][1].shape === corner_2 && corners[1][1][1].rotation === 0) {
    right[1] += 1;
  }
  if (corners[1][1][1].shape === corner_2 && corners[1][1][1].rotation === 1) {
    right[0] += 1;
  }

  if (corners[1][1][0].shape === corner_1 && corners[1][1][0].rotation === 0) {
    right[1] += 1;
    right[2] += 1;
    right[4] += 1;
  }
  if (corners[1][1][0].shape === corner_2 && corners[1][1][0].rotation === 0) {
    right[1] += 1;
  }
  if (corners[1][1][0].shape === corner_2 && corners[1][1][0].rotation === 2) {
    right[2] += 1;
  }

  if (corners[1][0][0].shape === corner_1 && corners[1][0][0].rotation === 0) {
    right[2] += 1;
    right[3] += 1;
    right[4] += 1;
  }
  if (corners[1][0][0].shape === corner_2 && corners[1][0][0].rotation === 0) {
    right[2] += 1;
  }
  if (corners[1][0][0].shape === corner_2 && corners[1][0][0].rotation === 2) {
    right[3] += 1;
  }

  if (corners[1][0][1].shape === corner_1 && corners[1][0][1].rotation === 1) {
    right[3] += 1;
    right[0] += 1;
    right[4] += 1;
  }
  if (corners[1][0][1].shape === corner_2 && corners[1][0][1].rotation === 1) {
    right[3] += 1;
  }
  if (corners[1][0][1].shape === corner_2 && corners[1][0][1].rotation === 0) {
    right[0] += 1;
  }

  return !right.some((d) => d > 1);
}

function checkFront() {
  // [right, down, left, up, center]
  const front = [0, 0, 0, 0, 0];

  if (corners[1][1][1].shape === corner_1 && corners[1][1][1].rotation === 2) {
    front[0] += 1;
    front[3] += 1;
    front[4] += 1;
  }
  if (corners[1][1][1].shape === corner_2 && corners[1][1][1].rotation === 1) {
    front[0] += 1;
  }
  if (corners[1][1][1].shape === corner_2 && corners[1][1][1].rotation === 2) {
    front[3] += 1;
  }

  if (corners[1][0][1].shape === corner_1 && corners[1][0][1].rotation === 0) {
    front[0] += 1;
    front[1] += 1;
    front[4] += 1;
  }
  if (corners[1][0][1].shape === corner_2 && corners[1][0][1].rotation === 0) {
    front[0] += 1;
  }
  if (corners[1][0][1].shape === corner_2 && corners[1][0][1].rotation === 2) {
    front[1] += 1;
  }

  if (corners[0][0][1].shape === corner_1 && corners[0][0][1].rotation === 0) {
    front[1] += 1;
    front[2] += 1;
    front[4] += 1;
  }
  if (corners[0][0][1].shape === corner_2 && corners[0][0][1].rotation === 0) {
    front[1] += 1;
  }
  if (corners[0][0][1].shape === corner_2 && corners[0][0][1].rotation === 2) {
    front[2] += 1;
  }

  if (corners[0][1][1].shape === corner_1 && corners[0][1][1].rotation === 1) {
    front[2] += 1;
    front[3] += 1;
    front[4] += 1;
  }
  if (corners[0][1][1].shape === corner_2 && corners[0][1][1].rotation === 1) {
    front[2] += 1;
  }
  if (corners[0][1][1].shape === corner_2 && corners[0][1][1].rotation === 0) {
    front[3] += 1;
  }

  return !front.some((d) => d > 1);
}

function checkLeft() {
  // [front, up, center]
  const left = [0, 0, 0];

  if (corners[0][1][1].shape === corner_1 && corners[0][1][1].rotation === 2) {
    left[0] += 1;
    left[1] += 1;
    left[2] += 1;
  }
  if (corners[0][1][1].shape === corner_2 && corners[0][1][1].rotation === 2) {
    left[1] += 1;
  }
  if (corners[0][1][1].shape === corner_2 && corners[0][1][1].rotation === 1) {
    left[0] += 1;
  }

  if (corners[0][0][1].shape === corner_1 && corners[0][0][1].rotation === 2) {
    left[0] += 1;
    left[2] += 1;
  }
  if (corners[0][0][1].shape === corner_2 && corners[0][0][1].rotation === 2) {
    left[0] += 1;
  }

  if (corners[0][1][0].shape === corner_1 && corners[0][1][0].rotation === 1) {
    left[1] += 1;
    left[2] += 1;
  }
  if (corners[0][1][0].shape === corner_2 && corners[0][1][0].rotation === 0) {
    left[1] += 1;
  }
  return !left.some((d) => d > 1);
}

function checkBack() {
  // [right, up, center]
  const back = [0, 0, 0];

  if (corners[1][1][0].shape === corner_1 && corners[1][1][0].rotation === 2) {
    back[0] += 1;
    back[1] += 1;
    back[2] += 1;
  }
  if (corners[1][1][0].shape === corner_2 && corners[1][1][0].rotation === 2) {
    back[0] += 1;
  }
  if (corners[1][1][0].shape === corner_2 && corners[1][1][0].rotation === 1) {
    back[1] += 1;
  }

  if (corners[0][1][0].shape === corner_1 && corners[0][1][0].rotation === 2) {
    back[1] += 1;
    back[2] += 1;
  }
  if (corners[0][1][0].shape === corner_2 && corners[0][1][0].rotation === 2) {
    back[1] += 1;
  }

  if (corners[1][0][0].shape === corner_1 && corners[1][0][0].rotation === 1) {
    back[0] += 1;
    back[2] += 1;
  }
  if (corners[1][0][0].shape === corner_2 && corners[1][0][0].rotation === 0) {
    back[0] += 1;
  }
  return !back.some((d) => d > 1);
}

function checkDown() {
  // [front, right, center]
  const down = [0, 0, 0];

  if (corners[1][0][1].shape === corner_1 && corners[1][0][1].rotation === 2) {
    down[0] += 1;
    down[1] += 1;
    down[2] += 1;
  }
  if (corners[1][0][1].shape === corner_2 && corners[1][0][1].rotation === 2) {
    down[0] += 1;
  }
  if (corners[1][0][1].shape === corner_2 && corners[1][0][1].rotation === 1) {
    down[1] += 1;
  }

  if (corners[0][0][1].shape === corner_1 && corners[0][0][1].rotation === 1) {
    down[0] += 1;
    down[2] += 1;
  }
  if (corners[0][0][1].shape === corner_2 && corners[0][0][1].rotation === 0) {
    down[0] += 1;
  }

  if (corners[1][0][0].shape === corner_1 && corners[1][0][0].rotation === 2) {
    down[1] += 1;
    down[2] += 1;
  }
  if (corners[1][0][0].shape === corner_2 && corners[1][0][0].rotation === 2) {
    down[1] += 1;
  }
  return !down.some((d) => d > 1);
}
