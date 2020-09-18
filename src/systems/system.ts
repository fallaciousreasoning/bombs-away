import { Component } from "../components/Component";
import { Entity } from "../entity";
import { Message } from "../messages/message";

export type Narrow<T, N> = T extends { type: N } ? T : never;

export type ComponentType = Component['type'];
export type MessageType = Message['type'];

export type Entityish<Components extends ComponentType[]> = Entity & {
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

export class System<Type extends ComponentType[]> {
    types: Type;

    constructor(...types: Type) {
        this.types = types;
    }

    private onMessageInternal<M extends MessageType>(messageType: M, handler: (entities: Entityish<Type>[], message?: Narrow<Message, M>) => void) {
        (<any>this)[messageType] = handler;
        return this;
    }

    onTargetedMessage<M extends MessageType>(messageType: M, handler: (message?: Narrow<Message, M> & { entity: Entityish<Type> }) => void) {
        return this.onMessage(messageType, message => {
            // Is this a targeted message?
            if (!('entity' in message))
                return;

            // Is this the type we expect?
            if (this.types.some(t => !message.entity.has(t)))
                return;

            // Handle the message (we know it has the appropriate type).
            handler(message as any);
        });
    }

    onMessage<M extends MessageType>(messageType: M, handler: (message?: Narrow<Message, M>) => void) {
        return this.onMessageInternal(messageType, (_, message) => handler(message));
    }

    on<M extends MessageType>(messageType: M, handler: (entities: Entityish<Type>[], message?: Narrow<Message, M>) => void) {
        return this.onMessageInternal(messageType, handler);
    }

    onEach<M extends MessageType>(messageType: M, handler: (entity: Entityish<Type>, message?: Narrow<Message, M>) => void) {
        return this.on(messageType, (entities, message) => entities.forEach(e => handler(e, message)));
    }
}
