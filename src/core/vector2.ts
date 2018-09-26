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

    x: number;
    y: number;

    constructor(x?: number, y?: number) {
        this.x = x || 0;
        this.y = y === undefined ? this.x : y;
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

    lengthSquared() {
        return this.x * this.x + this.y * this.y;
    }

    length() {
        return Math.sqrt(this.lengthSquared());
    }

    normalized() {
        return this.div(this.length());
    }

    toDegrees() {
        const normalized = this.normalized();
        return Math.atan2(normalized.y, normalized.x) + Math.PI/2;
    }
}