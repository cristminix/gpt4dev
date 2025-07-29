export function getConversations() {
   let conversationsStore = []
    if (localStorage) {
      for (let i = 0; i < localStorage.length; i++) {
        //@ts-ignore
        if (localStorage.key(i).startsWith("conversation:")) {
          //@ts-ignore

          const conversation = localStorage.getItem(localStorage.key(i))
          //@ts-ignore

          conversationsStore.push(JSON.parse(conversation))
        }
      }
    }
    return conversationsStore.sort((a, b) => (b.updated || 0) - (a.updated || 0))
}