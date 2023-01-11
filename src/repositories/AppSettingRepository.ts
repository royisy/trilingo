import { db } from "../db";
import { AppSetting } from "../models/AppSetting";

export class AppSettingRepository {
    async get() {
        const appSetting = await db.appSettings.get(1);
        if (appSetting) {
            return appSetting;
        }
        return new AppSetting(1);
    }
}
