import type Fs from "../classes/Fs"
import { arrayBufferToBase64 } from "./arrayBufferToBase64"
import { getMimeTypeByExtension } from "./getMimeTypeByExtension"

export async function fsGetFileBase64(fs: Fs, path: string | null) {
  if (!path) return null
  if (path.length < 1) return null
  const pathSplits = path.split("/")

  const filename = pathSplits[pathSplits.length - 1]

  let buffer
  try {
    buffer = await fs.readFileSync(path)
  } catch (e) {
    console.log(`lfs: cant readFile ${path}`, e)
  }

  if (buffer) {
    try {
      let { mime } = getMimeTypeByExtension(filename)

      let output = `data:${mime};charset=utf-8;name=${filename};base64,${arrayBufferToBase64(buffer)}`

      return output
    } catch (e) {
      console.log(`Error:getFile64Data`, e)
    }
  }
  return null
}
