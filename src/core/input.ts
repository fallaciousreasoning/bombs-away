import Vector2 from "./vector2";
import { METRES_A_PIXEL } from "../systems/addRenderer";

interface AxisInfo {
    positiveKeys: number[];
    negativeKeys?: number[];
}

const transformScreenToCanvas = (screenPosition: Vector2, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return screenPosition
        .sub(new Vector2(rect.left, rect.top))
        .mul(new Vector2(scaleX, scaleY).div(2));
}

export default class Input {
    name = 'Input';

    on: HTMLCanvasElement;

    mousePosition = new Vector2();
    private downKeys = {};

    private axes: { [name: string]: AxisInfo } = {
        horizontal: {
            positiveKeys: [ 68, 39 ],
            negativeKeys: [ 65, 37 ]
        },
        vertical: {
            positiveKeys: [ 83, 38 ],
            negativeKeys: [ 87, 40 ]
        },
        jump: {
            positiveKeys: [32, 87],
            negativeKeys: [],
        },
        shoot: {
            positiveKeys: [1]
        }
    };

    constructor(on: HTMLCanvasElement) {
        this.on = on;

        document.addEventListener("keydown", event => this.setKey(event.which, true));
        document.addEventListener("keyup", event => this.setKey(event.which, false));
        document.addEventListener("mousemove", event => this.setMousePos(event));
        document.addEventListener("mousedown", event => this.setKey(event.which, true));
        document.addEventListener("mouseup", event => this.setKey(event.which, false));
    }

    getAxis(name: string): number {
        let result = 0;
        const axisInfo = this.axes[name];

        if (axisInfo.negativeKeys && axisInfo.negativeKeys.some(k => this.downKeys[k]))
            result--;

        if (axisInfo.positiveKeys.some(k => this.downKeys[k]))
            result++;

        return result;
    }

    setKey(code: number, down: boolean) {
        this.downKeys[code] = down;
    }

    setMousePos({ x, y }: { x: number, y: number }) {
        this.mousePosition = transformScreenToCanvas(new Vector2(x, y), this.on).mul(METRES_A_PIXEL);
    }
}