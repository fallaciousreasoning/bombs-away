import Vector2 from "../core/vector2";
import Component from "./component";

export class Transform implements Component {
    name = 'transform';

    private _position: Vector2;
    private _rotation: number;

    parent: Transform;

    constructor(position?: Vector2, rotation?: number, parent?: Transform){
        this._position = position || new Vector2();
        this._rotation = rotation || 0;
        this.parent = parent;
    }

    get position() {
        return this.parent ? this.parent.position.add(this._position) : this._position; 
    }

    set position(value: Vector2) {
        this._position = this.parent ?  value.sub(this.parent.position) : value;
    }

    get rotation() {
        return this.parent ? this.parent.rotation + this._rotation : this._rotation;
    }

    set rotation(value: number) {
        this._rotation = this.parent ? value - this.parent.rotation : value;
    }
}