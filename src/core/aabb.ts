import Vector2 from "./vector2";

export class AABB {
    min: Vector2;
    max: Vector2;

    get width() {
        return Math.abs(this.max.x - this.min.x);
    }

    set width(value: number) {
        const centre = this.centre;
        const halfWdith = value/2;

        this.min.x = centre.x - halfWdith;
        this.max.x = centre.x + halfWdith;
    }

    get height() {
        return Math.abs(this.max.y - this.min.y);
    }

    set height(value: number) {
        const centre = this.centre;
        const halfHeight = value/2;

        this.min.y = centre.y - halfHeight;
        this.max.y = centre.y + halfHeight;
    }

    get centre() {
        return this.min.add(this.max).div(2);
    }

    set centre(value: Vector2) {
        const halfSize = new Vector2(this.width / 2, this.height / 2);
        this.min = value.sub(halfSize);
        this.max = value.add(halfSize);
    }
}