<script>
  import SvelteMarkdown from "svelte-markdown"

  export let content
</script>

<li
  class="max-w-6xl py-2 px-4 sm:px-6 lg:px-8 mx-auto flex gap-x-2 sm:gap-x-4 bg-slate-700 pt-4 rounded-md"
>
  <div class="grow max-w-[95%] w-full">
    <div class="flex gap-x-2 sm:gap-x-4">
      <span
        class="shrink-0 inline-flex items-center justify-center size-9.5 rounded-full bg-gray-600"
      >
        <span class="text-sm font-medium text-white">AZ</span>
      </span>

      <div class="space-y-3 inner-content">
        <SvelteMarkdown source={content} />
      </div>
    </div>
  </div>
</li>
