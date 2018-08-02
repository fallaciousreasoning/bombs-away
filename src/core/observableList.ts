type ItemListener<T> = (item: T, index?: number) => void;

export class ObservableList<T> {
    items: T[] = []; 
    addListeners: ItemListener<T>[] = [];
    removeListeners: ItemListener<T>[] = [];

    on(event: 'add' | 'remove', listener: ItemListener<T>) {
        if (event === 'add') {
            this.addListeners.push(listener);
        }
        if (event === 'remove') {
            this.removeListeners.push(listener);
        }
    }

    removeListener(listener: ItemListener<T>) {
        let index = this.addListeners.indexOf(listener);
        if (index !== -1) {
            this.addListeners.splice(index, 0);
            return;
        }

        index = this.removeListeners.indexOf(listener);
        if (index !== -1) {
            this.removeListeners.splice(index, 1);
            return;
        }
    }

    constructor(items?: T[]) {
        this.items = items || [];
    }

    push(...items: T[]) {
        this.items.push(...items);
        items.forEach((item, index) => this.addListeners.forEach(listener => listener(item, index)));
    }

    pop(item: T) {
        const index = this.items.indexOf(item);
        if (index === -1) {
            return;
        }

        this.items.splice(index, 1);
        this.removeListeners.forEach(listener => listener(item, index));
    }

    forEach = this.items.forEach;
}