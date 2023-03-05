import { db } from '../db'

export class AppSetting {
  id: number
  selectedDeckId: number | null

  constructor() {
    this.id = 1
    this.selectedDeckId = null
  }

  async save(): Promise<void> {
    await db.appSettings.put(this)
  }
}

db.appSettings.mapToClass(AppSetting)
