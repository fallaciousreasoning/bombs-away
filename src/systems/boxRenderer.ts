import Box from "../components/box";
import { Transform } from "../components/transform";
import System from "./system";

export default class BoxRenderer implements System {
    types = [
        "Box",
        "Transform"
    ];

    public process({ box, transform }: { box: Box, transform: Transform }) {
        box.canvas.fillRect(transform.position.x - box.width / 2, transform.position.y - box.height / 2, box.width, box.height);
    }
}