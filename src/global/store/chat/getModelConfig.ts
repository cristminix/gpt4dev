export function getModelConfig() {
    return JSON.parse(localStorage.getItem("modelConfig") || "{}")
  }