import { lookupDataStore } from "@/content-scripts/inject/fn/legacy/lookupDataStore"

export function findDS(key: string, value: string, source: any, props: string[], list: any) {
  return lookupDataStore(key, value, source, props, list)
}
