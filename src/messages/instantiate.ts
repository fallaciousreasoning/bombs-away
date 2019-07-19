import { Entity } from "../entity";

export interface Instantiate {
    type: "instantiate";
    entity: Entity;
}