export class Move {
  #face: "R" | "F" | "U";
  #amount;
  static R = "R";
  static F = "F";
  static U = "U";

  constructor(face: "R" | "F" | "U", inv = false) {
    this.#face = face;
    /*
     * 0: double move (counterclockwise)
     * 1: counterclockwise
     * 2: nothing
     * 3: clockwise
     * 4: double move (clockwise)
     */
    this.#amount = inv ? 1 : 3;
  }

  add(move: Move) {
    if (move.#face !== this.#face) {
      return false;
    }

    // this.#amount = (this.#amount + (move.#amount - 2) + 4) % 4;
    const amount = move.#amount - 2;
    this.#amount = (this.#amount + amount + 5) % 5;

    if (amount === -1 && this.#amount === 4) {
      this.#amount = 3;
    }

    if (amount === 1 && this.#amount === 0) {
      this.#amount = 1;
    }

    return true;
  }

  orient(inv = false) {
    switch (this.#face) {
      case "R":
        this.#face = inv ? "U" : "F";
        break;
      case "F":
        this.#face = inv ? "R" : "U";
        break;
      case "U":
        this.#face = inv ? "F" : "R";
        break;

      default:
        break;
    }
  }

  mirror() {
    if (this.#amount === 1) {
      this.#amount = 3;
    } else if (this.#amount === 3) {
      this.#amount = 1;
    } else if (this.#amount === 4) {
      this.#amount = 0;
    } else if (this.#amount === 0) {
      this.#amount = 4;
    }
    switch (this.#face) {
      case "R":
        this.#face = "F";
        break;
      case "F":
        this.#face = "R";
        break;
      default:
        break;
    }
  }

  get isNothing() {
    return this.#amount === 2;
  }

  toString() {
    if (this.#amount === 4) {
      return `2${this.#face}`;
    }

    if (this.#amount === 3) {
      return this.#face;
    }

    if (this.#amount === 2) {
      return "";
    }

    if (this.#amount === 1) {
      return `${this.#face}'`;
    }

    if (this.#amount === 0) {
      return `2${this.#face}'`;
    }
  }

	get face() {
		return this.#face;
	}

  get amount() {
    return Math.abs(this.#amount - 2);
  }

  get inv() {
    return this.#amount - 2 < 0;
  }

  factorize() {
    const moves: Move[] = [];

    for (let _ = 0; _ < this.amount; _++) {
      moves.push(new Move(this.#face, this.inv));
    }
    return moves;
  }
}

export class Algorithm {
  #moves: Move[];

  constructor(moves?: string) {
    this.#moves = [];

    if (moves !== undefined) {
      this.#moves = this.#srt2moves(moves);
    }
  }

  do(face: "R" | "F" | "U", inv = false) {
    const nextMove = new Move(face, inv);
    if (this.#moves.length === 0) {
      this.#moves.push(nextMove);
      return;
    }

    const currMove = this.#moves.pop()!;

    const merged = currMove.add(nextMove);

    if (!merged) {
      this.#moves.push(currMove);
      this.#moves.push(nextMove);
      return;
    }

    if (currMove.isNothing) return;

    this.#moves.push(currMove);
  }

  orient(inv = false) {
    this.#moves.forEach((move) => move.orient(inv));
  }

  mirror() {
    this.#moves.forEach((move) => move.mirror());
  }

  toString() {
    return this.#moves.map((move) => move.toString()).join(" ");
  }

  #srt2moves(str: string) {
    const steps = str.split(" ");
    const moves = steps.map((step) => {
      const face = step.match(/[F|R|U]/)?.[0] as 'F' | 'R' | 'U' | undefined;
      const inv = step.match(/'/) ? true : false;
      const double = step.match(/[2]/) ? true : false;

      if (face === undefined) return null;
      const move = new Move(face, inv);
      if (double) move.add(new Move(face, inv));
			return move;
    });

    return moves.filter(move => move !== null);
  }
	
	factorize() {
		return this.#moves.flatMap(move => move.factorize())
	}
}

export default Algorithm;
