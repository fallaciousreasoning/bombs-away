interface Vector2ish {
    x: number;
    y: number;
}

export default class Vector2 {
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
        return new Vector2(Math.sin(degrees) * this.x, Math.cos(degrees) * this.y);
    }
}