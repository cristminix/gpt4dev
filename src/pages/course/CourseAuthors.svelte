<script lang="ts">
  import type { TAuthor } from "@/global/db/models/schema"
  import { authorUrlFromSlug } from "@/global/fn/course/authorUrlFromSlug"

  export let authors: TAuthor[] = []
  export let noLinks: boolean = false
</script>

<div class={`mb-2 flex ${!noLinks ? "text-lg" : "text-md"}`}>
  <span class="italic mr-1">By</span>
  {#each authors as author, index}
    <h4>
      <a href={authorUrlFromSlug(author.slug)} target="_blank">
        {author.name} <i class="fa fa-external-link" />
      </a>
      {#if index < authors.length - 1}
        <span class="mr-1">,</span>
      {/if}
      {#if index === authors.length - 1}
        <span></span>
      {/if}
    </h4>
  {/each}
</div>
