import { getM3RecByType } from "@/content-scripts/inject/fn/legacy/getM3RecByType"

export function getDsRecordsByType(type: string, ds: any) {
  let results: any[] = []
  const keys = Object.keys(ds)
  for (const key of keys) {
    const item = ds[key]
    if (item.__data) {
      if (item.__data.$type) {
        if (item.__data.$type == type) {
          // console.log(item.__data.$type == type)
          results.push(item.__data)
        }
      }
    }
  }
  // console.log(results)
  return results
}
