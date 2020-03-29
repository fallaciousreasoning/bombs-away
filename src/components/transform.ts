import Vector2 from "../core/vector2";

export class Transform {
    type: 'transform' = 'transform';

    localPosition: Vector2;
    localRotation: number;
    localScale: Vector2 = Vector2.one;

    lockRotation: boolean;

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
        if (this.lockRotation)
          return this.localRotation;

        return this.parent ? this.parent.rotation + this.localRotation : this.localRotation;
    }

    set rotation(value: number) {
        if (this.lockRotation) {
            this.localRotation = value;
            return;
        }
        
        this.localRotation = this.parent ? value - this.parent.rotation : value;
    }

    get scale() {
        return this.parent ? this.parent.scale.mul(this.localScale) : this.localScale;
    }

    set scale(scale: Vector2) {
        if (this.parent) {
            scale = scale.div(this.parent.scale);
        }
        this.localScale = scale;
    }
}