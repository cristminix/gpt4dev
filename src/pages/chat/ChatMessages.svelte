<script lang="ts">
  import CodeRenderer from "./CodeRenderer.svelte"
  import SvelteMarkdown from "svelte-markdown"
  export let conversation: any
</script>

{#if conversation}
  <ul class="mt-16 space-y-5">
    <!-- Chat Bubble -->
    {#each conversation.items as message}
      {#if message.role === "user"}
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
                <SvelteMarkdown source={message.content} />
              </div>
            </div>
          </div>
        </li>
      {:else}
        <li
          class="max-w-6xl py-2 px-4 sm:px-6 lg:px-8 mx-auto flex gap-x-2 sm:gap-x-4 bg-neutral-800 pt-4 rounded-md"
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
                  <div
                    class="inline-flex border border-gray-200 rounded-full p-0.5 dark:border-neutral-700"
                  >
                    <button
                      type="button"
                      class="inline-flex shrink-0 justify-center items-center size-8 rounded-full text-gray-500 hover:bg-blue-100 hover:text-blue-800 focus:z-10 focus:outline-hidden focus:bg-blue-100 focus:text-blue-800 dark:text-neutral-500 dark:hover:bg-blue-900 dark:hover:text-blue-200 dark:focus:bg-blue-900 dark:focus:text-blue-200"
                    >
                      <svg
                        class="shrink-0 size-4"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M7 10v12"></path>
                        <path
                          d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"
                        ></path>
                      </svg>
                    </button>
                    <button
                      type="button"
                      class="inline-flex shrink-0 justify-center items-center size-8 rounded-full text-gray-500 hover:bg-blue-100 hover:text-blue-800 focus:z-10 focus:outline-hidden focus:bg-blue-100 focus:text-blue-800 dark:text-neutral-500 dark:hover:bg-blue-900 dark:hover:text-blue-200 dark:focus:bg-blue-900 dark:focus:text-blue-200"
                    >
                      <svg
                        class="shrink-0 size-4"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M17 14V2"></path>
                        <path
                          d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z"
                        ></path>
                      </svg>
                    </button>
                  </div>
                  <button
                    type="button"
                    class="py-2 px-3 inline-flex items-center gap-x-2 text-sm rounded-full border border-transparent text-gray-500 hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                  >
                    <svg
                      class="shrink-0 size-4"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M17 14V2"></path>
                      <path
                        d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z"
                      ></path>
                    </svg>
                    Copy
                  </button>
                  <button
                    type="button"
                    class="py-2 px-3 inline-flex items-center gap-x-2 text-sm rounded-full border border-transparent text-gray-500 hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                  >
                    <svg
                      class="shrink-0 size-4"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <circle cx="18" cy="5" r="3"></circle>
                      <circle cx="6" cy="12" r="3"></circle>
                      <circle cx="18" cy="19" r="3"></circle>
                      <line x1="8.59" x2="15.42" y1="13.51" y2="17.49"></line>
                      <line x1="15.41" x2="8.59" y1="6.51" y2="10.49"></line>
                    </svg>
                    Share
                  </button>
                </div>

                <div class="mt-1 sm:mt-0">
                  <button
                    type="button"
                    class="py-2 px-3 inline-flex items-center gap-x-2 text-sm rounded-full border border-transparent text-gray-500 hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                  >
                    <svg
                      class="shrink-0 size-4"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path
                        d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"
                      ></path>
                      <path d="M21 3v5h-5"></path>
                    </svg>
                    New answer
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
