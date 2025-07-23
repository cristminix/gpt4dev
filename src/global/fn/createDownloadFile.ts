export function createDownloadFile(content: any, filename: string) {
  const anchor = document.createElement("a")
  const objectURL = window.URL.createObjectURL(new Blob([content]))
  anchor.download = filename
  anchor.href = objectURL
  anchor.click()
}
