import { db } from '../db'
import { AppSetting } from '../models/AppSetting'

export class AppSettingRepository {
  async get(): Promise<AppSetting> {
    const appSetting = await db.appSettings.toCollection().first()
    if (appSetting != null) {
      return appSetting
    }
    return new AppSetting()
  }
}

db.appSettings.mapToClass(AppSetting)
