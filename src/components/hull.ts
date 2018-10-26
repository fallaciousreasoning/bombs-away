import { Vertices } from "../geometry/vertices";

export default class Hull {
    type: 'hull' = 'hull';

    hull: Vertices;
    color: string;

    constructor(hull: Vertices, color?: string){
        this.hull = hull;
        this.color = color || 'black';
    }
}