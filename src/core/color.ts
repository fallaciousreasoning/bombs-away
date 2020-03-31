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
    static red = new Color(255, 0, 0);
    static green = new Color(0, 255, 0);
    static blue = new Color(0, 0, 255);
    static limegreen = new Color(50, 205, 50);
    static purple = new Color(90, 0, 90);
    static yellow = new Color(255, 255, 0);
    static lightblue = new Color(81, 126, 160);
    static transparent = new Color(0, 0, 0, 0);

    r: number;
    g: number;
    b: number;
    a: number;

    private _asHex: string;
    get hex() {
        if (!this._asHex)
            this._asHex = `#${toPaddedHexString(this.r)}${toPaddedHexString(this.g)}${toPaddedHexString(this.b)}${toPaddedHexString(this.a)}`;
        return this._asHex;
    }

    constructor(r: number, g: number, b: number, a = 255) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    static lerp(c1, c2, percent) {
        let r = Math.round(clamp(c1.r + (c2.r - c1.r) * percent, 0, 255));
        let g = Math.round(clamp(c1.g + (c2.g - c1.g) * percent, 0, 255));
        let b = Math.round(clamp(c1.b + (c2.b - c1.b) * percent, 0, 255));
        let a = Math.round(clamp(c1.a + (c2.a - c1.a) * percent, 0, 255));
        return new Color(r, g, b, a);
    }
}