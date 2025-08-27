<script lang="ts">
  import SvelteMarkdown from "../../../../libs/svelte-markdown/src/SvelteMarkdown.svelte"
  import ReactAdapter from "@/pages/demo/ReactAdapter.svelte"
  import { AnimatedMarkdown } from "flowtoken"
  //@ts-ignore
  import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism"
  import CodeRenderer from "../../CodeRenderer.svelte"
  export let content = ""
  const platform = "svelte-markdown"
</script>

{#if platform === "svelte-markdown"}
  <SvelteMarkdown source={content} renderers={{ code: CodeRenderer }} />
{:else}
  <ReactAdapter
    el={AnimatedMarkdown}
    {content}
    animation="fadeIn"
    animationDuration="0.5s"
    animationTimingFunction="ease-in-out"
    codeStyle={dracula}
    sep="word"
    imgHeight={"100%"}
  />
{/if}
