import Vector2 from "../core/vector2";

export class Transform {
    type: 'transform' = 'transform';

    localPosition: Vector2;
    localRotation: number;

    parent: Transform;

    constructor(position?: Vector2, rotation?: number, parent?: Transform){
        this.localPosition = position || new Vector2();
        this.localRotation = rotation || 0;
        this.parent = parent;
    }

    get position() {
        return this.parent ? this.parent.position.add(this.localPosition) : this.localPosition; 
    }

    set position(value: Vector2) {
        this.localPosition = this.parent ?  value.sub(this.parent.position) : value;
    }

    get rotation() {
        return this.parent ? this.parent.rotation + this.localRotation : this.localRotation;
    }

    set rotation(value: number) {
        this.localRotation = this.parent ? value - this.parent.rotation : value;
    }
}