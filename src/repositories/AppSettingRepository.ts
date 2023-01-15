import { db } from "../db";
import { AppSetting } from "../models/AppSetting";

export class AppSettingRepository {
    async get() {
        const appSetting = await db.appSettings.toCollection().first();
        if (appSetting) {
            return appSetting;
        }
        return new AppSetting();
    }
}
