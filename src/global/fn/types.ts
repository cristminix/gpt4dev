import type browser from "webextension-polyfill"
import type { MessageEventInterface } from "../classes/types"

export type InjectLinkLoadCallback = (elem: HTMLLinkElement) => void
export type InjectLinkErrorCallback = (error: any) => void
export type InjectScriptLoadCallback = (elem: HTMLScriptElement) => void
export type InjectScriptErrorCallback = (error: any) => void
export type SendMessageCallback = (data: any) => void
export type MessageSender = chrome.runtime.MessageSender | browser.Runtime.MessageSender
export type OnMessageCallback = (evt: MessageEventInterface, sender: MessageSender) => void
