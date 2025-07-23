export function getTocItemStars(markup: any) {
  if (markup["*items"]) {
    return markup["*items"]
  }
  const itemStars: string[] = []
  // content v2
  if (Array.isArray(markup.items)) {
    const markupItems = markup.items
    // console.log({ markupItems })
    for (const markupItem of markupItems) {
      if (markupItem.contentV2) {
        const content = markupItem.contentV2
        if (content["*video"]) {
          itemStars.push(content["*video"])
        }
      }
    }
  }
  return itemStars
}
