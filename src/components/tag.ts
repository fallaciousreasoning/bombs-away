import { Entity } from "../entity";

export class Tag {
    type: "tag" = "tag";

    tags: Set<string>;

    constructor(...tags: string[]) {
        this.tags = new Set(tags);
    }

    hasTag = (tag: string) => this.tags.has(tag);
}

export const hasTag = (entity: Entity, tag: string) => {
    const t = entity.get('tag');
    return t && t.hasTag(tag);
}