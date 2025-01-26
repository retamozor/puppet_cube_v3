import Model from "./Model.js";
import Animation from "./Animation.js";
import { DrawOptions, Pos, Rotation } from "./types.js";
import p5 from "p5";
import Algorithm, { Move } from "./Algorithm.js";

class PuppetCube {
  #positions: Pos[][][];
  #corners: (Model | null)[][][];
  #core: Model[];
  #rotations: (Omit<Rotation, "o"> | null)[][][];
  #animations: (DrawOptions | null)[][][];
  p5: p5;

  static preload(P5: p5) {
    Model.preload(P5);
  }

  constructor(P5: p5, alg?: Algorithm) {
    this.p5 = P5;
    this.#positions = [];
    for (let x = 0; x <= 1; x++) {
      this.#positions[x] = [];
      for (let y = 0; y <= 1; y++) {
        this.#positions[x][y] = [];
        for (let z = 0; z <= 1; z++) {
          let pos = { x: -2 + 4 * x, y: 2 - 4 * y, z: -2 + 4 * z };
          this.#positions[x][y][z] = pos;
        }
      }
    }

    this.#corners = Array.from({ length: 2 }, () =>
      Array.from({ length: 2 }, () => Array.from({ length: 2 }, () => null)),
    );
    this.#rotations = Array.from({ length: 2 }, () =>
      Array.from({ length: 2 }, () => Array.from({ length: 2 }, () => null)),
    );
    this.#animations = Array.from({ length: 2 }, () =>
      Array.from({ length: 2 }, () => Array.from({ length: 2 }, () => null)),
    );
    this.#corners[0][0][1] = new Model(P5, "corner_1");
    this.#rotations[0][0][1] = { x: -P5.PI / 2, y: -P5.PI / 2, z: 0 };
    this.#animations[0][0][1] = { f: true };

    this.#corners[0][1][0] = new Model(P5, "corner_1");
    this.#rotations[0][1][0] = { x: 0, y: P5.PI, z: 0 };
    this.#animations[0][1][0] = { u: true };

    this.#corners[0][1][1] = new Model(P5, "corner_2");
    this.#rotations[0][1][1] = { x: 0, y: -P5.PI / 2, z: 0 };
    this.#animations[0][1][1] = { u: true, f: true };

    this.#corners[1][0][0] = new Model(P5, "corner_1");
    this.#rotations[1][0][0] = { x: -P5.PI / 2, y: 0, z: P5.PI / 2 };
    this.#animations[1][0][0] = { r: true };

    this.#corners[1][0][1] = new Model(P5, "corner_2");
    this.#rotations[1][0][1] = { x: -P5.PI / 2, y: 0, z: 0 };
    this.#animations[1][0][1] = { r: true, f: true };

    this.#corners[1][1][0] = new Model(P5, "corner_2");
    this.#rotations[1][1][0] = { x: P5.PI, y: 0, z: P5.PI / 2 };
    this.#animations[1][1][0] = { r: true, u: true };

    this.#corners[1][1][1] = new Model(P5, "corner_3");
    this.#rotations[1][1][1] = { x: 0, y: 0, z: 0 };
    this.#animations[1][1][1] = { f: true, r: true, u: true };

    this.#corners.forEach((_, x) => {
      _.forEach((_, y) => {
        _.forEach((_model, z) => {
          // if (_model === null) return;
          // if (x == 0 && y == 0 && z == 1) {
          //   _model.color = "red";
          // }
          this.#setDefaults(x, y, z);
        });
      });
    });

    this.#core = [];
    // first layer
    this.#core.push(
      new Model(P5, "center", {
        pos: { x: 0, y: -2, z: 0 },
        color: "#9D50E6",
        rotation: { x: 0, y: 0, z: 0, o: 0 },
        animate: { u: true },
      }),
    );
    this.#core.push(
      new Model(P5, "edge", {
        pos: { x: 0, y: -2, z: 2 },
        color: "#E5824E",
        rotation: { x: 0, y: 0, z: 0, o: 0 },
        animate: { u: true, f: true },
      }),
    );
    this.#core.push(
      new Model(P5, "edge", {
        pos: { x: -2, y: -2, z: 0 },
        color: "#E5824E",
        rotation: { x: 0, y: -P5.PI / 2, z: 0, o: 0 },
        animate: { u: true },
      }),
    );
    this.#core.push(
      new Model(P5, "edge", {
        pos: { x: 0, y: -2, z: -2 },
        color: "#E5824E",
        rotation: { x: 0, y: P5.PI, z: 0, o: 0 },
        animate: { u: true },
      }),
    );
    this.#core.push(
      new Model(P5, "edge", {
        pos: { x: 2, y: -2, z: 0 },
        color: "#E5824E",
        rotation: { x: 0, y: P5.PI / 2, z: 0, o: 0 },
        animate: { u: true, r: true },
      }),
    );
    // Second layer
    this.#core.push(
      new Model(P5, "center", {
        pos: { x: 0, y: 0, z: 2 },
        color: "#9D50E6",
        rotation: { x: -P5.PI / 2, y: 0, z: 0, o: 0 },
        animate: { f: true },
      }),
    );
    this.#core.push(
      new Model(P5, "center", {
        pos: { x: 2, y: 0, z: 0 },
        color: "#9D50E6",
        rotation: { x: 0, y: 0, z: P5.PI / 2, o: 0 },
        animate: { r: true },
      }),
    );
    this.#core.push(
      new Model(P5, "edge", {
        pos: { x: -2, y: 0, z: 2 },
        color: "#E5824E",
        rotation: { x: 0, y: 0, z: -P5.PI / 2, o: 0 },
        animate: { f: true },
      }),
    );
    this.#core.push(
      new Model(P5, "edge", {
        pos: { x: 2, y: 0, z: 2 },
        color: "#E5824E",
        rotation: { x: 0, y: 0, z: P5.PI / 2, o: 0 },
        animate: { r: true, f: true },
      }),
    );
    this.#core.push(
      new Model(P5, "edge", {
        pos: { x: 2, y: 0, z: -2 },
        color: "#E5824E",
        rotation: { x: 0, y: P5.PI / 2, z: P5.PI / 2, o: 0 },
        animate: { r: true },
      }),
    );

    this.#core.push(
      new Model(P5, "corner_3", {
        // === BANDAGE === //
        pos: { x: 0, y: 0, z: 0 },
        color: "#ff5656",
        rotation: { x: P5.PI, y: -P5.PI / 2, z: 0, o: 0 },
      }),
    );
    // Third layer

    this.#core.push(
      new Model(P5, "edge", {
        pos: { x: 0, y: 2, z: 2 },
        color: "#E5824E",
        rotation: { x: -P5.PI / 2, y: 0, z: 0, o: 0 },
        animate: { f: true },
      }),
    );
    this.#core.push(
      new Model(P5, "edge", {
        pos: { x: 2, y: 2, z: 0 },
        color: "#E5824E",
        rotation: { x: -P5.PI / 2, y: 0, z: P5.PI / 2, o: 0 },
        animate: { r: true },
      }),
    );

    if (alg !== undefined) {
      Animation.active = false;
      this.do(alg).finally(() => (Animation.active = true));
    }
  }

  draw() {
    this.#core.forEach((model) => model.draw());
    this.#corners.forEach((layer) => {
      layer.forEach((col) => {
        col.forEach((model) => {
          model?.draw();
        });
      });
    });
  }

  #setDefaults(x: number, y: number, z: number) {
    if (this.#corners[x][y][z] === null) return;
    this.#corners[x][y][z].pos = this.#positions[x][y][z];
    this.#corners[x][y][z].rotation = this.#rotations[x][y][z] ?? {};
    this.#corners[x][y][z].animate = this.#animations[x][y][z] ?? {};
  }

  async moveU() {
    await Animation.start("U", 1);
    const aux = this.#corners[1][1][1];
    this.#corners[1][1][1] = this.#corners[1][1][0];
    this.#corners[1][1][0] = this.#corners[0][1][0];
    this.#corners[0][1][0] = this.#corners[0][1][1];
    this.#corners[0][1][1] = aux;

    if (this.#corners[1][1][0]) this.#corners[1][1][0].orientation += 1;
    if (this.#corners[1][1][1]) this.#corners[1][1][1].orientation += 2;
    if (this.#corners[1][1][0]) this.#corners[1][1][0].orientation %= 3;
    if (this.#corners[1][1][1]) this.#corners[1][1][1].orientation %= 3;

    this.#setDefaults(1, 1, 1);
    this.#setDefaults(1, 1, 0);
    this.#setDefaults(0, 1, 0);
    this.#setDefaults(0, 1, 1);
  }

  async moveUR() {
    await Animation.start("U", -1);
    const aux = this.#corners[1][1][1];
    this.#corners[1][1][1] = this.#corners[0][1][1];
    this.#corners[0][1][1] = this.#corners[0][1][0];
    this.#corners[0][1][0] = this.#corners[1][1][0];
    this.#corners[1][1][0] = aux;

    if (this.#corners[1][1][0]) this.#corners[1][1][0].orientation += 1;
    if (this.#corners[0][1][0]) this.#corners[0][1][0].orientation += 2;
    if (this.#corners[1][1][0]) this.#corners[1][1][0].orientation %= 3;
    if (this.#corners[0][1][0]) this.#corners[0][1][0].orientation %= 3;

    this.#setDefaults(1, 1, 1);
    this.#setDefaults(1, 1, 0);
    this.#setDefaults(0, 1, 0);
    this.#setDefaults(0, 1, 1);
  }

  async moveR() {
    await Animation.start("R", 1);
    const aux = this.#corners[1][1][1];
    this.#corners[1][1][1] = this.#corners[1][0][1];
    this.#corners[1][0][1] = this.#corners[1][0][0];
    this.#corners[1][0][0] = this.#corners[1][1][0];
    this.#corners[1][1][0] = aux;

    if (this.#corners[1][1][0]) this.#corners[1][1][0].orientation += 2;
    if (this.#corners[1][0][1]) this.#corners[1][0][1].orientation += 1;
    if (this.#corners[1][1][0]) this.#corners[1][1][0].orientation %= 3;
    if (this.#corners[1][0][1]) this.#corners[1][0][1].orientation %= 3;

    this.#setDefaults(1, 1, 1);
    this.#setDefaults(1, 0, 1);
    this.#setDefaults(1, 0, 0);
    this.#setDefaults(1, 1, 0);
  }

  async moveRR() {
    await Animation.start("R", -1);
    const aux = this.#corners[1][1][1];
    this.#corners[1][1][1] = this.#corners[1][1][0];
    this.#corners[1][1][0] = this.#corners[1][0][0];
    this.#corners[1][0][0] = this.#corners[1][0][1];
    this.#corners[1][0][1] = aux;

    if (this.#corners[1][0][0]) this.#corners[1][0][0].orientation += 2;
    if (this.#corners[1][1][1]) this.#corners[1][1][1].orientation += 1;
    if (this.#corners[1][0][0]) this.#corners[1][0][0].orientation %= 3;
    if (this.#corners[1][1][1]) this.#corners[1][1][1].orientation %= 3;

    this.#setDefaults(1, 1, 1);
    this.#setDefaults(1, 0, 1);
    this.#setDefaults(1, 0, 0);
    this.#setDefaults(1, 1, 0);
  }

  async moveF() {
    await Animation.start("F", 1);
    const aux = this.#corners[1][1][1];
    this.#corners[1][1][1] = this.#corners[0][1][1];
    this.#corners[0][1][1] = this.#corners[0][0][1];
    this.#corners[0][0][1] = this.#corners[1][0][1];
    this.#corners[1][0][1] = aux;

    if (this.#corners[0][1][1]) this.#corners[0][1][1].orientation += 1;
    if (this.#corners[1][1][1]) this.#corners[1][1][1].orientation += 1;
    if (this.#corners[1][0][1]) this.#corners[1][0][1].orientation += 1;
    if (this.#corners[0][1][1]) this.#corners[0][1][1].orientation %= 3;
    if (this.#corners[1][1][1]) this.#corners[1][1][1].orientation %= 3;
    if (this.#corners[1][0][1]) this.#corners[1][0][1].orientation %= 3;

    this.#setDefaults(1, 1, 1);
    this.#setDefaults(0, 1, 1);
    this.#setDefaults(0, 0, 1);
    this.#setDefaults(1, 0, 1);
  }

  async moveFR() {
    await Animation.start("F", -1);
    const aux = this.#corners[1][1][1];
    this.#corners[1][1][1] = this.#corners[1][0][1];
    this.#corners[1][0][1] = this.#corners[0][0][1];
    this.#corners[0][0][1] = this.#corners[0][1][1];
    this.#corners[0][1][1] = aux;

    if (this.#corners[1][1][1]) this.#corners[1][1][1].orientation += 2;
    if (this.#corners[0][1][1]) this.#corners[0][1][1].orientation += 2;
    if (this.#corners[0][0][1]) this.#corners[0][0][1].orientation += 2;
    if (this.#corners[1][1][1]) this.#corners[1][1][1].orientation %= 3;
    if (this.#corners[0][1][1]) this.#corners[0][1][1].orientation %= 3;
    if (this.#corners[0][0][1]) this.#corners[0][0][1].orientation %= 3;

    this.#setDefaults(1, 1, 1);
    this.#setDefaults(0, 1, 1);
    this.#setDefaults(0, 0, 1);
    this.#setDefaults(1, 0, 1);
  }

  async moveO() {
    await Animation.orient(1);
    if (this.#corners[1][1][1]) this.#corners[1][1][1].orientation += 1;
    if (this.#corners[1][1][1]) this.#corners[1][1][1].orientation %= 3;

    let aux = this.#corners[0][0][1];
    this.#corners[0][0][1] = this.#corners[1][0][0];
    this.#corners[1][0][0] = this.#corners[0][1][0];
    this.#corners[0][1][0] = aux;

    aux = this.#corners[1][1][0];
    this.#corners[1][1][0] = this.#corners[0][1][1];
    this.#corners[0][1][1] = this.#corners[1][0][1];
    this.#corners[1][0][1] = aux;

    this.#setDefaults(0, 0, 1);
    this.#setDefaults(0, 1, 0);
    this.#setDefaults(1, 0, 0);
    this.#setDefaults(0, 1, 1);
    this.#setDefaults(1, 0, 1);
    this.#setDefaults(1, 1, 0);
  }

  async moveOR() {
    await Animation.orient(-1);
    if (this.#corners[1][1][1]) this.#corners[1][1][1].orientation += 2;
    if (this.#corners[1][1][1]) this.#corners[1][1][1].orientation %= 3;

    let aux = this.#corners[0][0][1];
    this.#corners[0][0][1] = this.#corners[0][1][0];
    this.#corners[0][1][0] = this.#corners[1][0][0];
    this.#corners[1][0][0] = aux;

    aux = this.#corners[1][1][0];
    this.#corners[1][1][0] = this.#corners[1][0][1];
    this.#corners[1][0][1] = this.#corners[0][1][1];
    this.#corners[0][1][1] = aux;

    this.#setDefaults(0, 0, 1);
    this.#setDefaults(0, 1, 0);
    this.#setDefaults(1, 0, 0);
    this.#setDefaults(0, 1, 1);
    this.#setDefaults(1, 0, 1);
    this.#setDefaults(1, 1, 0);
  }

  mirror() {
    let aux = this.#corners[0][0][1];
    this.#corners[0][0][1] = this.#corners[1][0][0];
    this.#corners[1][0][0] = aux;

    aux = this.#corners[0][1][1];
    this.#corners[0][1][1] = this.#corners[1][1][0];
    this.#corners[1][1][0] = aux;

    let model = this.#corners[1][1][1];
    if (!model) {
    } else if (model.isModel("corner_1", 1)) {
      model.orientation = 2;
    } else if (model.isModel("corner_1", 2)) {
      model.orientation = 1;
    } else if (model.isModel("corner_2", 0)) {
      model.orientation = 2;
    } else if (model.isModel("corner_2", 2)) {
      model.orientation = 0;
    }

    model = this.#corners[1][1][0];
    if (!model) {
    } else if (model.isModel("corner_1", 0)) {
      model.orientation = 1;
    } else if (model.isModel("corner_1", 1)) {
      model.orientation = 0;
    } else if (model.isModel("corner_2", 1)) {
      model.orientation = 2;
    } else if (model.isModel("corner_2", 2)) {
      model.orientation = 1;
    }

    model = this.#corners[0][1][1];
    if (!model) {
    } else if (model.isModel("corner_1", 0)) {
      model.orientation = 1;
    } else if (model.isModel("corner_1", 1)) {
      model.orientation = 0;
    } else if (model.isModel("corner_2", 1)) {
      model.orientation = 2;
    } else if (model.isModel("corner_2", 2)) {
      model.orientation = 1;
    }

    model = this.#corners[0][1][0];
    if (!model) {
    } else if (model.isModel("corner_1", 1)) {
      model.orientation = 2;
    } else if (model.isModel("corner_1", 2)) {
      model.orientation = 1;
    } else if (model.isModel("corner_2", 0)) {
      model.orientation = 2;
    } else if (model.isModel("corner_2", 2)) {
      model.orientation = 0;
    }

    model = this.#corners[1][0][1];
    if (!model) {
    } else if (model.isModel("corner_1", 0)) {
      model.orientation = 1;
    } else if (model.isModel("corner_1", 1)) {
      model.orientation = 0;
    } else if (model.isModel("corner_2", 1)) {
      model.orientation = 2;
    } else if (model.isModel("corner_2", 2)) {
      model.orientation = 1;
    }

    model = this.#corners[1][0][0];
    if (!model) {
    } else if (model.isModel("corner_1", 2)) {
      model.orientation = 1;
    } else if (model.isModel("corner_1", 1)) {
      model.orientation = 2;
    } else if (model.isModel("corner_2", 0)) {
      model.orientation = 2;
    } else if (model.isModel("corner_2", 2)) {
      model.orientation = 0;
    }

    model = this.#corners[0][0][1];
    if (!model) {
    } else if (model.isModel("corner_1", 2)) {
      model.orientation = 1;
    } else if (model.isModel("corner_1", 1)) {
      model.orientation = 2;
    } else if (model.isModel("corner_2", 0)) {
      model.orientation = 2;
    } else if (model.isModel("corner_2", 2)) {
      model.orientation = 0;
    }

    this.#setDefaults(0, 0, 1);
    this.#setDefaults(1, 0, 0);
    this.#setDefaults(0, 1, 1);
    this.#setDefaults(1, 1, 0);
  }

  get isValidState() {
    return (
      this.#checkTop() &&
      this.#checkRight() &&
      this.#checkFront() &&
      this.#checkLeft() &&
      this.#checkBack() &&
      this.#checkDown()
    );
  }

  #checkTop() {
    // [front, left, back, right, center]
    const top = [0, 0, 0, 0, 0];

    if (this.#corners[1][1][1]?.isModel("corner_1", 0)) {
      top[3] += 1;
      top[0] += 1;
      top[4] += 1;
    }
    if (this.#corners[1][1][1]?.isModel("corner_2", 0)) {
      top[3] += 1;
    }
    if (this.#corners[1][1][1]?.isModel("corner_2", 2)) {
      top[0] += 1;
    }

    if (this.#corners[0][1][1]?.isModel("corner_1", 0)) {
      top[0] += 1;
      top[1] += 1;
      top[4] += 1;
    }
    if (this.#corners[0][1][1]?.isModel("corner_2", 0)) {
      top[0] += 1;
    }
    if (this.#corners[0][1][1]?.isModel("corner_2", 2)) {
      top[1] += 1;
    }

    if (this.#corners[0][1][0]?.isModel("corner_1", 0)) {
      top[1] += 1;
      top[2] += 1;
      top[4] += 1;
    }
    if (this.#corners[0][1][0]?.isModel("corner_2", 0)) {
      top[1] += 1;
    }
    if (this.#corners[0][1][0]?.isModel("corner_2", 2)) {
      top[2] += 1;
    }

    if (this.#corners[1][1][0]?.isModel("corner_1", 1)) {
      top[2] += 1;
      top[3] += 1;
      top[4] += 1;
    }
    if (this.#corners[1][1][0]?.isModel("corner_2", 1)) {
      top[2] += 1;
    }
    if (this.#corners[1][1][0]?.isModel("corner_2", 0)) {
      top[3] += 1;
    }

    return !top.some((d) => d > 1);
  }

  #checkRight() {
    // [front, up, back, down, center]
    const right = [0, 0, 0, 0, 0];

    if (this.#corners[1][1][1]?.isModel("corner_1", 1)) {
      right[0] += 1;
      right[1] += 1;
      right[4] += 1;
    }
    if (this.#corners[1][1][1]?.isModel("corner_2", 0)) {
      right[1] += 1;
    }
    if (this.#corners[1][1][1]?.isModel("corner_2", 1)) {
      right[0] += 1;
    }

    if (this.#corners[1][1][0]?.isModel("corner_1", 0)) {
      right[1] += 1;
      right[2] += 1;
      right[4] += 1;
    }
    if (this.#corners[1][1][0]?.isModel("corner_2", 0)) {
      right[1] += 1;
    }
    if (this.#corners[1][1][0]?.isModel("corner_2", 2)) {
      right[2] += 1;
    }

    if (this.#corners[1][0][0]?.isModel("corner_1", 0)) {
      right[2] += 1;
      right[3] += 1;
      right[4] += 1;
    }
    if (this.#corners[1][0][0]?.isModel("corner_2", 0)) {
      right[2] += 1;
    }
    if (this.#corners[1][0][0]?.isModel("corner_2", 2)) {
      right[3] += 1;
    }

    if (this.#corners[1][0][1]?.isModel("corner_1", 1)) {
      right[3] += 1;
      right[0] += 1;
      right[4] += 1;
    }
    if (this.#corners[1][0][1]?.isModel("corner_2", 1)) {
      right[3] += 1;
    }
    if (this.#corners[1][0][1]?.isModel("corner_2", 0)) {
      right[0] += 1;
    }

    return !right.some((d) => d > 1);
  }

  #checkFront() {
    // [right, down, left, up, center]
    const front = [0, 0, 0, 0, 0];

    if (this.#corners[1][1][1]?.isModel("corner_1", 2)) {
      front[0] += 1;
      front[3] += 1;
      front[4] += 1;
    }
    if (this.#corners[1][1][1]?.isModel("corner_2", 1)) {
      front[0] += 1;
    }
    if (this.#corners[1][1][1]?.isModel("corner_2", 2)) {
      front[3] += 1;
    }

    if (this.#corners[1][0][1]?.isModel("corner_1", 0)) {
      front[0] += 1;
      front[1] += 1;
      front[4] += 1;
    }
    if (this.#corners[1][0][1]?.isModel("corner_2", 0)) {
      front[0] += 1;
    }
    if (this.#corners[1][0][1]?.isModel("corner_2", 2)) {
      front[1] += 1;
    }

    if (this.#corners[0][0][1]?.isModel("corner_1", 0)) {
      front[1] += 1;
      front[2] += 1;
      front[4] += 1;
    }
    if (this.#corners[0][0][1]?.isModel("corner_2", 0)) {
      front[1] += 1;
    }
    if (this.#corners[0][0][1]?.isModel("corner_2", 2)) {
      front[2] += 1;
    }

    if (this.#corners[0][1][1]?.isModel("corner_1", 1)) {
      front[2] += 1;
      front[3] += 1;
      front[4] += 1;
    }
    if (this.#corners[0][1][1]?.isModel("corner_2", 1)) {
      front[2] += 1;
    }
    if (this.#corners[0][1][1]?.isModel("corner_2", 0)) {
      front[3] += 1;
    }

    return !front.some((d) => d > 1);
  }

  #checkLeft() {
    // [front, up, center]
    const left = [0, 0, 0];

    if (this.#corners[0][1][1]?.isModel("corner_1", 2)) {
      left[0] += 1;
      left[1] += 1;
      left[2] += 1;
    }
    if (this.#corners[0][1][1]?.isModel("corner_2", 2)) {
      left[1] += 1;
    }
    if (this.#corners[0][1][1]?.isModel("corner_2", 1)) {
      left[0] += 1;
    }

    if (this.#corners[0][0][1]?.isModel("corner_1", 2)) {
      left[0] += 1;
      left[2] += 1;
    }
    if (this.#corners[0][0][1]?.isModel("corner_2", 2)) {
      left[0] += 1;
    }

    if (this.#corners[0][1][0]?.isModel("corner_1", 1)) {
      left[1] += 1;
      left[2] += 1;
    }
    if (this.#corners[0][1][0]?.isModel("corner_2", 0)) {
      left[1] += 1;
    }
    return !left.some((d) => d > 1);
  }

  #checkBack() {
    // [right, up, center]
    const back = [0, 0, 0];

    if (this.#corners[1][1][0]?.isModel("corner_1", 2)) {
      back[0] += 1;
      back[1] += 1;
      back[2] += 1;
    }
    if (this.#corners[1][1][0]?.isModel("corner_2", 2)) {
      back[0] += 1;
    }
    if (this.#corners[1][1][0]?.isModel("corner_2", 1)) {
      back[1] += 1;
    }

    if (this.#corners[0][1][0]?.isModel("corner_1", 2)) {
      back[1] += 1;
      back[2] += 1;
    }
    if (this.#corners[0][1][0]?.isModel("corner_2", 2)) {
      back[1] += 1;
    }

    if (this.#corners[1][0][0]?.isModel("corner_1", 1)) {
      back[0] += 1;
      back[2] += 1;
    }
    if (this.#corners[1][0][0]?.isModel("corner_2", 0)) {
      back[0] += 1;
    }
    return !back.some((d) => d > 1);
  }

  #checkDown() {
    // [front, right, center]
    const down = [0, 0, 0];

    if (this.#corners[1][0][1]?.isModel("corner_1", 2)) {
      down[0] += 1;
      down[1] += 1;
      down[2] += 1;
    }
    if (this.#corners[1][0][1]?.isModel("corner_2", 2)) {
      down[0] += 1;
    }
    if (this.#corners[1][0][1]?.isModel("corner_2", 1)) {
      down[1] += 1;
    }

    if (this.#corners[0][0][1]?.isModel("corner_1", 1)) {
      down[0] += 1;
      down[2] += 1;
    }
    if (this.#corners[0][0][1]?.isModel("corner_2", 0)) {
      down[0] += 1;
    }

    if (this.#corners[1][0][0]?.isModel("corner_1", 2)) {
      down[1] += 1;
      down[2] += 1;
    }
    if (this.#corners[1][0][0]?.isModel("corner_2", 2)) {
      down[1] += 1;
    }
    return !down.some((d) => d > 1);
  }

  toString() {
    let string = "";
    for (let y = 0; y < 2; y++) {
      for (let x = 0; x < 2; x++) {
        for (let z = 0; z < 2; z++) {
          let model = this.#corners[x][y][z];
          if (model === null) continue;
          const strModel = model.toString();
          if (x === 1 && y === 1 && z === 1) {
            string = string.concat(strModel);
          } else {
            string = string.concat(`${strModel}|`);
          }
        }
      }
    }
    return string;
  }

  async explore() {
    const moves = {
      U: "",
      "U'": "",
      F: "",
      "F'": "",
      R: "",
      "R'": "",
    };

    Animation.active = false;
    await this.moveU();
    if (this.isValidState) {
      moves.U = this.toString();
    }
    await this.moveUR();

    await this.moveUR();
    if (this.isValidState) {
      moves["U'"] = this.toString();
    }
    await this.moveU();

    await this.moveF();
    if (this.isValidState) {
      moves.F = this.toString();
    }
    await this.moveFR();

    await this.moveFR();
    if (this.isValidState) {
      moves["F'"] = this.toString();
    }
    await this.moveF();

    await this.moveR();
    if (this.isValidState) {
      moves.R = this.toString();
    }
    await this.moveRR();

    await this.moveRR();
    if (this.isValidState) {
      moves["R'"] = this.toString();
    }
    await this.moveR();

    Animation.active = true;

    return moves;
  }

  async #move(move: Move) {
    switch (move.face) {
      case "U":
        if (move.inv) {
          await this.moveUR();
        } else {
          await this.moveU();
        }
        break;
      case "R":
        if (move.inv) {
          await this.moveRR();
        } else {
          await this.moveR();
        }
        break;
      case "F":
        if (move.inv) {
          await this.moveFR();
        } else {
          await this.moveF();
        }
        break;
    }

    if (!this.isValidState) {
      throw new Error("Invalid state");
    }
  }

  async do(alg: Algorithm) {
    const moves = alg.factorize();
    for (const move of moves) {
			try {
				await this.#move(move);
			} catch (error) {
				await this.#move(new Move(move.face, !move.inv));
				throw error;
			}
    }
  }
}

export default PuppetCube;
