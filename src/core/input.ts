import Component from "../components/component";
import Vector2 from "./vector2";

interface AxisInfo {
    positiveKeys: number[];
    negativeKeys: number[];
}

export default class Input implements Component {
    name = 'Input';

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
        }
    };

    constructor(on: HTMLElement) {
        on.addEventListener("keydown", event => this.setKey(event.keyCode, true));
        on.addEventListener("keyup", event => this.setKey(event.keyCode, false));
        on.addEventListener("mousemove", event => this.setMousePos(event));
    }

    getAxis(name: string): number {
        let result = 0;
        const axisInfo = this.axes[name];

        if (axisInfo.negativeKeys.some(k => this.downKeys[k]))
            result--;

        if (axisInfo.positiveKeys.some(k => this.downKeys[k]))
            result++;

        return result;
    }

    setKey(code: number, down: boolean) {
        this.downKeys[code] = down;
    }

    setMousePos({ x, y }: { x: number, y: number }) {
        this.mousePosition = new Vector2(x, y);
    }
}