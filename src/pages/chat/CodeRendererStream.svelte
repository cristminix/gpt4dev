<script lang="ts">
  export let lang = ""
  export let text = ""
  import { javascript } from "@codemirror/lang-javascript"
  import { html } from "@codemirror/lang-html"
  import { css } from "@codemirror/lang-css"
  import { oneDark } from "@codemirror/theme-one-dark"
  import { python } from "@codemirror/lang-python"
  import { rust } from "@codemirror/lang-rust"
  import hljs from "highlight.js"
  import jquery from "jquery"
  import { afterUpdate } from "svelte"
  import { v1 } from "uuid"
  let index = v1()
  const languages_maps = {
    javascript,
    html,
    typescript: javascript,
    css,
    python,
    rust,
  }
  $effect: () => {
    console.log("effect")
  }
  let origElem = ""
  function loadHighlight(lang: string) {
    // setTimeout(() => {
    const selector = `[data-index="${index}"]`
    console.log(selector)
    const el = jquery(selector)
    if (origElem.length == 0) origElem = el.clone(true)

    if (el.length > 0) {
      console.log(el)

      try {
        el.replaceWith(origElem)
        // delete el.get(0).dataset.highlighted

        // hljs.highlightElement(el.get(0))
      } catch (error) {
        console.error(error)
      }

      // }
      //
    }
    // }, 512)
  }
  // $: loadHighlight(lang)
</script>

<div class="mt-3 bg-gray-900 rounded-lg dark:bg-neutral-800">
  <div class="px-3 py-1">
    <span class="text-xs text-gray-400 dark:text-neutral-500">{lang}</span>
  </div>
  <div class="code-toolbar">
    <pre class="rounded-lg language-js"><code class="language-js">{text}</code
      ></pre>
  </div>
</div>
