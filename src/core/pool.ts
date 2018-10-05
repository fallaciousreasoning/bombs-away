export class Pool<T> {
    protected create: () => T;
    protected reset: (item: T) => void;

    protected available: T[];

    constructor(create: () => T, reset: (item: T) => void) {
        this.create = create;
        this.reset = reset;
    }

    get() {
        const item = this.available.pop() || this.create();
        this.reset(item);
        return item;
    }

    release(item: T) {
        this.available.push(item);
    }
}