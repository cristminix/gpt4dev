<script lang="ts">
  import CodeRenderer from "../../CodeRenderer.svelte"
  import SvelteMarkdown from "svelte-markdown"
  import type { ChatMessageInterface } from "../types"

  export let deleteMessage
  export let regenerateMessage
  export let message: ChatMessageInterface
  export let userMessage: ChatMessageInterface | null
  export let groupedChatMessages: any
  export let messageGroupIds: string[] = []
  export let messageGroupId: string = ""
  export let onChangeGroupId: any
  //@ts-ignore
  let foundGroupId: string[] = []
  let groupIndex = 0
  let groupPageNumber = 1
  export function updateAnswerInfo(groupId: string) {
    console.log("Update answer info")
    if (userMessage) {
      foundGroupId = findGroupIdByMessageId(userMessage.id)
      console.log({ foundGroupId })
      if (foundGroupId.length > 0) {
        const currentGroupIndex = foundGroupId.findIndex(
          (item) => item === groupId
        )
        groupIndex = currentGroupIndex

        groupPageNumber = groupIndex + 1
      }
    }
  }
  function navigatePreviousAnswer() {
    if (userMessage) {
      foundGroupId = findGroupIdByMessageId(userMessage.id)
      console.log({ foundGroupId })
      if (foundGroupId.length > 0) {
        const currentGroupIndex = foundGroupId.findIndex(
          (item) => item === messageGroupId
        )
        groupIndex = currentGroupIndex - 1
        groupPageNumber = groupIndex + 1

        const prevGroupId = foundGroupId[groupIndex]
        console.log({ prevGroupId })
        onChangeGroupId(prevGroupId)
        // updateAnswerInfo(prevGroupId)
      }
    }
  }
  function findGroupIdByMessageId(messageId: string) {
    let foundGroupIds: string[] = []
    for (const groupId of messageGroupIds) {
      for (const message of groupedChatMessages[groupId]) {
        if (message.parentId === messageId) {
          if (!foundGroupIds.includes(groupId)) foundGroupIds.push(groupId)
        }
      }
    }
    return foundGroupIds
  }
  function navigateNextAnswer() {
    if (userMessage) {
      foundGroupId = findGroupIdByMessageId(userMessage.id)
      console.log({ foundGroupId })
      if (foundGroupId.length > 0) {
        const currentGroupIndex = foundGroupId.findIndex(
          (item) => item === messageGroupId
        )
        groupIndex = currentGroupIndex + 1
        const nextGroupId = foundGroupId[groupIndex]
        console.log({ nextGroupId })
        onChangeGroupId(nextGroupId)

        groupPageNumber = groupIndex + 1
      }
    }
  }
  $: updateAnswerInfo(messageGroupId)
</script>

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
    <ellipse cx="19" cy="18.6554" rx="3.75" ry="3.6" fill="white"></ellipse>
  </svg>

  <div class="grow max-w-[90%] w-full space-y-3">
    <!-- Card -->
    <div class="model-info pt-1">
      <h4 class="text-xl font-semibold">{message.username}</h4>
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
        <div class="py-2 px-3 inline-flex items-center gap-x-2">
          <div class="pager">
            <button
              on:click={navigatePreviousAnswer}
              aria-label="Previous message"
              class="self-center p-1 hover:bg-black/5 dark:hover:bg-white/5 dark:hover:text-white hover:text-black rounded-md transition"
              ><svg
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2.5"
                class="size-3.5"
                ><path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.75 19.5 8.25 12l7.5-7.5"
                ></path></svg
              ></button
            >
            {#if userMessage}
              <ul class="hidden">
                {#each foundGroupId as groupId}
                  <li class={groupId === messageGroupId ? "text-red-300" : ""}>
                    {groupId}
                  </li>
                {/each}
              </ul>
              {groupPageNumber}/{foundGroupId.length}
            {/if}
            <button
              on:click={navigateNextAnswer}
              class="self-center p-1 hover:bg-black/5 dark:hover:bg-white/5 dark:hover:text-white hover:text-black rounded-md transition"
              aria-label="Next message"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                aria-hidden="true"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2.5"
                class="size-3.5"
                ><path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                ></path></svg
              ></button
            >
          </div>
          <button
            type="button"
            class="py-2 px-3 inline-flex items-center gap-x-2 text-sm rounded-full border border-transparent text-gray-500 hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
            aria-label="Copy message"
          >
            <i class="fa fa-copy"></i>
          </button>
          <button
            type="button"
            class="py-2 px-3 inline-flex items-center gap-x-2 text-sm rounded-full border border-transparent text-gray-500 hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
            aria-label="Play audio"
          >
            <i class="fa fa-volume-up"></i>
          </button>
          <button
            type="button"
            class="py-2 px-3 inline-flex items-center gap-x-2 text-sm rounded-full border border-transparent text-gray-500 hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
            aria-label="Play video"
          >
            <i class="fa fa-play"></i>
          </button>
          <button
            on:click={() => regenerateMessage(message)}
            type="button"
            class="py-2 px-3 inline-flex items-center gap-x-2 text-sm rounded-full border border-transparent text-gray-500 hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
            aria-label="Refresh"
          >
            <i class="fa fa-refresh"></i>
          </button>
        </div>

        <div class="mt-1 sm:mt-0">
          {#if !message.collapsed}
            <button
              type="button"
              class="py-2 px-3 inline-flex items-center gap-x-2 text-sm rounded-full border border-transparent text-gray-500 hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
              aria-label="Collapse"
            >
              <i class="fa fa-minus"></i>
              Collapse
            </button>
          {:else}
            <button
              type="button"
              class="py-2 px-3 inline-flex items-center gap-x-2 text-sm rounded-full border border-transparent text-gray-500 hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
              aria-label="Expand"
            >
              <i class="fa fa-plus"></i>
              Expand
            </button>
          {/if}
          <button
            on:click={() => deleteMessage(message.id, message.groupId)}
            type="button"
            class="py-2 px-3 inline-flex items-center gap-x-2 text-sm rounded-full border border-transparent text-gray-500 hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
            aria-label="Delete message"
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
