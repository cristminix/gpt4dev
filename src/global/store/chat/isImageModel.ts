import { getImageModels } from "./getImageModels"

export function isImageModel(model: string) {
  const imageModels = getImageModels()
  if (imageModels.includes(model)) {
    return true
  }
}
