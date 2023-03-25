import { db } from '../db'
import { AppSetting } from './AppSetting'

describe('AppSetting', () => {
  it('should save AppSetting', async () => {
    const newAppSetting = new AppSetting()
    await newAppSetting.save()
    const appSettings = await db.appSettings.toArray()
    expect(appSettings).toHaveLength(1)
    expect(appSettings[0].id).toBe(1)
    expect(appSettings[0].selectedDeckId).toBeNull()
  })

  it('should update AppSetting', async () => {
    const appSetting = await db.appSettings.get(1)
    expect(appSetting).not.toBeNull()
    if (appSetting != null) {
      expect(appSetting.selectedDeckId).toBeNull()
      appSetting.selectedDeckId = 1
      await appSetting.save()
    }
    const appSettings = await db.appSettings.toArray()
    expect(appSettings).toHaveLength(1)
    expect(appSettings[0].id).toBe(1)
    expect(appSettings[0].selectedDeckId).toBe(1)
  })
})
