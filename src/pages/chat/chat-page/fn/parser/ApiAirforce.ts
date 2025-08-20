import jquery from "jquery"
export function ApiAirforce(content: string, model: string) {
  const image_models = ["sdxl", "dall-e-3", "seedream-3"]
  if (
    model.match(/flux/) ||
    model.match(/imagen/) ||
    image_models.includes(model)
  ) {
    // const exampleContent = `<a href="/media/1755478372_flux-dev+16_9+monyet_56fbb72e9b25c9ee.jpg?url=https%3A//anondrop.net/1406908681819521076/image.jpeg" data-width="1024" data-height="768" data-source=""><img src="/thumbnail/1755478372_flux-dev+16_9+monyet_56fbb72e9b25c9ee.jpg?url=https%3A//anondrop.net/1406908681819521076/image.jpeg" alt="monyet"></a>`
    const node = jquery(content)

    // Process all <a> elements
    node.find("a").each((index: number, element: HTMLElement) => {
      const href = jquery(element).attr("href")
      if (href) {
        const urlParam = getUrlParameter(href, "url")
        if (urlParam) {
          jquery(element).attr("href", urlParam)
        }
      }
    })

    // Process all <img> elements
    node.find("img").each((index: number, element: HTMLElement) => {
      const src = jquery(element).attr("src")
      if (src) {
        const urlParam = getUrlParameter(src, "url")
        if (urlParam) {
          jquery(element).attr("src", urlParam)
        }
      }
    })

    content = node.html()
  }
  return content
}

function getUrlParameter(url: string, paramName: string): string | null {
  const regex = new RegExp(`[?&]${paramName}=([^&]*)`)
  const match = url.match(regex)
  return match ? decodeURIComponent(match[1]) : null
}
