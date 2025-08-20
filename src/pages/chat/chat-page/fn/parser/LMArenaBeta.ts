import jquery from "jquery"
export function LMArenaBeta(content: string, model: string) {
  const image_models = [
    "flux-1-kontext-pro",
    "gpt-image-1",
    "flux-1-kontext-max",
    "imagen-4.0-ultra-generate-preview-06-06",
    "imagen-3.0-generate-002",
    "ideogram-v2",
    "photon",
    "step1x-edit",
    "dall-e-3",
    "recraft-v3",
    "anonymous-bot-0514",
    "flux-1.1-pro",
    "ideogram-v3-quality",
    "imagen-4.0-generate-preview-06-06",
    "seedream-3",
    "seededit-3.0",
    "flux-1-kontext-dev",
    "bagel",
    "gemini-2.0-flash-preview-image-generation",
  ]
  if (image_models.includes(model)) {
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
