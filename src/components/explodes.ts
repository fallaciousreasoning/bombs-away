
type ExplosionShape = {
    type: 'circle',
    radius: number;
} | {
    type: 'box',
    width: number,
    height: number
};

export default class Explodes {
    type: "explodes" = "explodes";
    shape: ExplosionShape;
    force: number = 0;
    damage: number = 1;
    dontExplodeTag?: string;
}