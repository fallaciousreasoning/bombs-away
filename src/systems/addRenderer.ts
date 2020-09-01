import { Color } from "../core/color";
import { Engine } from "../engine";
import { canvas, context } from "../game";
import { Entityish } from "./system";
import { Entity } from "../entity";
import { Transform } from "../components/transform";
import { Camera } from "../components/camera";

export const PIXELS_A_METRE = 64;
export const METRES_A_PIXEL = 1 / PIXELS_A_METRE;

export const getWidth = () => canvas.width * METRES_A_PIXEL;
export const getHeight = () => canvas.height * METRES_A_PIXEL;

let camera: Entityish<['camera', 'transform']> = new Entity().add(new Transform).add(new Camera);
export const getCamera = () => camera;
export const useCamera = () => {
    context.setTransform(1, 0, 0, 1, -getCamera().transform.position.x * PIXELS_A_METRE + canvas.width / 2,
        -getCamera().transform.position.y * PIXELS_A_METRE + canvas.height / 2);
}

export const useGameView = () => {
    useCamera();
    context.scale(PIXELS_A_METRE, PIXELS_A_METRE);
}

export default function addRenderer(engine: Engine, clearColor: Color = Color.white) {
    const context = canvas.getContext('2d');

    engine.makeSystem('camera', 'transform')
        .onEach('tick', entity => {
            camera = entity;
            (context as any).resetTransform();
            context.fillStyle = clearColor.hex;
            context.fillRect(0, 0, canvas.width, canvas.height)
        });
}