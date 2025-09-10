<script lang="ts">
  import { formatTimeAgo } from "@/global/fn/formatTimeAgo"
  import type { ChatMessageInterface } from "../types"

  import ContentRenderer from "./ContentRenderer.svelte"
  import { writable } from "svelte/store"
  import { isImageModel } from "@/global/store/chat/isImageModel"
  import OverlayGalery from "./OverlayGalery.svelte"
  import jquery from "jquery"
  export let deleteMessage
  export let regenerateMessage: (message: ChatMessageInterface) => void
  export let message: ChatMessageInterface
  export let userMessage: ChatMessageInterface | null
  export let groupedChatMessages: Record<string, ChatMessageInterface[]>
  export let chatMessages: ChatMessageInterface[]
  export let messageGroupIds: string[] = []
  export let messageGroupId: string = ""
  export let onChangeGroupId: (groupId: string) => void
  export let overlayGaleryRef: OverlayGalery

  let foundGroupId: string[] = []
  let answerMessageId: Record<string, string[]> = {}
  let groupIndex = 0
  let answerPageNumber = 1
  export let displayMode: string = "default"
  const displayModeConf = writable(displayMode)

  // Fungsi untuk mendapatkan konten pesan berdasarkan ID pesan
  function getContentByMessageId(
    // _messageGroupId: string,
    messageId: string
  ): string {
    // Mencari pesan dengan ID yang sesuai dalam groupedChatMessages
    const messages = chatMessages
    // console.log({ messages, messageId })
    if (messages && Array.isArray(messages)) {
      const foundMessage = messages.find((msg) => msg.id === messageId)
      // console.log({ foundMessage })
      if (foundMessage) {
        return foundMessage.content
      }
    }
    // Jika tidak ditemukan, kembalikan string kosong
    return ""
  }

  // Fungsi utilitas untuk mendapatkan data grup
  function getGroupData() {
    if (!userMessage) return false
    const [a, g] = findGroupIdByMessageId(userMessage.id)
    foundGroupId = g
    answerMessageId = a
    // console.log({ foundGroupId })
    return foundGroupId.length > 0
  }

  export function updateAnswerInfo(groupId: string) {
    setTimeout(() => {
      // console.log(`Update answer info ${groupId}`)

      if (!userMessage) return
      if (!getGroupData()) return
      if (!foundGroupId.includes(groupId)) return
      // console.log({ foundGroupId })
      const currentGroupIndex = foundGroupId.findIndex(
        (item) => item === groupId
      )
      // groupIndex = currentGroupIndex
      let nextGroupIdSearch = messageGroupId
      let foundCurrentGroupIndex = false
      let groupIndexCursor = 0
      const currentMessageId = message.id

      for (const groupId of messageGroupIds) {
        const groupedChatMessage = groupedChatMessages[groupId]
        for (const msg of groupedChatMessage) {
          if (msg.role === "assistant") {
            if (msg.parentId === userMessage.id) {
              if (msg.id === currentMessageId) {
                if (groupIndexCursor === currentGroupIndex) {
                  foundCurrentGroupIndex = true
                  nextGroupIdSearch = groupId
                }
              }
            }
          }
          if (foundCurrentGroupIndex) {
            break
          }
        }
        if (foundCurrentGroupIndex) {
          break
        }
        groupIndexCursor += 1
      }
      // const currentGroupId = foundGroupId[groupIndexCursor]
      groupIndex = groupIndexCursor
      answerPageNumber =
        answerMessageId[userMessage.id].findIndex(
          (id) => id === currentMessageId
        ) + 1
    }, 512)
  }

  function navigatePreviousAnswer() {
    if (!userMessage) return

    if (!getGroupData()) return
    // console.log({ foundGroupId })
    const currentGroupIndex = foundGroupId.findIndex(
      (item) => item === messageGroupId
    )
    let prevGroupIdSearch = messageGroupId
    let foundPrevGroupIndex = false
    let groupIndexCursor = messageGroupIds.length - 1
    const answerIds = answerMessageId[userMessage.id]
    const currentAnswerIndex = answerPageNumber - 1
    const prevAnswerIndex = currentAnswerIndex - 1
    const currentAnswerMessageId = answerIds[currentAnswerIndex]
    const prevAnswerMessageId = answerIds[prevAnswerIndex]
    const prevAnswerPageNumber = answerPageNumber - 1

    // console.log({
    //   answerIds,
    //   currentAnswerIndex,
    //   currentAnswerMessageId,
    //   prevAnswerMessageId,
    // })
    // return
    for (const groupId of [...messageGroupIds].reverse()) {
      const groupedChatMessage = groupedChatMessages[groupId]
      for (const msg of groupedChatMessage) {
        if (msg.role === "assistant" && msg.id === prevAnswerMessageId) {
          // console.log({
          //   groupIndexCursor,
          //   currentGroupIndex,
          // })
          foundPrevGroupIndex = true
          prevGroupIdSearch = groupId
        }
        if (foundPrevGroupIndex) {
          break
        }
      }
      if (foundPrevGroupIndex) {
        break
      }
      groupIndexCursor -= 1
    }
    const prevGroupId = messageGroupIds[groupIndexCursor]

    // console.log({
    //   groupIndexCursor,
    //   foundPrevGroupIndex,
    //   prevGroupId,
    // })
    if (!foundPrevGroupIndex) return
    answerPageNumber = prevAnswerPageNumber

    groupIndex = groupIndexCursor
    onChangeGroupId(prevGroupId)
    scrollToEl()
  }

  function navigateNextAnswer() {
    if (!userMessage) return
    if (!getGroupData()) return
    // console.log({ foundGroupId })

    const currentGroupIndex = foundGroupId.findIndex(
      (item) => item === messageGroupId
    )
    let nextGroupIdSearch = messageGroupId
    let foundNextGroupIndex = false
    let groupIndexCursor = 0
    let nextMessageId = ""
    const currentMessageId = message.id

    const answerIds = answerMessageId[userMessage.id]
    const currentAnswerIndex = answerPageNumber - 1
    const nextAnswerIndex = currentAnswerIndex + 1
    const currentAnswerMessageId = answerIds[currentAnswerIndex]
    const nextAnswerMessageId = answerIds[nextAnswerIndex]
    const nextAnswerPageNumber = answerPageNumber + 1

    // console.log({
    //   currentAnswerIndex,
    //   nextAnswerIndex,
    //   currentAnswerMessageId,
    //   nextAnswerMessageId,
    //   nextAnswerPageNumber,
    // })

    for (const groupId of messageGroupIds) {
      const groupedChatMessage = groupedChatMessages[groupId]
      for (const msg of groupedChatMessage) {
        if (msg.role === "assistant" && msg.id === nextAnswerMessageId) {
          foundNextGroupIndex = true
          nextGroupIdSearch = groupId
        }
        if (foundNextGroupIndex) {
          break
        }
      }
      if (foundNextGroupIndex) {
        break
      }
      groupIndexCursor += 1
    }
    if (!foundNextGroupIndex) return
    const nextGroupId = messageGroupIds[groupIndexCursor]
    answerPageNumber = nextAnswerPageNumber
    // console.log({
    //   groupIndexCursor,
    //   foundNextGroupIndex,
    //   nextGroupId,
    //   nextMessageId,
    // })
    groupIndex = groupIndexCursor
    onChangeGroupId(nextGroupId)
    scrollToEl()
  }
  function findGroupIdByMessageId(
    messageId: string
  ): [Record<string, string[]>, string[]] {
    let foundGroupIds: string[] = []
    let answerMessageIds: Record<string, string[]> = {}
    for (const groupId of messageGroupIds) {
      if (Array.isArray(groupedChatMessages[groupId]))
        for (const message of groupedChatMessages[groupId]) {
          if (message.parentId === messageId) {
            if (!Array.isArray(answerMessageIds[messageId])) {
              answerMessageIds[messageId] = []
            }
            if (!answerMessageIds[messageId].includes(message.id)) {
              answerMessageIds[messageId].push(message.id)
            }
            if (!foundGroupIds.includes(groupId)) foundGroupIds.push(groupId)
          }
        }
    }
    // console.log()
    return [answerMessageIds, foundGroupIds]
  }

  function scrollToEl() {
    const els = document.querySelectorAll(
      `.answer-pager.message-id-${userMessage?.id}`
    )
    if (els.length > 0) {
      setTimeout(() => {
        const visibleElements = Array.from(els).filter((element) => {
          // Check if element is visible (multiple methods)
          const style = window.getComputedStyle(element)
          const htmlElement = element as HTMLElement
          return (
            htmlElement.offsetParent !== null &&
            style.display !== "none" &&
            style.visibility !== "hidden"
          )
        })

        // Scroll to the first visible element (or any specific one)
        if (visibleElements.length > 0) {
          visibleElements[0].scrollIntoView({
            // behavior: "smooth",
            block: "center",
          })
        }
      }, 128)
    }
  }

  $: {
    updateAnswerInfo(messageGroupId)
    shouldSwitchGaleryMode(message)
  }

  function shouldSwitchGaleryMode(message: ChatMessageInterface) {
    let mode = "default"
    if (message) {
      const [model, provider] = message.username.split(":")
      mode = isImageModel(model) ? "grid" : "default"
    }
    displayModeConf.update(() => mode)
  }
  function displayGaleryModal(e: Event, messageId: string) {
    console.log(messageId, e.target)
    if (overlayGaleryRef) {
      overlayGaleryRef.setContent(jquery(e.target).attr("src"))
      overlayGaleryRef.open()
    }
  }
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
    <div class="model-info pt-1 flex gap-2">
      {#if $displayModeConf === "default"}
        <h4 class="text-xl font-semibold">{message.username}</h4>
      {/if}
      <span class="message-time py-1 text-sm"
        >{formatTimeAgo(message.createdAt)}</span
      >
    </div>
    <div class="space-y-3 inner-content">
      {#if $displayModeConf === "default"}
        <ContentRenderer content={message.content} />
      {:else if userMessage}
        {#if answerMessageId[userMessage!.id]}
          {#if answerMessageId[userMessage!.id].length > 1}
            <div class="flex galery-mode">
              <ul class="galery-grid">
                {#each answerMessageId[userMessage.id] as messageId}
                  <li
                    class="galery-item"
                    on:click={(e: Event) => displayGaleryModal(e, messageId)}
                  >
                    <ContentRenderer
                      content={getContentByMessageId(messageId)}
                    />
                  </li>
                {/each}
              </ul>
            </div>
          {:else}
            <ContentRenderer content={message.content} />
          {/if}
        {/if}
      {/if}
    </div>
    <!-- End Card -->

    <!-- Button Group -->
    <div>
      <div class="sm:flex sm:justify-between">
        <div class="py-2 px-3 inline-flex items-center gap-x-2">
          {#if $displayModeConf === "default"}
            {#if userMessage}
              {#if answerMessageId[userMessage!.id]}
                {#if answerMessageId[userMessage!.id].length > 1}
                  <div class="pager answer-pager message-id-{userMessage?.id}">
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
                        {#each answerMessageId[userMessage.id] as messageId}
                          <li
                            class={messageId === message.id
                              ? "text-red-300"
                              : ""}
                          >
                            {messageId}
                          </li>
                        {/each}
                      </ul>
                      {answerPageNumber}/{answerMessageId[userMessage.id]
                        .length}
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
                {/if}
              {/if}
            {/if}
          {/if}

          <button
            type="button"
            on:click={(e) => console.log("Copy")}
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
            on:click={() => {
              // console.log("regenerate")
              regenerateMessage(message)
            }}
            type="button"
            class="py-2 px-3 inline-flex items-center gap-x-2 text-sm rounded-full border border-transparent text-gray-500 hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
            aria-label="Refresh"
          >
            <i class="fa fa-refresh"></i>
          </button>
          <button
            on:click={() => {
              // console.log("regenerate")
              const toggleMode =
                $displayModeConf === "default" ? "th" : "default"
              displayModeConf.update(() => toggleMode)
            }}
            type="button"
            class="py-2 px-3 inline-flex items-center gap-x-2 text-sm rounded-full border border-transparent text-gray-500 hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
            aria-label="View Mode"
          >
            <i
              class="fa fa-solid fa-{$displayModeConf === 'default'
                ? 'th'
                : 'list'}"
            ></i>
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
          {#if userMessage && answerMessageId[userMessage.id]}
            {#if answerMessageId[userMessage.id].length === 1}
              <button
                on:click={() => deleteMessage(message.id, message.groupId)}
                type="button"
                class="py-2 px-3 inline-flex items-center gap-x-2 text-sm rounded-full border border-transparent text-gray-500 hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                aria-label="Delete message"
              >
                <i class="fa fa-trash"></i>
                Delete
              </button>
            {/if}
          {/if}
        </div>
      </div>
    </div>
    <!-- End Button Group -->
  </div>
</li>
