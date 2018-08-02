
export class Subject<T> {
    nextHandlers: ((item: T) => void)[];

    map<K>(transform: (item: T) => K) {
        const newSubject = new Subject<K>();
        this.nextHandlers.push(item => newSubject.next(transform(item)));
    }

    filter(predicate: (item: T) => boolean) {
        const newSubject = new Subject<T>();
        this.nextHandlers.push(item => {
            if (!predicate(item)) {
                return;
            }

            newSubject.next(item);
        });
    }

    reduce<To>(reducer: (prev: To, next: T) => To, initial: To) {
        const newSubject = new Subject<To>();
        let prev = initial;

        this.nextHandlers.push(item => {
            prev = reducer(prev, item);
            newSubject.next(prev);
        });
    }

    next(item: T) {
        this.nextHandlers.forEach(handler => handler(item));
    }

    subscribe(subscription: (item: T) => void) {
        this.nextHandlers.push(subscription);
        return this;
    }
}

// Engine has dictionary of events --> subscribers
// Engine.on('tick') // next(engine)
//     .with(['transform', 'box']) // next(family)
//     .subscribe(({ transform, render }) => drawOnScreen());
