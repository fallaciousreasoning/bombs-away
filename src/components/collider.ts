import Vector2 from "../core/vector2";
import { Vertices } from "../geometry/vertices";
import { Fixture } from "../collision/fixture";
import { area } from "../geometry/lineUtils";
import { fixtures } from "../systems/fixtureManager";

export class Collider {
    type: 'collider' = 'collider';

    elasticity: number;
    friction: number;

    fixtures: Fixture[];

    isTrigger?: boolean;

    color?: string;

    get area() {
        return this.fixtures.reduce((prev, next) => prev + next.vertices.area, 0);
    }
}