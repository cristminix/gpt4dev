import jquery from "jquery"

// Implementasi memoisasi untuk mengurangi pemanggilan berulang
let cachedModelConfig: any = null
let lastCacheTime: number = 0
const CACHE_DURATION = 100 // 100ms cache

export function getModelConfig() {
  // console.log()
  const now = Date.now()
  // Gunakan cache jika masih valid
  if (cachedModelConfig && now - lastCacheTime < CACHE_DURATION) {
    return cachedModelConfig
  }

  let modelConfig = JSON.parse(localStorage.getItem("modelConfig") || "{}")
  const uiModel = jquery("#model").val()
  const uiProvider = jquery("#provider").val()
  // Komentari log ini untuk mengurangi output console
  // console.log("getModelConfig()")

  if (uiModel && uiProvider) {
    if (uiProvider.length > 0 && uiModel.length > 0) {
      if (
        modelConfig.model === uiModel &&
        modelConfig.provider === uiProvider
      ) {
        cachedModelConfig = modelConfig
        lastCacheTime = now
        return modelConfig
      } else {
        modelConfig = {
          model: uiModel,
          provider: uiProvider,
        }
      }
    }
  }

  cachedModelConfig = modelConfig
  lastCacheTime = now
  return modelConfig
}
