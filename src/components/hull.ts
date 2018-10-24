import { ConvexHull } from "../geometry/convexHull";

export default class Hull {
    type: 'hull' = 'hull';

    hull: ConvexHull;

    constructor(hull: ConvexHull){
        this.hull = hull;
    }
}