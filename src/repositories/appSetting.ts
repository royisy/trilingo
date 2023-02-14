import { db } from '../db'
import { AppSetting } from '../models/AppSetting'

export async function getAppSetting(): Promise<AppSetting> {
  const appSetting = await db.appSettings.toCollection().first()
  if (appSetting != null) {
    return appSetting
  }
  return new AppSetting()
}
