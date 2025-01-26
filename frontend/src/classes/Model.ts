import p5 from "p5";
import Animation from "./Animation.js";
import type { DrawOptions, Models, Options, Pos, Rotation } from "./types.js";

type ModelType = "corner_1" | "corner_2" | "corner_3" | "center" | "edge";

class Model {
	static #models: Models = {
		corner_1: null,
		corner_2: null,
		corner_3: null,
		center: null,
		edge: null,
	};
	model;
	pos: Pos;
	color;
	#rotation: Rotation;
	animate: DrawOptions;
	p5: p5;

	static preload(P5: p5) {
		// Set the shape variable and print the geometry's
		// ID to the console.
		function handleModel(_shape: p5.Geometry | null) {
			return (data: p5.Geometry) => {
				_shape = data;
			};
		}

		// Print an error message if the file doesn't load.
		function handleError(error: Event) {
			console.error("Oops!", error);
		}
		let options = (shape: p5.Geometry | null) => ({
			normalize: false,
			successCallback: handleModel(shape),
			failureCallback: handleError,
			fileType: ".obj",
			flipU: false,
			flipV: false,
		});

		Model.#models.corner_1 = P5.loadModel(
			"./models/corner_1.obj",
			// @ts-ignore
			options(Model.#models.corner_1),
		);
		Model.#models.corner_2 = P5.loadModel(
			"./models/corner_2.obj",
			// @ts-ignore
			options(Model.#models.corner_2),
		);
		Model.#models.corner_3 = P5.loadModel(
			"./models/corner_3.obj",
			// @ts-ignore
			options(Model.#models.corner_3),
		);
		Model.#models.center = P5.loadModel(
			"./models/center.obj",
			// @ts-ignore
			options(Model.#models.center),
		);
		Model.#models.edge = P5.loadModel(
			"./models/edge.obj",
			// @ts-ignore
			options(Model.#models.edge),
		);
	}

	constructor(p5: p5, model: ModelType, options?: Options) {
		if (!Model.#models) throw new Error("you need to cal Model.preload()");
		this.p5 = p5;
		this.model = Model.#models[model];
		this.pos = options?.pos ?? { x: 0, y: 0, z: 0 };
		this.#rotation = options?.rotation ?? { x: 0, y: 0, z: 0, o: 0 };
		this.color = options?.color ?? "#4696E5";
		this.animate = options?.animate ?? { u: false, f: false, r: false };
	}

	draw() {
		if (this.model === null) return;
		this.p5.push();

		if (this.animate.u) {
			this.p5.rotateY(Animation.MOVES.U);
		}
		if (this.animate.f) {
			this.p5.rotateZ(-Animation.MOVES.F);
		}
		if (this.animate.r) {
			this.p5.rotateX(-Animation.MOVES.R);
		}

		this.p5.rotate(-Animation.MOVES.O, [1, -1, 1]);

		this.p5.fill(this.color);
		this.p5.translate(this.pos.x, this.pos.y, this.pos.z);
		if (this.pos.x !== 0 && this.pos.y !== 0 && this.pos.z !== 0)
			this.p5.rotate(this.#rotation.o * ((2 * this.p5.PI) / 3), [
				this.pos.x,
				this.pos.y,
				this.pos.z,
			]);
		this.p5.rotateX(this.#rotation.x);
		this.p5.rotateY(this.#rotation.y);
		this.p5.rotateZ(this.#rotation.z);
		this.p5.model(this.model);
		this.p5.pop();
	}

	set rotation(rotation: Partial<Rotation>) {
		if (rotation.x !== undefined) {
			this.#rotation.x = rotation.x;
		}
		if (rotation.y !== undefined) {
			this.#rotation.y = rotation.y;
		}
		if (rotation.z !== undefined) {
			this.#rotation.z = rotation.z;
		}
		if (rotation.o !== undefined) {
			this.#rotation.o = rotation.o;
		}
	}

	set orientation(o: number) {
		this.#rotation.o = o;
	}

	get orientation() {
		return this.#rotation.o;
	}

	isModel(model: ModelType, orientation: number) {
		return (
			this.model === Model.#models[model] && this.#rotation.o === orientation
		);
	}

	toString() {
		const name = (Object.keys(Model.#models) as ModelType[]).find((key) => {
			const model = Model.#models[key] as p5.Geometry;
			return model === this.model;
		});

		return `${name}~${this.orientation}`;
	}
}

export default Model;
