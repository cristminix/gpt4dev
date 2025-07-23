export const lsGet = async (key: string) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([key], (result) => {
      resolve(result[key])
    })
  })
}
