export class Circle {
    type: 'circle' = 'circle';
    radius: number;
    color: string = 'red';

    useCameraCoords = true;

    constructor(radius: number) {
        this.radius = radius;
    }
}