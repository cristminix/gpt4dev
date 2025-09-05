<script>
  import { G4F_BACKEND_BASE_URL } from "@/global/store/config"

  export let href = ""
  export let title = undefined
  export let text = ""

  function getUrl(href) {
    console.log(href)
    if (href.startsWith("/media") || href.startsWith("/thumbnail")) {
      return `${G4F_BACKEND_BASE_URL}/${href}`
    }

    return `https://cloudflare-cors-anywhere.kanzululum.workers.dev/?${encodeURIComponent(href)}`
  }
</script>

<img src={getUrl(href)} {title} alt={text} />
