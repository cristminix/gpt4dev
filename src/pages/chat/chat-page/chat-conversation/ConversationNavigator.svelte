<script lang="ts">
  import { onMount } from "svelte"
  import Link from "@/global/components/ux/Link.svelte"
  import jquery from "jquery"
  import { writable } from "svelte/store"
  import { getConversations } from "@/global/store/conversation/getConversations"
  import type { ConversationInterface } from "@/pages/chat/chat-page/types"
  import { getCurrentUser } from "@/global/store/auth/getCurrentUser"
  export let routeApp: any
  const conversations = writable<ConversationInterface[]>([])
  let lastRoutePath = ""

  async function loadConversations() {
    const currentUser = await getCurrentUser()
    const conversationList = await getConversations(currentUser.id)
    conversations.update(() => conversationList)

    setTimeout(() => {
      // Inisialisasi accordion jika diperlukan
      activateConversationBtnStyles()
      triggerWindowResize()
    }, 512)
  }

  function updateConversationList() {
    conversations.update(() => [])
    setTimeout(() => {
      loadConversations()
    }, 32)
  }

  function triggerWindowResize() {
    setTimeout(() => {
      jquery(window).trigger("resize")
    }, 1000)
  }

  function activateConversationBtnStyles() {
    setTimeout(() => {
      if (routeApp) {
        const [path, queryString] = routeApp.getRoute()
        if (path.startsWith("/chat")) {
          for (const elem of jquery(`.conversation-item-button`)) {
            if (
              jquery(elem).attr("href") === path ||
              jquery(elem).attr("href") === `#${path}`
            ) {
              jquery(elem).addClass("active")
            } else {
              jquery(elem).removeClass("active")
            }
          }
        }
      }
    }, 15)
  }

  onMount(() => {
    loadConversations()
    let resizeTimeout: number | null = null
    jquery(window)
      .on("resize", () => {
        if (resizeTimeout) {
          clearTimeout(resizeTimeout)
        }
        resizeTimeout = setTimeout(() => {
          const conversationListContainer = jquery(
            "#conversation-accordion-child"
          )
          const appBannerContainer = jquery("#appBannerContainer")
          const conversationTopButtonContainer = jquery(
            "#conversationTopButtonContainer"
          )
          const windowHeight = window.innerHeight - 80
          const appBannerHeight = appBannerContainer.height()
          const conversationTopButtonContainerHeight =
            conversationTopButtonContainer.height()
          const conversationListContainerHeight =
            windowHeight -
            appBannerHeight -
            conversationTopButtonContainerHeight
          conversationListContainer.height(conversationListContainerHeight)
        }, 512) as unknown as number
      })
      .resize()

    triggerWindowResize()
    setTimeout(() => {
      if (routeApp) {
        lastRoutePath = routeApp.getRoute()[0]
        routeApp.addRouteChangeCallback(
          (path: string, qs: string) => {
            activateConversationBtnStyles()
            if (lastRoutePath === "/chat/new") {
              updateConversationList()
            }
            if (path === "/chat/deleted") {
              updateConversationList()
              routeApp.setRoute("/chat/new")
            }
            if (qs) {
              if (qs.match(/reloadSidebar/)) {
                updateConversationList()
              }
            }
            lastRoutePath = path
          },
          "sidebar",
          true
        )
      }
    }, 512)
  })
</script>

<ul class="overflow-hidden grow">
  <li class="hs-accordion" id="conversations-accordion">
    <button
      type="button"
      class="hs-accordion-toggle w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:text-neutral-200"
      aria-expanded="false"
      aria-controls="projects-accordion-child"
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
        <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
      Conversation

      <svg
        class="hs-accordion-active:block ms-auto hidden size-4"
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
        <path d="m18 15-6-6-6 6" />
      </svg>

      <svg
        class="hs-accordion-active:hidden ms-auto block size-4"
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
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>

    <div
      id="conversation-accordion-child"
      class="hs-accordion-content w-full transition-[height] duration-300 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100
      [&::-webkit-scrollbar-thumb]:bg-gray-300
      dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
      role="region"
      aria-labelledby="conversation-accordion"
    >
      <ul class=" pt-1 space-y-1">
        {#each $conversations as conversation}
          <li>
            <Link
              title={conversation.title}
              {routeApp}
              to={`/chat/${conversation.id}`}
              className="conversation-item-button flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:text-neutral-300"
            >
              <span class="w-[13rem] overflow-hidden whitespace-nowrap truncate"
                >{conversation.title}</span
              >
            </Link>
          </li>
        {/each}
      </ul>
    </div>
  </li>
</ul>
