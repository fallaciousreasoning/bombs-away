import Vector2 from "../core/vector2";
import { Fixture } from "../collision/fixture";

interface MassData {
    mass: number;
    invMass: number;
    
    inertia: number;
    invInertia: number;

    area: number;
    centroid: Vector2;
};

const nullMass: MassData = {
    mass: 0,
    invMass: 0,
    inertia: 0,
    invInertia: 0,
    area: 0,
    centroid: Vector2.zero
};

const computeMassData = (density: number, fixture: Fixture): MassData => {
    if (density <= 0)
        return nullMass;

    let centre = Vector2.zero;
    let area = 0;
    let I = 0;

    let s = Vector2.zero;

    for (let i = 0; i < fixture.vertices.length; ++i) {
        s = s.add(fixture.vertices.getVertex(i));
    }

    s = s.div(fixture.vertices.length);

    const k_inv3 = 1 / 3;
    for (let i = 0; i < fixture.vertices.length; ++i) {
        const e1 = fixture.vertices.getVertex(i).sub(s);
        const e2 = fixture.vertices.getVertex(i + 1).sub(s);
        const D = e1.cross(e2);
        const triangleArea = D * 0.5;

        area += triangleArea;

        // Area weighted centroid.
        centre = centre.add(e1.add(e2).mul(triangleArea * k_inv3));

        const intX2 = e1.x * e1.x + e2.x * e1.x + e2.x * e2.x;
        const intY2 = e1.y * e1.y + e2.y * e1.y + e2.y * e2.y;

        I += (0.25 * k_inv3 * D) * (intX2 + intY2);
    }

    const mass = density * area;
    centre = centre.div(area);
    const centroid = centre.add(s);

    let intertia = area * I;
    intertia += mass * (Vector2.dot(centroid, centroid) - Vector2.dot(centre, centre));
    intertia = Math.abs(intertia);

    return {
        mass: mass,
        invMass: mass === 0 ? 0 : 1/mass,
        inertia: intertia,
        invInertia: intertia === 0 ? 0 : 1/intertia,
        area: area,
        centroid: centroid
    };
}

export default class Body {
    type: 'body' = 'body';

    fixedRotation = false;
    isDynamic = true;

    velocity = new Vector2();
    angularVelocity = 0;

    density: number;

    private _massData: MassData;

    constructor(density=1){
        this.density = density;
    }

    applyForce(force: Vector2, at: Vector2, invMass: number, invInertia: number=1) {
        const impulse = force.mul(invMass);
        this.velocity = this.velocity.add(impulse);

        this.angularVelocity += invInertia * at.cross(force) / 4;
    }

    // Note: This is hacky that it only takes a single fixture!
    getMassData(fixture: Fixture) {
        if (!this._massData)
          this._massData = computeMassData(this.density, fixture);

        return this._massData;
    }
}