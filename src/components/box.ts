export default class Box {
    type: 'box' = 'box';

    width: number;
    height: number;

    useCameraCoords: boolean = true;

    color: string;

    constructor(width: number, height?: number, color?: string){
        this.width = width;
        this.height = height || width;
        this.color = color || 'black';
    }
}