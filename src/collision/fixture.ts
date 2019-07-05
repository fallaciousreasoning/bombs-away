import { Transform } from "../components/transform";
import { Vertices } from "../geometry/vertices";
import Vector2 from "../core/vector2";

export class Fixture {
    // The id of the body that owns this. Used so we don't look at collisions with other fixtures in the same body.
    bodyId: number;
    
    transform: Transform;
    vertices: Vertices;

    private lastPosition: Vector2;
    private lastRotation: number;
    private lastVertices: Vertices;

    get transformedVertices() {
        if (!this.lastPosition.equals(this.transform.position)
            || this.lastRotation !== this.transform.rotation) {
            this.lastPosition = this.transform.position;
            this.lastRotation = this.transform.rotation;
            this.lastVertices = this.vertices
                .rotate(this.transform.rotation)
                .translate(this.transform.position);
        }

        return this.lastVertices;
    }
}