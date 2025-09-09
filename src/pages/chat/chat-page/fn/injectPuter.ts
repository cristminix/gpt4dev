// Deklarasi tipe untuk objek puter
interface PuterAuth {
  signIn: () => Promise<any>
}

interface PuterObject {
  auth: PuterAuth
}

// Ekstensi tipe Window untuk menyertakan properti puter
declare global {
  interface Window {
    puter?: PuterObject
  }
}

export async function injectPuter() {
  return new Promise((resolve, reject) => {
    if (window.puter) {
      resolve(window.puter)
    }
    var tag = document.createElement("script")
    tag.src = "https://js.puter.com/v2/"
    tag.onload = () => {
      if (window.puter) {
        resolve(window.puter)
        if (!localStorage.getItem("puter.auth.token")) {
          window.puter.auth.signIn().then((res) => {
            console.log("Signed in:", res)
          })
        }
      } else {
        reject(new Error("Puter object not available after script load"))
      }
    }
    tag.onerror = reject
    var firstScriptTag = document.getElementsByTagName("script")[0]
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
  })
}
