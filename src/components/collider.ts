import { Fixture } from "../collision/fixture";
import { AABBTree } from "../geometry/dynamicAabbTree";

export class Collider {
    type: 'collider' = 'collider';

    elasticity: number;
    friction: number;

    tree: AABBTree<Fixture>;

    private _fixtures: Fixture[];

    isTrigger?: boolean;

    color?: string;

    get area() {
        return this.fixtures.reduce((prev, next) => prev + next.vertices.area, 0);
    }

    get bounds() {
        return this.fixtures.map(f => f.transformedVertices.bounds).reduce((prev, next) => next.combine(prev));
    }

    get fixtures() {
        return this._fixtures;
    }

    set fixtures(value) {
        if (this.tree && this._fixtures) {
            this._fixtures.forEach(f => this.tree.remove(f));
        }

        this._fixtures = value as any;
        Object.freeze(this._fixtures);

        if (this.tree) {
            this._fixtures.forEach(f => this.tree.add(f));
        }
    }
}