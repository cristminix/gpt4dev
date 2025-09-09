import jquery from "jquery"
export function getModelConfig() {
  let modelConfig = JSON.parse(localStorage.getItem("modelConfig") || "{}")
  const uiModel = jquery("#model").val()
  const uiProvider = jquery("#provider").val()
  console.log("getModelConfig()")

  if (uiModel && uiProvider) {
    if (uiProvider.length > 0 && uiModel.length > 0) {
      if (modelConfig.model === uiModel && modelConfig.provider === uiProvider)
        return modelConfig
      else
        modelConfig = {
          model: uiModel,
          provider: uiProvider,
        }
    }
  }
  return modelConfig
}
