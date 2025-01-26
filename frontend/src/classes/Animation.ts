class Animation {
  static #MOVES = { U: 0, R: 0, F: 0, O: 0 };
  static PI: number;
	static active = true

  static start(move: 'U' | 'R' | 'F', dir: 1 | -1) {
    const PI = Animation.PI ?? 0;
    return new Promise<void>((resolve) => {
			if (!Animation.active) {
				resolve()
				return
			}
      let timer = setInterval(() => {
        if (
          Animation.#MOVES[move] <= -PI / 2 ||
          Animation.#MOVES[move] >= PI / 2
        ) {
          clearInterval(timer);
          resolve();
          Animation.#MOVES[move] = 0;
          return;
        }
        Animation.#MOVES[move] +=
          dir *
          ((Animation.#MOVES[move] * Animation.#MOVES[move]) / (2 * PI) +
            (dir * Animation.#MOVES[move]) / 4 -
            0.01);
      }, 10);
    });
  }

  static orient(dir: 1 | -1) {
    const PI = Animation.PI ?? 0;
    return new Promise<void>((resolve) => {
			if (!Animation.active) {
				resolve()
				return
			}
      let timer = setInterval(() => {
        if (Animation.#MOVES.O <= -(2 * PI / 3) || Animation.#MOVES.O >= 2 * PI / 3) {
          clearInterval(timer);
          resolve();
          Animation.#MOVES.O = 0;
          return;
        }
        Animation.#MOVES.O += dir * ((Animation.#MOVES.O * Animation.#MOVES.O) / (3 * PI) + (dir * Animation.#MOVES.O) / 4 - 0.01);
      }, 10);
    });
  }

  static get MOVES() {
    return {
      U: Animation.#MOVES.U,
      R: Animation.#MOVES.R,
      F: Animation.#MOVES.F,
      O: Animation.#MOVES.O,
    };
  }
}

export default Animation;
