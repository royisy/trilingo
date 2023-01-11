import { db } from "../db";

export class AppSetting {
    id: number;
    selectedDeckId?: number;

    constructor(id: number) {
        this.id = id;
    }

    save() {
        db.appSettings.put(this);
    }
}
