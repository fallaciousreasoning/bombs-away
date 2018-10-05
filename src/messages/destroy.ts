import { Entity } from "../entity";

export interface Destroy {
    type: "destroy";
    entity: Entity;
}