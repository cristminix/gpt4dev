import type { SqlDB } from "../classes/SqlDB"
import type DrizzleDB from "./models/DrizzleDB"
import MApp from "./models/MApp"
import MAuthor from "./models/MAuthor"
import MAuthorCourse from "./models/MAuthorCourse"
import MCourse from "./models/MCourse"
import MDMSetup from "./models/MDMSetup"
import MDMStatus from "./models/MDMStatus"
import MExerciseFile from "./models/MExerciseFile"
import MQState from "./models/MQState"
import MSection from "./models/MSection"
import MSetting from "./models/MSetting"
import MStreamLocation from "./models/MStreamLocation"
import MThumbnail from "./models/MThumbnail"
import MToc from "./models/MToc"

// Create a mapping of model names without 'm' to their classes
const models = {
  App: MApp,
  Author: MAuthor,
  Course: MCourse,
  DMSetup: MDMSetup,
  DMStatus: MDMStatus,
  ExerciseFile: MExerciseFile,
  QState: MQState,
  Section: MSection,
  Setting: MSetting,
  StreamLocation: MStreamLocation,
  Thumbnail: MThumbnail,
  Toc: MToc,
  AuthorCourse: MAuthorCourse,
} as const

export type ModelKeys = keyof typeof models

export type ReadyCallbackFn = (dbStore: DBStore) => void

class DBStore {
  ready: boolean = false
  models: DrizzleDB[] = []
  onReadyCallbacks: ReadyCallbackFn[] = []
  static instance: DBStore | null = null

  static getInstance() {
    return this.instance ?? (this.instance = new DBStore())
  }

  constructor() {
    Object.entries(models).forEach(([key, Model]) => {
      const model = new Model()
      ;(this as any)[`m${key}`] = model // Using 'm' prefix for properties
      this.models.push(model)
    })
  }

  setSqlDb(sqldb: SqlDB) {
    for (const model of this.models) model.setSqlDb(sqldb)
    setTimeout(() => {
      this.runOnReady()
      this.ready = true
    }, 256)
  }
  isReady() {
    return this.ready
  }
  runOnReady() {
    let callback: ReadyCallbackFn | undefined
    while ((callback = this.onReadyCallbacks.pop())) callback(this)
  }
  onReady(callback: ReadyCallbackFn) {
    this.onReadyCallbacks.push(callback)
  }
  get<T>(key: string): T | undefined {
    const modelKey = `m${key}`
    return (this as any)[modelKey] as T | undefined
  }
}

export default DBStore
