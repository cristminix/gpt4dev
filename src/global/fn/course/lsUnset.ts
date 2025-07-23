export const lsUnset = async (key: any) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.remove([key], () => {
      resolve(true)
    })
  })
}
