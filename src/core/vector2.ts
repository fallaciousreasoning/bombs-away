interface Vector2ish {
    x: number;
    y: number;
}

export default class Vector2 {
    static left = new Vector2(-1, 0);
    static up = new Vector2(0, -1);
    static unitX = new Vector2(1, 0);
    static unitY = new Vector2(0, 1);
    static zero = new Vector2(0);
    static one = new Vector2(1, 1);

    private _x: number;
    private _y: number;

    constructor(x?: number, y?: number) {
        this._x = x || 0;
        this._y = y === undefined ? this.x : y;
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    add(vec: Vector2ish) {
        return new Vector2(this.x + vec.x, this.y + vec.y);
    }

    sub(vec: Vector2ish) {
        return new Vector2(this.x - vec.x, this.y - vec.y);
    }

    div(vec: Vector2ish | number) {
        vec = typeof vec === 'number' ? { x: vec, y: vec } : vec;
        return new Vector2(this.x / vec.x, this.y / vec.y);
    }

    mul(vec: Vector2ish | number) {
        vec = typeof vec === 'number' ? { x: vec, y: vec } : vec;
        return new Vector2(this.x * vec.x, this.y * vec.y);
    }

    rotate(degrees: number) {
        const x = this.x * Math.cos(degrees) - this.y * Math.sin(degrees);
        const y = this.x * Math.sin(degrees) + this.y * Math.cos(degrees)
        return new Vector2(x, y);
    }

    distanceSquared(to: Vector2) {
        return this.sub(to).lengthSquared();
    }

    distance(to: Vector2) {
        return Math.sqrt(this.distanceSquared(to));
    }

    dot(vec: Vector2) {
        return this.x*vec.x + this.y*vec.y;
    }

    cross(vec: Vector2) {
        return this.x*vec.y - this.y * vec.x;
    }

    static cross(first: number, second: Vector2) {
        return new Vector2(-first * second.y, first * second.x);
    }

    lengthSquared() {
        return this.x * this.x + this.y * this.y;
    }

    length() {
        return Math.sqrt(this.lengthSquared());
    }

    normalized() {
        const length = this.length();
        return length ? this.div(this.length()) : Vector2.zero;
    }

    toDegrees() {
        const normalized = this.normalized();
        return Math.atan2(normalized.y, normalized.x) + Math.PI/2;
    }

    withX(x: number) {
        return new Vector2(x, this.y);
    }

    withY(y: number) {
        return new Vector2(this.x, y);
    }

    hashCode() {
        return (23 * 37 + this.x) * 37 + this.y;
    }

    abs() {
        return new Vector2(Math.abs(this.x), Math.abs(this.y));
    }

    negate() {
        return new Vector2(-this.x, -this.y);
    }

    equals(vec: Vector2, tolerance=1.192092896e-06) {
        if (!vec) return false;

        return this.sub(vec).lengthSquared() < tolerance;
    }

    round(dps: number=0) {
        const mul = Math.pow(10, dps);
        const x = Math.round(this.x * mul) / mul;
        const y = Math.round(this.y * mul) / mul;
        return new Vector2(x, y);
    }

    toString() {
        return `Vector2 { x: ${this.x}, y: ${this.y} }`;
    }

    static min(...args: Vector2[]) {
        let result: Vector2;
        for (let i = 0; i < args.length; ++i) {
            const cur = args[i];

            if (!result) result = cur;

            if (cur.x < result.x) result._x = cur.x;
            if (cur.y < result.y) result._y = cur.y;
        }   

        return result;
    }
}