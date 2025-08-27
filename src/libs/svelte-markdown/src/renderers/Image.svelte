<script>
  export let href = ""
  export let title = undefined
  export let text = ""
</script>

<img
  src={`https://cloudflare-cors-anywhere.kanzululum.workers.dev/?${encodeURIComponent(href)}`}
  {title}
  alt={text}
/>
