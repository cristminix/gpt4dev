import browser from "webextension-polyfill"

export function extGetUrl(url: string) {
  if (import.meta.env.VITE_EXT_TARGET_BROWSER === "chrome") {
    return chrome.runtime.getURL(url)
  } else {
    return browser.runtime.getURL(url)
  }
}
