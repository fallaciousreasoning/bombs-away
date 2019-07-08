import { Transform } from "../components/transform";
import { Vertices } from "../geometry/vertices";
import Vector2 from "../core/vector2";

export class Fixture {
    private static nextId: number = 1;

    // The id of the body that owns this. Used so we don't look at collisions with other fixtures in the same body.
    bodyId: number;

    transform: Transform;
    vertices: Vertices;

    private lastPosition: Vector2;
    private lastRotation: number;
    private lastVertices: Vertices;

    private lastLocalPosition: Vector2;
    private lastLocalRotation: number;
    private lastLocalVertices: Vertices;

    private _id: number;

    constructor(vertices?: Vertices) {
        this.vertices = vertices;
        this._id = Fixture.nextId++;
    }

    get transformedVertices() {
        if (this.lastPosition && !this.lastPosition.equals(this.transform.position)
            || this.lastRotation !== this.transform.rotation) {
            this.lastPosition = this.transform.position;
            this.lastRotation = this.transform.rotation;
            this.lastVertices = this.vertices
                .rotate(this.transform.rotation)
                .translate(this.transform.position);
        }

        return this.lastVertices;
    }

    get localTransformedVertices() {
        if (this.lastLocalPosition && !this.lastLocalPosition.equals(this.transform.localPosition)
            || this.lastLocalRotation !== this.transform.localRotation) {
            this.lastLocalPosition = this.transform.localPosition;
            this.lastLocalRotation = this.transform.localRotation;
            this.lastLocalVertices = this.vertices
                .rotate(this.transform.localRotation)
                .translate(this.transform.localPosition);
        }

        return this.lastLocalVertices;
    }

    get id() {
        return this._id;
    }
}