<script lang="ts">
  import CodeRenderer from "./CodeRenderer.svelte"
  import SvelteMarkdown from "svelte-markdown"
  export let conversation: any

  function autoScroll() {
    setTimeout(() => {
      window.scrollTo({
        top: document.querySelector(".template-content").scrollHeight + 200,
        behavior: "smooth", // Optional: smooth scrolling
      })
    }, 1000)
  }
  $: autoScroll()
</script>

{#if conversation}
  <ul class="mt-16 space-y-5 conversation-list">
    <!-- Chat Bubble -->
    {#each conversation.items as message}
      {#if message.role === "user"}
        <li
          class="max-w-6xl py-2 px-4 sm:px-6 lg:px-8 mx-auto flex gap-x-2 sm:gap-x-4 bg-slate-700 pt-4 rounded-md conversation-item user-message"
        >
          <div class="grow max-w-[95%] w-full">
            <div class="flex gap-x-2 sm:gap-x-4">
              <span
                class="shrink-0 inline-flex items-center justify-center size-9.5 rounded-full bg-gray-600"
              >
                <span class="text-sm font-medium text-white">AZ</span>
              </span>

              <div class="space-y-3 inner-content">
                {message.content}
              </div>
            </div>
          </div>
        </li>
      {:else}
        <li
          class="max-w-6xl py-2 px-4 sm:px-6 lg:px-8 mx-auto flex gap-x-2 sm:gap-x-4 bg-neutral-800 pt-4 rounded-md conversation-item assistant-message"
        >
          <svg
            class="shrink-0 size-9.5 rounded-full"
            width="38"
            height="38"
            viewBox="0 0 38 38"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="38" height="38" rx="6" fill="#2563EB"></rect>
            <path
              d="M10 28V18.64C10 13.8683 14.0294 10 19 10C23.9706 10 28 13.8683 28 18.64C28 23.4117 23.9706 27.28 19 27.28H18.25"
              stroke="white"
              stroke-width="1.5"
            ></path>
            <path
              d="M13 28V18.7552C13 15.5104 15.6863 12.88 19 12.88C22.3137 12.88 25 15.5104 25 18.7552C25 22 22.3137 24.6304 19 24.6304H18.25"
              stroke="white"
              stroke-width="1.5"
            ></path>
            <ellipse cx="19" cy="18.6554" rx="3.75" ry="3.6" fill="white"
            ></ellipse>
          </svg>

          <div class="grow max-w-[90%] w-full space-y-3">
            <!-- Card -->
            <div class="model-info pt-1">
              {#if message.provider}
                <h4 class="text-xl font-semibold">
                  {message.provider.model}:{message.provider.label}
                </h4>
              {:else}
                <h4 class="text-xl font-semibold">Assistant</h4>
              {/if}
            </div>
            <div class="space-y-3 inner-content">
              <SvelteMarkdown
                source={message.content}
                renderers={{ code: CodeRenderer }}
              />
            </div>
            <!-- End Card -->

            <!-- Button Group -->
            <div>
              <div class="sm:flex sm:justify-between">
                <div>
                  <button
                    type="button"
                    class="py-2 px-3 inline-flex items-center gap-x-2 text-sm rounded-full border border-transparent text-gray-500 hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                  >
                    <i class="fa fa-copy"></i>
                  </button>
                  <button
                    type="button"
                    class="py-2 px-3 inline-flex items-center gap-x-2 text-sm rounded-full border border-transparent text-gray-500 hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                  >
                    <i class="fa fa-volume-up"></i>
                  </button>
                  <button
                    type="button"
                    class="py-2 px-3 inline-flex items-center gap-x-2 text-sm rounded-full border border-transparent text-gray-500 hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                  >
                    <i class="fa fa-play"></i>
                  </button>
                  <button
                    type="button"
                    class="py-2 px-3 inline-flex items-center gap-x-2 text-sm rounded-full border border-transparent text-gray-500 hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                  >
                    <i class="fa fa-refresh"></i>
                  </button>
                </div>

                <div class="mt-1 sm:mt-0">
                  <button
                    type="button"
                    class="py-2 px-3 inline-flex items-center gap-x-2 text-sm rounded-full border border-transparent text-gray-500 hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                  >
                    <i class="fa fa-minus"></i>
                    Collapse
                  </button>
                  <button
                    type="button"
                    class="py-2 px-3 inline-flex items-center gap-x-2 text-sm rounded-full border border-transparent text-gray-500 hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                  >
                    <i class="fa fa-plus"></i>
                    Expand
                  </button>
                  <button
                    type="button"
                    class="py-2 px-3 inline-flex items-center gap-x-2 text-sm rounded-full border border-transparent text-gray-500 hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                  >
                    <i class="fa fa-trash"></i>
                    Delete
                  </button>
                </div>
              </div>
            </div>
            <!-- End Button Group -->
          </div>
        </li>
      {/if}
    {/each}
  </ul>
{/if}
