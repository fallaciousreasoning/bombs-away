const clamp = (value: number, min: number, max: number) =>
    Math.max(min, Math.min(max, value));

const toPaddedHexString = (value: number, padTo=2) => {
    let s = value.toString(16);
    const remainingChars = padTo - s.length;
    return "0".repeat(remainingChars) + s;
}

export class Color {
    static black = new Color(0, 0, 0);
    static white = new Color(255, 255, 255);

    r: number;
    g: number;
    b: number;

    constructor(r: number, g: number, b: number) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    static lerp(c1, c2, percent) {
        let r = Math.round(clamp(c1.r + (c2.r - c1.r) * percent, 0, 255));
        let g = Math.round(clamp(c1.g + (c2.g - c1.g) * percent, 0, 255));
        let b = Math.round(clamp(c1.b + (c2.b - c1.b) * percent, 0, 255));

        return new Color(r, g, b);
    }

    toHexString() {
        return `#${toPaddedHexString(this.r)}${toPaddedHexString(this.g)}${toPaddedHexString(this.b)}`
    }
}