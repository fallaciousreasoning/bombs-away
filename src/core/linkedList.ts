export class LinkListNode<T> {
    next: LinkListNode<T>;
    previous: LinkListNode<T>;

    value: T;

    constructor(value: T) {
        this.value = value;
    }
}

export class LinkedList<T> {
    head: LinkListNode<T>;
    tail: LinkListNode<T>;

    constructor(items?: T[]) {
        items && items.forEach(f => this.add(f));
    }

    find(value: T) {
        let current = this.head;
        while (current && current.value !== value)
            current = current.next;
        return current;
    }

    add(value: LinkListNode<T> | T) {
        if (!(value instanceof LinkListNode)) {
            value = new LinkListNode(value);
        }

        if (!this.head) {
            this.head = value;
            this.tail = value;
            this.length = 1;
            return;
        }

        this.tail.next = value;
        value.previous = this.tail;
        this.tail = value;

        this.length++;
    }

    remove(value: LinkListNode<T> | T) {
        if (!(value instanceof LinkListNode)) {
            value = this.find(value);
        }

        // The list doesn't contain the value.
        if (!value) {
            return;
        }

        // Remove the node from the list
        if (value.previous) {
            value.previous.next = value.next;
        }

        if (value === this.head) {
            this.head = value.next;
        }

        if (value === this.tail) {
            this.tail = value.previous;
        }

        this.length--;
    }

    length: number;

    *[Symbol.iterator]() {
        let current = this.head;
        while(current) {
            yield current.value;
            current = current.next;
        }
    }
}