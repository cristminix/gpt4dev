<script lang="ts">
  import type {
    ChatMessageInterface,
    ConversationInterface,
  } from "./chat-page/types";
  import UserChatMessage from "./chat-page/chat-messagess/UserChatMessage.svelte";
  import AssistantChatMessage from "./chat-page/chat-messagess/AssistantChatMessage.svelte";
  import { writable } from "svelte/store";

  export let conversation: ConversationInterface | null = null;
  export let chatMessages: ChatMessageInterface[] = [];
  export let onDeleteMessage: (id: string, groupId: string) => void;
  export let messageGroupIds: string[] = [];
  export let messageGroupId: string = "";
  export let onChangeGroupId;
  export let onRegenerateMessage;
  interface GroupedChatMessagesInterface {
    [key: string]: ChatMessageInterface[];
  }
  const groupedChatMessages = writable<GroupedChatMessagesInterface>({});

  // Fungsi untuk mengelompokkan pesan chat berdasarkan groupId
  function groupChatMessages(
    messages: ChatMessageInterface[]
  ): GroupedChatMessagesInterface {
    const grouped: GroupedChatMessagesInterface = {};

    messages.forEach((message) => {
      const groupId = message.groupId || "ungrouped";
      if (!grouped[groupId]) {
        grouped[groupId] = [];
      }
      grouped[groupId].push(message);
    });
    console.log({ grouped });
    return grouped;
  }

  // Memperbarui groupedChatMessages ketika chatMessages berubah
  $: {
    groupedChatMessages.set(groupChatMessages(chatMessages));
    setTimeout(() => {
      console.log("HSTabs.autoInit()");
      //@ts-ignore
      HSTabs.autoInit();
      autoScroll();
    }, 1000);
  }
  async function deleteMessage(messageId: string, groupId: string) {
    // Implement message deletion logic here
    console.log("Delete message with ID:", messageId);
    onDeleteMessage(messageId, groupId);
  }
  function autoScroll() {
    setTimeout(() => {
      const element = document.querySelector(".template-content");
      if (element) {
        window.scrollTo({
          top: element.scrollHeight + 200,
          behavior: "smooth", // Optional: smooth scrolling
        });
      }
    }, 1000);
  }
  // Hapus pemanggilan autoScroll otomatis
</script>

<div class="mt-3">
  <div class="relative">
    <!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
    <nav
      class="flex gap-x-1 max-w-6xl py-2 px-4 mx-auto"
      aria-label="Tabs"
      role="tablist"
      aria-orientation="horizontal"
    >
      {#each Object.keys($groupedChatMessages) as groupId}
        <button
          on:click={() => {
            onChangeGroupId(groupId);
          }}
          type="button"
          class={`hs-tab-active:bg-gray-200 hs-tab-active:text-gray-800 hs-tab-active:hover:text-gray-800 dark:hs-tab-active:bg-neutral-700 dark:hs-tab-active:text-white py-3 px-4 inline-flex items-center gap-x-2 bg-transparent text-sm font-medium text-center text-gray-500 rounded-lg hover:text-blue-600 focus:outline-hidden focus:text-blue-600 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-500 dark:hover:text-neutral-400 dark:focus:text-neutral-400 ${groupId == messageGroupId ? "active" : ""}`}
          aria-selected="true"
          data-hs-tab={`#conversation-list-${groupId}`}
          aria-controls={`conversation-list-${groupId}`}
          role="tab"
        >
          {groupId}
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
              {#each $groupedChatMessages[groupId] as message}
                {#if message.role === "user"}
                  <UserChatMessage {deleteMessage} {message} />
                {:else}
                  <AssistantChatMessage
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
