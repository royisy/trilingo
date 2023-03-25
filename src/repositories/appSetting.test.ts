import { AppSetting } from '../models/AppSetting'
import { getAppSetting } from './appSetting'

describe('appSetting', () => {
  it('should create AppSetting when AppSetting is empty', async () => {
    const appSetting = await getAppSetting()
    expect(appSetting).toBeInstanceOf(AppSetting)
    expect(appSetting.id).toBe(1)
    expect(appSetting.selectedDeckId).toBeNull()
  })

  it('should get AppSetting when AppSetting is not empty', async () => {
    const newAppSetting = new AppSetting()
    newAppSetting.selectedDeckId = 1
    await newAppSetting.save()
    const appSetting = await getAppSetting()
    expect(appSetting).toBeInstanceOf(AppSetting)
    expect(appSetting.id).toBe(1)
    expect(appSetting.selectedDeckId).toBe(1)
  })
})
