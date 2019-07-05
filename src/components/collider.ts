import { Fixture } from "../collision/fixture";

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