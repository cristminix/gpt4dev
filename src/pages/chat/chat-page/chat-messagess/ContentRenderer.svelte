<script lang="ts">
  // @ts-ignore: Could not find a declaration file for module
  import SvelteMarkdown from "../../../../libs/svelte-markdown/src/SvelteMarkdown.svelte"
  import ReactAdapter from "@/pages/demo/ReactAdapter.svelte"
  import { AnimatedMarkdown } from "flowtoken"
  //@ts-ignore
  import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism"
  import CodeRenderer from "../../CodeRenderer.svelte"
  import CodeRendererStream from "../../CodeRendererStream.svelte"
  export let content = ""
  // const platform = "animated-markdown"
  const platform = "svelte-markdown"
  export let isProcessing: boolean
</script>

{#if platform === "svelte-markdown"}
  {#if isProcessing}
    <SvelteMarkdown source={content} renderers={{ code: CodeRendererStream }} />
  {:else}
    <SvelteMarkdown source={content} renderers={{ code: CodeRenderer }} />
  {/if}
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
