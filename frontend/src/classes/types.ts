import p5 from "p5";

export interface Pos {
  x: number;
  y: number;
  z: number;
}

export interface Rotation {
  x: number;
  y: number;
  z: number;
  o: number;
}

export interface DrawOptions {
  u?: boolean;
  f?: boolean;
  r?: boolean;
}

export interface Options {
	pos?: Pos,
	rotation?: Rotation,
	color?: string,
	animate?: DrawOptions,
}

export interface Models {
	corner_1: p5.Geometry | null;
	corner_2: p5.Geometry | null;
	corner_3: p5.Geometry | null;
	center: p5.Geometry | null;
	edge: p5.Geometry | null;
}
