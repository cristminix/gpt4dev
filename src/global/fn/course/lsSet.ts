export const lsSet = async (key: string, value: any) => {
  let obj: any = {}
  obj[key] = value
  return new Promise((resolve, reject) => {
    chrome.storage.local.set(obj, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError)
      } else {
        resolve("Data saved successfully")
      }
    })
  })
}
