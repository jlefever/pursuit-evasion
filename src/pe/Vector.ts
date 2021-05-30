import IPoint from "./IPoint";

const { acos, atan2, cos, PI, sin, sqrt } = Math;

/**
 * A vector in two dimensional Euclidean space.
 */
export default class Vector implements IPoint {
    private readonly _x: number;
    private readonly _y: number;

    private constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    /**
     * The first component of this vector. (Assumed to be horizontal.)
     */
    get x() {
        return this._x;
    }

    /**
     * The second component of this vector. (Assumed to be verticle.)
     */
    get y() {
        return this._y;
    }

    /**
     * The angle (in radians) of this vector.
     */
    get angle() {
        return atan2(this.y, this.x);
    }

    /**
     * The length (or norm) of this vector.
     */
    get length() {
        return sqrt(this.dot(this));
    }

    /**
     * Create a vector using Cartesian coordinates.
     * @param x The horizontal component.
     * @param y The verticle component.
     * @returns A vector.
     */
    static car(x: number, y: number) {
        return new Vector(x, y);
    }

    /**
     * Create a vector using polar coordinates.
     * @param angle The angle of this vector.
     * @param length The length of this vector.
     * @returns A vector.
     */
    static pol(angle: number, length: number) {
        return Vector.car(cos(angle), sin(angle)).scale(length);
    }

    static fromPoint(point: IPoint) {
        return Vector.car(point.x, point.y);
    }

    static zero() {
        return Vector.car(0, 0);
    }

    static add(...vecs: Vector[]) {
        const x = vecs.reduce((acc, cur) => acc + cur.x, 0);
        const y = vecs.reduce((acc, cur) => acc + cur.y, 0);
        return Vector.car(x, y);
    }

    static sub(head: Vector, ...tail: Vector[]) {
        const x = tail.reduce((acc, cur) => acc - cur.x, head.x);
        const y = tail.reduce((acc, cur) => acc - cur.y, head.y);
        return Vector.car(x, y);
    }

    static dot(...vecs: Vector[]) {
        const x = vecs.reduce((acc, cur) => acc * cur.x, 1);
        const y = vecs.reduce((acc, cur) => acc * cur.y, 1);
        return x + y;
    }

    between(other: Vector) {
        return acos(Vector.dot(this, other) / this.length * other.length);
    }

    add = (...vecs: Vector[]) => Vector.add(this, ...vecs);

    sub = (...vecs: Vector[]) => Vector.sub(this, ...vecs);

    dot = (...vecs: Vector[]) => Vector.dot(this, ...vecs);

    cross = (vec: Vector) => this.x * vec.y - (this.y * vec.x);

    rotate = (angle: number) => Vector.pol(addRadians(this.angle, angle), this.length);

    rotateTo = (angle: number) => Vector.pol(angle, this.length);

    scale = (c: number) => Vector.car(c * this.x, c * this.y);

    scaleTo = (length: number) => Vector.pol(this.angle, length);

    lookAt = (pos: Vector) => Vector.pol(pos.sub(this).angle, this.length);

    dist = (pos: Vector) => this.sub(pos).length;
}

// TODO: This doesn't work for subtraction.
function addRadians(...rads: number[]) {
    return rads.reduce((a, b) => a + b, 0) % (2 * PI);
}