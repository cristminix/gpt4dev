<script>
  export let href = ""
  export let title = undefined
  // console.log(href)

  // Function to detect YouTube URL and extract video ID
  $: isYouTube =
    /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/.test(
      href
    )
  $: youtubeId = isYouTube
    ? href.match(
        /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
      )[3]
    : null

  // Function to detect TikTok URL and extract video ID
  // First convert %40 to @ in href
  $: processedHref = href.replace(/%40/g, "@")
  $: isTikTok = /^https?:\/\/(www\.)?tiktok\.com\/@[\w.-]+\/video\/(\d+)/.test(
    processedHref
  )
  $: tiktokId = isTikTok
    ? processedHref.match(
        /^https?:\/\/(www\.)?tiktok\.com\/@[\w.-]+\/video\/(\d+)/
      )[2]
    : null
</script>

{#if isYouTube}
  <a target="_blank" {href} {title}><slot></slot></a>
  <div class="youtube-embed-container my-4 rounded-lg">
    <iframe
      class="youtube-embed"
      src="https://www.youtube.com/embed/{youtubeId}"
      {title}
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    >
    </iframe>
  </div>
{:else if isTikTok}
  <a target="_blank" {href} {title}><slot></slot></a>

  <div class="tiktok-embed-container my-4 rounded-lg">
    <iframe
      class="tiktok-embed"
      src="https://www.tiktok.com/embed/v2/{tiktokId}"
      {title}
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    >
    </iframe>
  </div>
{:else}
  <a target="_blank" {href} {title}><slot></slot></a>
{/if}

<style>
  .youtube-embed-container,
  .tiktok-embed-container {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 56.25%; /* 16:9 aspect ratio */
  }

  .youtube-embed,
  .tiktok-embed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>
