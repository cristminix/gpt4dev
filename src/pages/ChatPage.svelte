<script lang="ts">
  import { writable } from "svelte/store"

  import ChatMessages from "./chat/ChatMessages.svelte"
  import ChatPrompt from "./chat/ChatPrompt.svelte"
  import TempChatMessages from "./chat/TempChatMessages.svelte"

  export let routeApp: any
  export let params: any
  export let queryString: any
  const tempConversation = writable<any>([])
  const isProcessing = writable(false)
  let conversation = writable<any>(null)
  const promptMessages = writable([])
  const model = writable("")
  const provider = writable("")
  const userPrompt = writable("")
  function getModelConfig() {
    return JSON.parse(localStorage.getItem("modelConfig") || "{}")
  }
  function onSubmitPrompt(content: string) {
    const previousMessages = $conversation.items

    const messages = [
      ...previousMessages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
      {
        role: "user",
        content,
      },
    ]
    userPrompt.update(() => content)
    // construct messages
    // console.log(messages)
    // return
    const modelConfig = getModelConfig()
    model.update(() => modelConfig.model)
    provider.update(() => modelConfig.provider)
    promptMessages.update(() => messages)
    console.log("submit prompt", content)
    console.log(modelConfig)
    // return
    isProcessing.update(() => true)
  }
  function onProcessingDone(fullText: string) {
    setTimeout(() => {
      tempConversation.update((o) => o.concat(fullText))
      isProcessing.update(() => false)
      const newConversation = $conversation
      newConversation.items.push({
        role: "user",
        content: $userPrompt,
      })
      newConversation.items.push({
        role: "assistant",
        content: fullText,
      })
      conversation.update((o) => newConversation)
      localStorage.setItem(
        "conversation:" + $conversation.id,
        JSON.stringify(newConversation)
      )
      // // console.log("fullText", fullText)
    }, 1000)
  }
  function loadChat(id: string) {
    console.log("load chat", id)
    if (localStorage) {
      for (let i = 0; i < localStorage.length; i++) {
        //@ts-ignore
        if (localStorage.key(i).startsWith("conversation:")) {
          //@ts-ignore

          const conversationSet = JSON.parse(
            localStorage.getItem(localStorage.key(i))
          )
          //@ts-ignore
          // console.log(conversationSet)
          if (conversationSet.id === id) {
            conversation.update(() => conversationSet)
            //@ts-ignore
            // console.log(conversationSet)
            break
          }
          // conversations.push(JSON.parse(conversation))
        }
      }
    }
    if ($conversation) {
      document.title = $conversation.title
      console.log($conversation)
    }
  }
  $: loadChat(params.id)
</script>

<div class="py-10 lg:py-14">
  <div
    class="max-w-6xl px-4 sm:px-6 lg:px-8 mx-auto text-center bg-neutral-800"
  >
    {#if $conversation}
      <h1 class="text-xl font-bold text-gray-400 sm:text-xl lg:text-3xl py-4">
        {$conversation.title}
      </h1>
    {/if}
  </div>
  <ChatMessages conversation={$conversation} />
  {#if $isProcessing}
    <TempChatMessages
      conversation={$tempConversation}
      {onProcessingDone}
      messages={$promptMessages}
      model={$model}
      provider={$provider}
      conversation_id={$conversation.id}
    />
  {/if}
  <ChatPrompt {onSubmitPrompt} />
</div>
