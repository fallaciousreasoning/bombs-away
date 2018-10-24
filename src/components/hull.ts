import { Vertices } from "../geometry/vertices";

export default class Hull {
    type: 'hull' = 'hull';

    hull: Vertices;

    constructor(hull: Vertices){
        this.hull = hull;
    }
}