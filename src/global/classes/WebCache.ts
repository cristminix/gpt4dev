import type {OptionalParams} from "@/global/components/grid/types";
import {slugify} from "@/global/fn/course/slugify";
import * as idb from "idb-keyval";

const WEBCACHE_PREFIX = "WebCache_"

export class WebCache {
    key: string | null = null
    content: any | OptionalParams = null
    statusCode = 0
    url: string | null = null

    constructor(url: string) {
        this.setUrl(url)
    }
    setUrl(url: string) {
        this.url = url
        if (url) {
            this.key = `${WEBCACHE_PREFIX}${slugify(url)}`
        }
    }
    static async fromKey(key: string) {
        const data = await idb.get(key)
        return data
    }
    setContent(content: string) {
        this.content = content
    }

    setStatusCode(statusCode: number) {
        this.statusCode = statusCode
    }

    async save() {
        const { content, statusCode, url } = this
        const record = { statusCode, url, content }
        return await idb.set(this.getKey(), record)
    }

    async delete() {
        return await idb.del(this.getKey())
    }

    getKey() {
        return this.key as IDBValidKey
    }

    async remove() {
        await this.delete()
    }

    async load() {
        const key = this.getKey()
        const data = await idb.get(key)
        if (data) {
            if (data.content) {
                this.content = data.content
                this.statusCode = data.statusCode
            }
        }
    }
    getCacheContent() {
        return this.content
    }
    getStatusCode() {
        return this.statusCode
    }
    isEmpty() {
        const empty = this.content === null || typeof this.content == "undefined"
        console.log(`Empty:`, empty)
        return empty
    }
}