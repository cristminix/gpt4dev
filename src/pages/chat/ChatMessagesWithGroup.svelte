<script lang="ts">
  import type {
    ChatMessageInterface,
    ConversationInterface,
  } from "./chat-page/types"
  import UserChatMessage from "./chat-page/chat-messagess/UserChatMessage.svelte"
  import AssistantChatMessage from "./chat-page/chat-messagess/AssistantChatMessage.svelte"
  import type { GroupedChatMessagesInterface } from "../types"
  import OverlayGalery from "./chat-page/chat-messagess/OverlayGalery.svelte"
  import { writable } from "svelte/store"
  import { messageId } from "@/global/store/conversation/messageStore"

  export let conversation: ConversationInterface | null = null
  export let chatMessages: ChatMessageInterface[] = []
  export let onDeleteMessage: (id: string, groupId: string) => void
  export let messageGroupIds: string[] = []
  export let messageGroupId: string = ""
  export let onChangeGroupId: (groupId: string) => void
  export let onRegenerateMessage: (message: ChatMessageInterface) => void
  export let displayMode: string = "default"
  export let groupedChatMessages
  export let showChatMessagesPager: boolean
  export let isProcessing: boolean

  let overlayGaleryRef: OverlayGalery
  // Objek untuk menyimpan referensi komponen asisten dengan key berupa message.id
  // Ini memungkinkan akses langsung ke komponen berdasarkan ID pesan
  let assistantMessages: Record<string, any> = {}
  // Fungsi untuk mengelompokkan pesan chat berdasarkan groupId
  function groupChatMessages(
    messages: ChatMessageInterface[]
  ): GroupedChatMessagesInterface {
    const grouped: GroupedChatMessagesInterface = {}

    messages.forEach((message) => {
      const groupId = message.groupId || "ungrouped"
      if (!grouped[groupId]) {
        grouped[groupId] = []
      }
      grouped[groupId].push(message)
    })
    // console.log({ grouped })
    return grouped
  }
  export function onClickChangeGroupId(groupId: string) {
    onChangeGroupId(groupId)
    // Contoh akses ke referensi komponen berdasarkan message ID
    Object.keys(assistantMessages).map((messageId) => {
      const componentRef = assistantMessages[messageId]
      if (componentRef) {
        componentRef.updateAnswerInfo(groupId)
        // console.log(
        //   `Component reference for message ${messageId}:`,
        //   componentRef
        // )
        // Anda dapat memanggil metode pada komponen jika tersedia
        // componentRef.someMethod()
      }
    })
  }

  // Memperbarui groupedChatMessages ketika chatMessages berubah
  $: {
    // assistantMessages = {}
    // setTimeout(() => {
    // groupedChatMessages.update(() => {})
    groupedChatMessages.set(groupChatMessages(chatMessages))

    // console.log("HSTabs.autoInit()")
    //@ts-ignore
    HSTabs.autoInit()
    // autoScroll()
    // }, 25)
  }
  async function deleteMessage(messageId: string, groupId: string) {
    // Implement message deletion logic here
    console.log("Delete message with ID:", messageId)
    // onDeleteMessage(messageId, groupId)
  }
  function autoScroll() {
    // setTimeout(() => {
    //   const element = document.querySelector(".template-content")
    //   if (element) {
    //     window.scrollTo({
    //       top: element.scrollHeight + 200,
    //       behavior: "smooth", // Optional: smooth scrolling
    //     })
    //   }
    // }, 1000)
  }
  // Hapus pemanggilan autoScroll otomatis
  const activeGaleryMessageId = writable("")
  function getActiveAssistantMessageRef() {
    return assistantMessages[$activeGaleryMessageId]
  }
  function onNextImage() {
    // navigateNextAnswer()
    const assistantMessageRef = getActiveAssistantMessageRef()
    if (assistantMessageRef) assistantMessageRef.setNextGaleryImage()
    // console.log("Next", $activeGaleryMessageId, nextImage)
  }
  function onPrevImage() {
    // navigatePreviousAnswer()
    const assistantMessageRef = getActiveAssistantMessageRef()
    if (assistantMessageRef) assistantMessageRef.setPrevGaleryImage()

    // console.log("Prev", $activeGaleryMessageId, prevImage)
  }
</script>

<!-- {showChatMessagesPager} -->
<OverlayGalery
  bind:this={overlayGaleryRef}
  onNext={onNextImage}
  onPrev={onPrevImage}
/>
<div class="mt-3">
  <div class="relative">
    <!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
    <!-- <div>{showChatMessagesPager ? "H" : "S"}</div> -->
    <nav
      class="chat-messages-groups-pager nice-scrollbar flex overflow-x-auto gap-x-1 max-w-6xl py-2 px-4 mx-auto {showChatMessagesPager
        ? ''
        : 'hidden'}"
      aria-label="Tabs"
      role="tablist"
      aria-orientation="horizontal"
    >
      {#each messageGroupIds as groupId, index}
        <button
          on:click={() => {
            onClickChangeGroupId(groupId)
          }}
          type="button"
          class={`hs-tab-active:bg-gray-200 hs-tab-active:text-gray-800 hs-tab-active:hover:text-gray-800 dark:hs-tab-active:bg-neutral-700 dark:hs-tab-active:text-white py-3 px-4 inline-flex items-center gap-x-2 bg-transparent text-sm font-medium text-center text-gray-500 rounded-lg hover:text-blue-600 focus:outline-hidden focus:text-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-500 dark:hover:text-neutral-400 dark:focus:text-neutral-400 ${groupId == messageGroupId ? "active" : ""}`}
          aria-selected="true"
          data-hs-tab={`#conversation-list-${groupId}`}
          aria-controls={`conversation-list-${groupId}`}
          role="tab"
        >
          {index + 1}
        </button>
      {/each}
    </nav>
    <div class="mt-3">
      {#each Object.keys($groupedChatMessages) as groupId}
        <div
          id={`conversation-list-${groupId}`}
          role="tabpanel"
          class={`${groupId == messageGroupId ? "" : "hidden"}`}
          aria-labelledby={`conversation-list-${groupId}`}
        >
          <!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
          <ul class="mt-6 space-y-5 conversation-list">
            <!-- Chat Bubble -->
            {#if $groupedChatMessages[groupId]}
              {#each $groupedChatMessages[groupId] as message, index}
                <!-- store message.id -->
                <!-- store message.parentId -->
                <!-- store previouseMessage=message -->

                {#if message.role === "user"}
                  <UserChatMessage {deleteMessage} {message} {displayMode} />
                {:else}
                  <AssistantChatMessage
                    {isProcessing}
                    {activeGaleryMessageId}
                    {overlayGaleryRef}
                    {chatMessages}
                    {displayMode}
                    bind:this={assistantMessages[message.id]}
                    groupedChatMessages={$groupedChatMessages}
                    {messageGroupId}
                    {onChangeGroupId}
                    {messageGroupIds}
                    userMessage={message.parentId ===
                    $groupedChatMessages[groupId][index - 1]?.id
                      ? $groupedChatMessages[groupId][index - 1]
                      : null}
                    {deleteMessage}
                    {message}
                    regenerateMessage={onRegenerateMessage}
                  />
                {/if}
              {/each}
            {/if}
          </ul>
        </div>
      {/each}
    </div>
  </div>
</div>
