<script lang="ts">
  export let lang = ""
  export let text = ""

  import hljs from "highlight.js"
  import jquery from "jquery"
  import svelte from "highlight.svelte"
  import "highlight.js/styles/github-dark.css"

  hljs.registerLanguage("svelte", svelte)

  async function loadHighlight(lang: string) {
    // hljs.registerLanguage(
    //   lang,
    //   await import(`highlight.js/lib/languages/${lang}`)
    // )
    setTimeout(() => {
      document.querySelectorAll("pre code").forEach((el) => {
        if (!jquery(el).attr("data-highlighted")) {
          hljs.highlightElement(el)
        }
      })
    }, 1000)
  }
  $: loadHighlight(lang)
</script>

<!-- <div class="bg-gray-800 rounded-md p-2 editor">
  <div class="lang-display">
    {lang}
  </div>
  <CodeMirror
    bind:value={text}
    lang={languages_maps[lang] ? languages_maps[lang]() : undefined}
    theme={oneDark}
  />
</div> -->
<div class="my-3 bg-gray-900 rounded-lg dark:bg-neutral-800">
  <!-- <div class="px-3 py-1">
    <span class="text-xs text-gray-400 dark:text-neutral-500">{lang}</span>
  </div> -->
  <div class="code-toolbar">
    <pre class="rounded-lg" tabindex="0"><code class="language-{lang}"
        >{text}</code
      ></pre>
    <div class="toolbar">
      <div class="toolbar-item">
        <button
          class="copy-to-clipboard-button"
          type="button"
          data-copy-state="copy"><span>Copy</span></button
        >
      </div>
    </div>
  </div>
</div>
