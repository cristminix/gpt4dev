<script lang="ts">
  // import { onMount } from "svelte";
  // import { goto } from '@sveltejs/kit/navigation';

  export let limit: number
  export let total_pages: number
  export let page: number
  export let path: string = ""
  export let onRefresh: (e: Event, setLoading: (loading: boolean) => void) => void

  let isLoading = false

  const hasPrev = (page_number: number): boolean => {
    if (!total_pages) return false
    if (page_number > total_pages) return false
    return page_number > 1
  }

  const hasNext = (page_number: number): boolean => {
    if (!total_pages) return false
    if (page_number > total_pages) return false
    return page_number < total_pages
  }

  const forPages = (): number[] => {
    return Array.from({ length: total_pages }, (_, i) => i + 1)
  }
  function goto(path: string) {
    console.log(path)
  }
</script>

<nav class="flex items-center place-content-center space-x-2">
  {#if hasPrev(page)}
    <a
      class="text-gray-500 hover:text-blue-600 p-4 inline-flex items-center gap-2 rounded-md"
      href={`${path}/page/${page - 1}`}
      on:click={(e) => {
        e.preventDefault()
        goto(`${path}/page/${page - 1}`)
      }}
    >
      <span aria-hidden="true">«</span>
      <span>Sebelum</span>
    </a>
  {/if}
  {#each forPages() as page_number, index}
    {#if page_number === page}
      <a
        class="w-10 h-10 bg-blue-500 text-white p-4 inline-flex items-center text-sm font-medium rounded-full"
        aria-current="page"
        href={`${path}/page/${page_number}`}
        on:click={(e) => {
          e.preventDefault()
          goto(`${path}/page/${page_number}`)
        }}
      >
        {page_number}
      </a>
    {:else}
      <a
        href={`${path}/page/${page_number}`}
        class="w-10 h-10 text-gray-500 hover:text-blue-600 p-4 inline-flex items-center text-sm font-medium rounded-full"
        on:click={(e) => {
          e.preventDefault()
          goto(`${path}/page/${page_number}`)
        }}
      >
        {page_number}
      </a>
    {/if}
  {/each}
  {#if hasNext(page)}
    <a
      class="text-gray-500 hover:text-blue-600 p-4 inline-flex items-center gap-2 rounded-md"
      href={`${path}/page/${page + 1}`}
      on:click={(e) => {
        e.preventDefault()
        goto(`${path}/page/${page + 1}`)
      }}
    >
      <span>Berikutnya</span>
      <span aria-hidden="true">»</span>
    </a>
  {/if}
  {#if typeof onRefresh === "function"}
    <button class={"btn-blue pl-[14px] rounded-full " + (isLoading ? "animate-spin" : "")} on:click={(e) => onRefresh(e, (loading) => (isLoading = loading))}>
      <i class="bi bi-arrow-repeat" />
    </button>
  {/if}
</nav>

<style>
  .btn-blue {
    background-color: #007bff;
    color: white;
    padding: 0.375rem 0.75rem;
    border: 1px solid transparent;
    border-radius: 0.25rem;
  }
  .btn-blue:hover {
    background-color: #0056b3;
  }
  .animate-spin {
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
