import LightningFs, { type Options } from "@isomorphic-git/lightning-fs"
export interface MkDirOption {
  recursive?: boolean
}

class Fs extends LightningFs {
  name = "fs"
  constructor(name: string) {
    super(name)
    this.name = name
  }
  async wipe() {
    const option: Options = {
      wipe: true,
    } as Options
    return this.init(this.name, option)
  }
  async writeFileSync(path: string, data: any) {
    return await this.promises.writeFile(path, data)
  }

  async mkdirSync(name: string, opt: MkDirOption = {}) {
    if (opt.recursive) {
      console.warn(`mkdirRecursiveSync is not implemented`)
      // return await this.mkdirRecursiveSync(name)
    }
    return await this.promises.mkdir(name)
  }

  async existsSync(path: string) {
    try {
      if (await this.statSync(path)) return true
    } catch (e) {
      // console.error(e)
      console.log(`lfs: ${path} not found`)
    }
    return false
  }
  async statSync(path: string) {
    return await this.promises.stat(path)
  }
  async readFileSync(path: string) {
    return await this.promises.readFile(path)
  }

  async unlinkSync(path: string) {
    return await this.promises.unlink(path)
  }

  async readdirSync(path: string) {
    return await this.promises.readdir(path)
  }

  // async mkdirRecursiveSync(path: string) {
  //   const parts = path.split("/")
  // }
}

export default Fs
