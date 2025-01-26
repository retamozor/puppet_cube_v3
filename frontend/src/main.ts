import "./style.css";
import P5 from "p5";

import Algorithm from "./classes/Algorithm";
import Animation from "./classes/Animation";
import PuppetCube from "./classes/PuppetCube";

const p5 = new P5(() => {});

let cube: PuppetCube | null = null;
let font: P5.Font | null = null;
let alg: Algorithm | null = null;
let isMoving = false;

const move = async (face: "U" | "R" | "F", inv: boolean) => {
  try {
    const algorithm = new Algorithm(`${face}${inv ? "'" : ""}`);
    if (checkIsMoving()) return;
    isMoving = true;
    await cube?.do(algorithm);
    alg?.do(face, inv);
    isMoving = false;
    return;
  } catch (error) {
    isMoving = false;
  }
};

p5.preload = () => {
  PuppetCube.preload(p5);
  font = p5.loadFont("./assets/LEMONMILK-Regular.otf");
};

p5.setup = () => {
  p5.createCanvas(p5.windowWidth, p5.windowHeight, p5.WEBGL);
  p5.camera(800, -800, 800);
  font && p5.textFont(font);
  p5.textAlign(p5.CENTER, p5.CENTER);
  p5.textSize(1);
  alg = new Algorithm("");
  cube = new PuppetCube(p5, alg);
  Animation.PI = p5.PI;

  const buttonU = document.getElementById("U");
  if (buttonU) buttonU.onclick = move.bind(null, "U", false);
  const buttonUR = document.getElementById("U'");
  if (buttonUR) buttonUR.onclick = move.bind(null, "U", true);
  const buttonR = document.getElementById("R");
  if (buttonR) buttonR.onclick = move.bind(null, "R", false);
  const buttonRR = document.getElementById("R'");
  if (buttonRR) buttonRR.onclick = move.bind(null, "R", true);
  const buttonF = document.getElementById("F");
  if (buttonF) buttonF.onclick = move.bind(null, "F", false);
  const buttonFR = document.getElementById("F'");
  if (buttonFR) buttonFR.onclick = move.bind(null, "F", true);
};

p5.draw = () => {
  p5.background(220, 220, 255);
  const sensibility = 0.5;
  p5.orbitControl(sensibility, sensibility, sensibility);
  p5.noStroke();

  p5.scale(50);
  p5.ambientLight(80, 80, 80);
  p5.directionalLight(208, 208, 210, -30, 20, -15);
  cube?.draw();
  p5.rotateY(p5.QUARTER_PI);
  p5.text(alg?.toString() ?? "", 0, -8);
};

const checkIsMoving = () => {
  if (!isMoving) {
    return (
      Math.abs(Animation.MOVES.U) +
        Math.abs(Animation.MOVES.R) +
        Math.abs(Animation.MOVES.F) !==
      0
    );
  }
  return true;
};

p5.keyPressed = async (e: KeyboardEvent) => {
  const inv = e.shiftKey;
  const upperKey = e.key.toUpperCase();
  if (upperKey.match(/^[U|R|F]$/) !== null) {
    const face = upperKey as "U" | "R" | "F";
    await move(face, inv);
  }

  if (p5.key === "o") {
    isMoving = true;
    await cube?.moveO();
    alg?.orient();
    isMoving = false;
    return;
  }

  if (p5.key === "O") {
    isMoving = true;
    await cube?.moveOR();

    alg?.orient(true);
    isMoving = false;
    return;
  }

  if (p5.key === "m") {
    cube?.mirror();
    alg?.mirror();
    return;
  }

  if (p5.key === "e") {
    console.log(await cube?.explore());
    return;
  }

  if (p5.key === "a") {
    Animation.active = !Animation.active;
    return;
  }

  if (e.altKey && e.key === 'z') {
    alg = new Algorithm();
    cube = new PuppetCube(p5);
  }
};
