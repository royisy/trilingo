import { db } from "../db";

export class AppSetting {
    id: number;
    selectedDeckId: number | null;

    constructor() {
        this.id = 1;
        this.selectedDeckId = null;
    }

    save() {
        db.appSettings.put(this);
    }
}
