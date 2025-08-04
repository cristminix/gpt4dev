<script lang="ts">
  import { deleteConversation } from "@/global/store/conversation/deleteConversation"
  import { updateConversationTitle } from "@/global/store/conversation/updateConversationTitle"
  import type { ConversationInterface } from "./chat-page/types"
  import type { RouteApp } from "@/components/RouteApp.types"
  // import updateC
  export let conversation: ConversationInterface | null = null
  export let routeApp: RouteApp
  let editMode = false
  async function onDeleteConversation(id: string) {
    if (confirm("This will also delete all messages, continue ?")) {
      console.log(`Deleting conversation data ${id}`)
      const success = await deleteConversation(id)
      if (success) {
        if (routeApp) {
          routeApp.setRoute("/chat/deleted")
        }
      }
    }
  }
  async function onUpdateConversationTitle() {
    // const title =
    // console.log(conversation.title)
    if (conversation) {
      await updateConversationTitle(conversation)
      if (routeApp) {
        routeApp.setRoute(
          `/chat/${conversation.id}?reloadSidebar=${Date.now()}`
        )
      }
    }
    editMode = false
  }
</script>

<div
  class="max-w-6xl p-4 sm:px-6 lg:px-8 mx-auto text-center bg-neutral-800 rounded-lg"
>
  {#if conversation}
    {#if !editMode}
      <h1
        class="text-xl font-bold text-gray-400 sm:text-xl lg:text-3xl py-4 text-left"
      >
        {conversation.title}
      </h1>
    {:else}
      <textarea
        class="!text-2xl p-3 sm:p-4 pb-12 sm:pb-12 block w-full bg-gray-100 border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
        placeholder="Ask me anything..."
        bind:value={conversation.title}
      >
      </textarea>
    {/if}
    <!-- Button Group -->
    <div>
      <div class="sm:flex sm:justify-between">
        <div>
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
          {#if !editMode}
            <button
              on:click={() => {
                editMode = true
              }}
              type="button"
              class="py-2 px-3 inline-flex items-center gap-x-2 text-sm rounded-full border border-transparent text-gray-500 hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
            >
              <i class="fa fa-edit"></i>
              Edit
            </button>
          {:else}
            <button
              on:click={onUpdateConversationTitle}
              type="button"
              class="py-2 px-3 inline-flex items-center gap-x-2 text-sm rounded-full border border-transparent text-gray-500 hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
            >
              <i class="fa fa-save"></i>
              Save
            </button>
          {/if}

          <button
            on:click={(e) =>
              conversation && onDeleteConversation(conversation.id)}
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
  {/if}
</div>
