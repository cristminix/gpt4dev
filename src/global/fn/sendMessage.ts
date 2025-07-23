import { MessageEvent } from "../classes/MessageEvent"
import type { SendMessageCallback } from "./types"
import browser from "webextension-polyfill"

export const chromeSendMessage = (evt: ReturnType<typeof MessageEvent>, target: string, callback: SendMessageCallback) => {
  if (target === "content") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs.length > 0) {
        const tab = tabs[0]
        chrome.tabs.sendMessage(tab.id as number, evt, (response) => {
          if (!chrome.runtime.lastError) {
            callback && callback(response)
          } else {
            callback && callback(response)
          }
        })
      }
    })
  } else {
    chrome.runtime.sendMessage(evt, (response) => {
      if (!chrome.runtime.lastError) {
        callback && callback(response)
      } else {
        callback && callback(response)
      }
    })
  }
}
export const firefoxSendMessage = (evt: ReturnType<typeof MessageEvent>, target: string, callback: SendMessageCallback) => {
  if (target === "content") {
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      if (tabs.length > 0) {
        const tab = tabs[0]
        browser.tabs.sendMessage(tab.id as number, evt).then((response) => {
          console.log(response)
          if (!browser.runtime.lastError) {
            callback && callback(response)
          } else {
            callback && callback(response)
          }
        })
      }
    })
  } else {
    browser.runtime.sendMessage(evt).then((response) => {
      console.log(response)
      if (!browser.runtime.lastError) {
        callback && callback(response)
      } else {
        callback && callback(response)
      }
    })
  }
}
export const sendMessage = async (eventName: string, data: any = null, target: "content" | "popup" = "content", callback: SendMessageCallback = (f) => f) => {
  const evt = MessageEvent(eventName, data)
  let success = true
  try {
    if (import.meta.env.VITE_EXT_TARGET_BROWSER === "chrome") {
      chromeSendMessage(evt, target, callback)
    } else {
      firefoxSendMessage(evt, target, callback)
    }
  } catch (err) {
    console.error(err)
    success = false
  }
  return success
}
