import { db } from "../db";

export class AppSetting {
    id: number;
    selectedDeckId?: number;

    constructor() {
        this.id = 1;
    }

    save() {
        db.appSettings.put(this);
    }
}
