export default class ContactTracker {
    type: "contactTracker" = "contactTracker";

    contactPoints: number = 0;
    tags: string[];
    ignoreTags: boolean;

    constructor(tags: string | string[], ignoreTags: boolean = false) {
        if (!Array.isArray(tags))
            tags = [tags];

        this.tags = tags;
        this.ignoreTags = ignoreTags;
    }

    get hasContact() {
        return this.contactPoints > 0;
    }
}