export class HashSet<T extends { getHashCode: () => string | number }> {
    items = new Map<string | number, T>();
    list: T[] = [];

    add(value: T) {
        this.items.set(value.getHashCode(), value);
        this.list.push(value);
    }

    has(value: T) {
        return this.items.get(value.getHashCode());
    }

    delete(value: T) {
        this.items.delete(value.getHashCode());
        this.list.splice(this.list.indexOf(value), 1);
    }

    forEach = this.list.forEach;
}