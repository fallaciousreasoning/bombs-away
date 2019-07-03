import Vector2 from "./vector2";

export class AABB {
    min = Vector2.zero;
    max = Vector2.zero;

    constructor(centre: Vector2, size: Vector2) {
        this.centre = centre;
        this.size = size;
    }

    get size() {
        return new Vector2(this.width, this.height);
    }

    set size(value: Vector2) {
        this.width = value.x;
        this.height = value.y;
    }

    get width() {
        return Math.abs(this.max.x - this.min.x);
    }

    set width(value: number) {
        const centre = this.centre;
        const halfWdith = value/2;

        this.min = this.min.withX(centre.x - halfWdith);
        this.max = this.max.withX(centre.x + halfWdith);
    }

    get height() {
        return Math.abs(this.max.y - this.min.y);
    }

    set height(value: number) {
        const centre = this.centre;
        const halfHeight = value/2;

        this.min = this.min.withY(centre.y - halfHeight);
        this.max = this.max.withY(centre.y + halfHeight);
    }

    get centre() {
        return this.min.add(this.max).div(2);
    }

    set centre(value: Vector2) {
        const halfSize = new Vector2(this.width / 2, this.height / 2);
        this.min = value.sub(halfSize);
        this.max = value.add(halfSize);
    }

    get bottomLeft() {
        return new Vector2(this.min.x, this.max.y);
    }

    get topRight() {
        return new Vector2(this.max.x, this.min.y);
    }

    intersects(other: AABB) {
        return !(other.max.x <= this.min.x || other.max.y <= this.min.y || other.min.x >= this.max.x || other.min.y >= this.max.y);
    }

    contains(point: Vector2) {
        return point.x >= this.min.x && point.y >= this.min.y && point.x <= this.max.x && point.y <= this.max.y;
    }
}