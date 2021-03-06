import Vector2 from "./vector2";
import { METRES_A_PIXEL, getCamera, getWidth, getHeight } from "../systems/addRenderer";

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
        .mul(new Vector2(scaleX, scaleY));
}

const buttons = {
    mousePrimary: 1,
    mouseSecondary: 2
} as const;

type Button = keyof typeof buttons;

export default class Input {
    name = 'Input';

    on: HTMLCanvasElement;

    mousePosition = new Vector2();

    private touchCount = 0;
    private downKeys = {};
    private previousDownKeys = {};

    private axes: { [name: string]: AxisInfo } = {
        horizontal: {
            positiveKeys: [68, 39],
            negativeKeys: [65, 37]
        },
        vertical: {
            positiveKeys: [83, 38],
            negativeKeys: [87, 40]
        },
        jump: {
            positiveKeys: [32, 87],
            negativeKeys: [],
        },
        shoot: {
            positiveKeys: [69, 1]
        }
    };

    constructor(on: HTMLCanvasElement) {
        this.on = on;

        document.addEventListener("keydown", event => this.setKey(event.which, true));
        document.addEventListener("keyup", event => this.setKey(event.which, false));
        document.addEventListener("mousemove", event => this.setMousePos(event));

        const onTouchEvent = event => {
            this.setMousePos({ x: event.touches[0].screenX, y: event.touches[0].screenY });
            this.setTouches(event);
        }
        document.addEventListener('touchstart', onTouchEvent);
        document.addEventListener('touchend', onTouchEvent);
        document.addEventListener('touchcancel', onTouchEvent);
        document.addEventListener("touchmove", onTouchEvent);

        document.addEventListener("pointerdown", event => this.setKey(event.which, true));
        document.addEventListener("pointerup", event => this.setKey(event.which, false));
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

    getTouchCount() {
        return this.touchCount;
    }

    setKey(code: number, down: boolean) {
        this.downKeys[code] = down;
    }

    setMousePos(event: { x: number, y: number }) {
        this.mousePosition = transformScreenToCanvas(new Vector2(event.x, event.y), this.on)
            .mul(METRES_A_PIXEL)
            .add(getCamera().transform.position)
            .sub(new Vector2(getWidth(), getHeight()).div(2));
    }

    setTouches(touchEvent: TouchEvent) {
        this.touchCount = touchEvent.touches.length;
    }

    wasDown(button: Button) {
        if (!buttons[button])
            return;
        return this.previousDownKeys[buttons[button]];
    }

    isDown(button: Button) {
        if (!buttons[button])
            return;
        return this.downKeys[buttons[button]];
    }

    wasPressed(button: Button) {
        return this.wasDown(button) && !this.isDown(button);
    }

    tick() {
        this.previousDownKeys = { ...this.downKeys };
    }
}