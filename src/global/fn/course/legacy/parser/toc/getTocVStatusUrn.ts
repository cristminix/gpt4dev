export function getTocVStatusUrn(markup: any) {
  let vStatusUrn = markup["*lyndaVideoViewingStatus"]
  if (!vStatusUrn) {
    vStatusUrn = markup["*interactionStatusV2"]
  }
  return vStatusUrn
}
