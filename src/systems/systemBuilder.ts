import { Generated } from "../components/Generated";

type Narrow<T, N> = T extends { name: N } ? T : never;
type Names = Generated['name'];

type Entity<Components extends Names[]> = {
    [P in Components[0]]: Narrow<Generated, P>
} & {
    [P in Components[1]]: Narrow<Generated, P>
} & {
    [P in Components[2]]: Narrow<Generated, P>
} & {
    [P in Components[3]]: Narrow<Generated, P>
} & {
    [P in Components[4]]: Narrow<Generated, P>
} & {
    [P in Components[5]]: Narrow<Generated, P>
} & {
    [P in Components[6]]: Narrow<Generated, P>
} & {
    [P in Components[7]]: Narrow<Generated, P>
} & {
    [P in Components[8]]: Narrow<Generated, P>
} & {
    [P in Components[9]]: Narrow<Generated, P>
} & {
    [P in Components[10]]: Narrow<Generated, P>
}

class SystemBuilder<T0 extends Names,
                    T1 extends Names,
                    T2 extends Names,
                    T3 extends Names,
                    T4 extends Names,
                    T5 extends Names,
                    T6 extends Names,
                    T7 extends Names,
                    T8 extends Names,
                    T9 extends Names> {
    types: [T0, T1?, T2?, T3?, T4?, T5?, T6?, T7?, T8?, T9?];

    handlers: {
        [messageType: string]: (message: any, entities: any[]) => void;
    }

    constructor(types: [T0, T1?, T2?, T3?, T4?, T5?, T6?, T7?, T8?, T9?]) {
        this.types = types;
    }

    on(messageType: string, handler: (entities: Entity<[T0, T1, T2, T3, T4, T5, T6, T7, T8, T9]>[], message?: any) => void) {
        this.handlers[messageType] = handler;
        return this;
    }
}

export const makeSystem =
    <T0 extends Names,
     T1 extends Names=never,
     T2 extends Names=never,
     T3 extends Names=never,
     T4 extends Names=never,
     T5 extends Names=never,
     T6 extends Names=never,
     T7 extends Names=never,
     T8 extends Names=never,
     T9 extends Names=never>
    (...types: [T0, T1?, T2?, T3?, T4?, T5?, T6?, T7?, T8?, T9?]) => {
    return new SystemBuilder(types);
}