import browser from "webextension-polyfill"
import type { OnMessageCallback } from "./types"

export const onMessage = (callback: OnMessageCallback) => {
  try {
    if (import.meta.env.VITE_EXT_TARGET_BROWSER === "chrome")
      chrome.runtime.onMessage.addListener((evt, sender) => {
        callback(evt, sender)
      })
    else {
      browser.runtime.onMessage.addListener((evt, sender) => {
        callback(evt, sender)
      })
    }
  } catch (err) {
    console.log(err)
  }
}
