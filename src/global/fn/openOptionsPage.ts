import browser from "webextension-polyfill"

async function activateOptionTab() {
  const url = chrome.runtime.getURL(`options.html`)
  const tabs = await chrome.tabs.query({ url: `${chrome.runtime.getURL("options.html")}*` })
  if (tabs.length > 0) {
    chrome.runtime.sendMessage({ action: "activateTab", url })
  } else {
    chrome.tabs.create({ url })
  }
}
export function openOptionsPage() {
  if (import.meta.env.VITE_EXT_TARGET_BROWSER === "firefox") {
    browser.runtime.openOptionsPage()
  } else {
    activateOptionTab()
  }
}
