<script>
  import { setContext, createEventDispatcher, onMount } from "svelte"
  import Parser from "./Parser.svelte"
  import { Lexer, defaultOptions, defaultRenderers } from "./markdown-parser"
  import { key } from "./context"

  export let source = []
  export let renderers = {}
  export let options = {}
  export let isInline = false

  const dispatch = createEventDispatcher()

  let tokens
  let lexer
  let mounted

  $: preprocessed = Array.isArray(source)
  $: combinedOptions = { ...defaultOptions, ...options }

  // Simple slug function to replace Slugger
  const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/[^\w\-]+/g, "") // Remove all non-word chars
      .replace(/\-\-+/g, "-") // Replace multiple - with single -
      .replace(/^-+/, "") // Trim - from start of text
      .replace(/-+$/, "") // Trim - from end of text
  }
  $: if (preprocessed) {
    tokens = source
  } else {
    lexer = new Lexer(combinedOptions)

    tokens = isInline ? lexer.inlineTokens(source) : lexer.lex(source)

    dispatch("parsed", { tokens })
  }

  $: combinedRenderers = { ...defaultRenderers, ...renderers }

  setContext(key, {
    slug: (val) => slugify(val),
    getOptions: () => combinedOptions,
  })
  $: mounted && !preprocessed && dispatch("parsed", { tokens })

  onMount(() => {
    mounted = true
  })
</script>

<Parser {tokens} renderers={combinedRenderers} />
