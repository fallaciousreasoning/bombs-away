export default class ContactTracker {
    type: "contactTracker" = "contactTracker";

    contactPoints: number = 0;
    tags: string[];

    constructor(tags: string | string[]) {
        if (!Array.isArray(tags))
            tags = [tags];

        this.tags = tags;
    }

    get hasContact() {
        return this.contactPoints > 0;
    }
}