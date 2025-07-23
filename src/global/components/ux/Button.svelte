<script lang="ts">
  import { createEventDispatcher } from "svelte"

  export let title: string = ""
  export let label: string | null = null

  export let disabled: boolean = false
  export let loading: boolean = false
  export let icon: string = ""
  export let className: string = ""
  export let caption: string = ""

  const dispatch = createEventDispatcher()

  const handleMouseOver = (event: MouseEvent) => {
    dispatch("mouseover", event)
  }

  const handleMouseOut = (event: MouseEvent) => {
    dispatch("mouseout", event)
  }

  const handleClick = (event: MouseEvent) => {
    dispatch("click", event)
  }

  const btnCls =
    "inline-flex flex-shrink-0 justify-center items-center gap-2 p-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-white transition-all text-xs dark:bg-gray-800 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:focus:ring-gray-700 dark:focus:ring-offset-gray-800"
</script>

<button
  {title}
  on:mouseover={handleMouseOver}
  on:mouseout={handleMouseOut}
  on:click={handleClick}
  {disabled}
  type="button"
  class={`${btnCls} ${className}`}
>
  {#if loading}
    <span
      class="animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent text-blue-600 rounded-full"
      role="status"
      aria-label="loading"
    >
      <span class="sr-only">Loading...</span>
    </span>
  {/if}
  {#if icon && !loading}
    <i class={icon}></i>
  {/if}
  {#if caption}
    <span>{caption}</span>
  {/if}
</button>
