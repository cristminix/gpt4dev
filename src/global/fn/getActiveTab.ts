import browser from "webextension-polyfill"

export const getActiveTab = async () => {
  return new Promise((resolve, reject) => {
    try {
      if (import.meta.env.VITE_EXT_TARGET_BROWSER === "chrome") {
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
          resolve(tabs[0])
        })
      } else {
        browser.tabs.query({ currentWindow: true, active: true }).then((tabs) => {
          resolve(tabs[0])
        })
      }
    } catch (e) {
      resolve(null)
    }
  })
}
