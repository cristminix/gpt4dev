export function getConversation(id: string) {
  if (localStorage) {
      for (let i = 0; i < localStorage.length; i++) {
        //@ts-ignore
        if (localStorage.key(i).startsWith("conversation:")) {
          //@ts-ignore

          const conversationSet = JSON.parse(
            //@ts-ignore
            localStorage.getItem(localStorage.key(i))
          )
          //@ts-ignore
          // console.log(conversationSet)
          if (conversationSet.id === id) {
            return conversationSet
            //@ts-ignore
            // console.log(conversationSet)
            break
          }
          // conversations.push(JSON.parse(conversation))
        }
      }
    }
    return null; // Return null if no conversation found with the given ID
}