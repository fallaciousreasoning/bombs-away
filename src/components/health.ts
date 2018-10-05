export default class Health {
    type: "health" = "health";
    health: number;

    constructor(health: number) {
        this.health = health;
    }
}