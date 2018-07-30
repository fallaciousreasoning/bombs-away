interface Entity {
    [key: string]: object

    has: <T>(type: T & string) => boolean;
    get: <T, K extends { type: T & string }>(type: T & string) => K;
    add: <T>(type: { type: T & string}) => void;
    pop: <T>(type: string) => { type: string };
}