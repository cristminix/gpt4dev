<script lang="ts">
  import { deleteConversation } from "@/global/store/conversation/deleteConversation"

  export let conversation
  export let routeApp
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
</script>

<div class="max-w-6xl px-4 sm:px-6 lg:px-8 mx-auto text-center bg-neutral-800">
  {#if conversation}
    <h1
      class="text-xl font-bold text-gray-400 sm:text-xl lg:text-3xl py-4 text-left"
    >
      {conversation.title}
    </h1>
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
          <button
            type="button"
            class="py-2 px-3 inline-flex items-center gap-x-2 text-sm rounded-full border border-transparent text-gray-500 hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
          >
            <i class="fa fa-edit"></i>
            Edit
          </button>
          <button
            on:click={(e) => onDeleteConversation(conversation.id)}
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
