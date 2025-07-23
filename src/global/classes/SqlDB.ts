import { extGetUrl } from "../fn/extGetUrl"
import { isBrowser } from "../fn/isBrowser"
import initSqlJs from "sql.js"

import Fs from "./Fs"
const ENABLE_DEBUG = true

export class SqlDB {
  private ready: boolean = false
  private fs: Fs | null = null
  private dbname: string | null = null
  private dir: string | null = null
  private path: string | null = null
  private sqldb: any = null

  constructor(dbname: string = "fs", dir: string = "db", path: string = "llfetcher.db") {
    this.dbname = dbname
    this.dir = dir
    this.path = path
    this.fs = new Fs(dbname)
  }
  isReady() {
    return this.ready
  }
  getDbPath() {
    return this.baseDir(this.path)
  }
  baseDir(path: string | null = null) {
    if (!path) return `/${this.dir}`
    return `/${this.dir}/${path}`
  }
  getWasmUrl(file: string) {
    return extGetUrl(`${this.dir}/${file}`)
  }
  getDBUrl(file: string) {
    return extGetUrl(`${this.dir}/${file}`)
  }
  async initDirectory() {
    try {
      if (this.fs) {
        const dbDir = this.baseDir()
        if (!(await this.fs.existsSync(dbDir))) {
          // console.log("here")
          if (ENABLE_DEBUG) console.log(`mkdir:${dbDir}`)
          await this.fs.mkdirSync(dbDir)
        }
      }
    } catch (error) {}
  }
  async loadDatabase() {
    const IS_BROWSER = isBrowser()
    const dbpath = this.getDbPath()
    try {
      if (this.fs) {
        if (!(await this.fs.existsSync(dbpath))) {
          // let filebuffer: any
          if (IS_BROWSER) {
            const dbUrl = this.getDBUrl(this.path!)
            if (ENABLE_DEBUG) console.log(`download database file: ${dbUrl}`)
            const filebuffer = await fetch(dbUrl).then((response) => response.arrayBuffer())
            await this.fs.writeFileSync(dbpath, new Uint8Array(filebuffer))
          } else {
            // INIT FOR NON BROWSER
          }
          if (ENABLE_DEBUG) console.log(`writing file: ${dbpath}`)
        } else {
          console.log(`${dbpath} exist`)
        }
        const filebuffer = await this.fs.readFileSync(dbpath)
        let sqlPromise: any
        if (IS_BROWSER) {
          sqlPromise = await initSqlJs({
            locateFile: (file) => this.getWasmUrl(file),
            // locateFile: (file) => `https://sql.js.org/dist/${file}`,
          })
        } else {
          sqlPromise = await initSqlJs()
        }

        this.sqldb = new sqlPromise.Database(filebuffer as Buffer)
        this.ready = true
      }
    } catch (error) {
      console.error(error)
    }
    return this.ready
  }
  async commit() {
    console.log(`saving sqljs to fs`)
    const arrBuffer = this.sqldb.export()
    const dbpath = this.getDbPath()
    try {
      return await this.fs?.writeFileSync(dbpath, arrBuffer)
    } catch (e) {
      console.log(`lfs:error cant write ${dbpath}`, e)
    }
    return false
  }
  async init() {
    await this.initDirectory()
    return await this.loadDatabase()
  }

  getSqlDB() {
    return this.sqldb
  }
}
