import { Component } from "../components/Component";

export type Narrow<T, N> = T extends { name: N } ? T : never;
export type Names = Component['name'];

export type Entity<Components extends Names[]> = {
    id: number;
} & {
    [P in Components[0]]: Narrow<Component, P>
} & {
    [P in Components[1]]: Narrow<Component, P>
} & {
    [P in Components[2]]: Narrow<Component, P>
} & {
    [P in Components[3]]: Narrow<Component, P>
} & {
    [P in Components[4]]: Narrow<Component, P>
} & {
    [P in Components[5]]: Narrow<Component, P>
} & {
    [P in Components[6]]: Narrow<Component, P>
} & {
    [P in Components[7]]: Narrow<Component, P>
} & {
    [P in Components[8]]: Narrow<Component, P>
} & {
    [P in Components[9]]: Narrow<Component, P>
} & {
    [P in Components[10]]: Narrow<Component, P>
}

export class System<T0 extends Names,
                    T1 extends Names,
                    T2 extends Names,
                    T3 extends Names,
                    T4 extends Names,
                    T5 extends Names,
                    T6 extends Names,
                    T7 extends Names,
                    T8 extends Names,
                    T9 extends Names> {
    types: [T0?, T1?, T2?, T3?, T4?, T5?, T6?, T7?, T8?, T9?];

    constructor(types: [T0?, T1?, T2?, T3?, T4?, T5?, T6?, T7?, T8?, T9?]) {
        this.types = types;
    }

    onMessage(messageType: string, handler: (message?: any) => void) {
        this[messageType] = handler;
        return this;
    }

    on(messageType: string, handler: (entities: Entity<[T0, T1, T2, T3, T4, T5, T6, T7, T8, T9]>[], message?: any) => void) {
        this[messageType] = handler;
        return this;
    }

    onEach(messageType: string, handler: (entity: Entity<[T0, T1, T2, T3, T4, T5, T6, T7, T8, T9]>, message?: any) => void) {
        return this.on(messageType, (entities, message) => entities.forEach(e => handler(e, message)));
    }
}