<script>
  import { G4F_BACKEND_BASE_URL } from "@/global/store/config"

  export let text

  // Fungsi untuk menambahkan base URL ke path yang dimulai dengan "/media" atau "/thumbnail"
  function addBaseUrl(url) {
    if (!url) return url
    if (url.startsWith("/media") || url.startsWith("/thumbnail")) {
      return `${G4F_BACKEND_BASE_URL}${url}`
    }
    return url
  }

  // Fungsi untuk memproses atribut HTML dan menambahkan base URL jika diperlukan
  function processHtmlAttributes(htmlText) {
    // Hanya memproses tag img dan a
    let processedHtml = htmlText

    // Proses atribut src untuk tag img
    processedHtml = processedHtml.replace(
      /<img([^>]*?)src=(['"])(.*?)\2/gi,
      (match, before, quote, src) => {
        const newSrc = addBaseUrl(src)
        return `<img${before}src=${quote}${newSrc}${quote}`
      }
    )

    // Proses atribut href untuk tag a
    processedHtml = processedHtml.replace(
      /<a([^>]*?)href=(['"])(.*?)\2/gi,
      (match, before, quote, href) => {
        const newHref = addBaseUrl(href)
        return `<a${before}href=${quote}${newHref}${quote}`
      }
    )

    return processedHtml
  }

  // Proses teks HTML
  $: processedText = processHtmlAttributes(text)
</script>

{@html processedText}
