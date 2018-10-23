export class Tag {
    type: "tag" = "tag";

    tags: Set<string>;

    constructor(...tags: string[]) {
        this.tags = new Set(tags);
    }

    hasTag = (tag: string) => this.tags.has(tag);
}