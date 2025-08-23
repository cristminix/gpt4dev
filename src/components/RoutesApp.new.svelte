<script lang="ts">
  import { writable } from "svelte/store"
  import * as idb from "idb-keyval"
  import { onMount } from "svelte"

  // Gunakan routing berbasis hash untuk tab independen
  const USE_HASH_ROUTER = true
  
  const savedUrl = writable("")
  const lastPath = writable("")
  const lastQueryString = writable<string | null>(null)
  const pathname = writable("")
  const queryString = writable<string | null>("")
  export const setUrl = (targetUrl: string) => {
    // Simpan ke IndexedDB hanya jika tidak menggunakan hash router
    if (!USE_HASH_ROUTER) {
      idb.set("route.url", targetUrl)
    }
    
    // Update state lokal
    savedUrl.set(targetUrl)
    const [path, _queryString] = getRoute(targetUrl)
    pathname.set(path)
    queryString.set(_queryString)
    
    // Jika menggunakan hash router, update hash browser
    if (USE_HASH_ROUTER) {
      // Hapus hash jika sudah ada dan tambahkan yang baru
      const newHash = targetUrl.startsWith('#') ? targetUrl.substring(1) : targetUrl
      const currentHash = document.location.hash.substring(1)
      if (currentHash !== newHash) {
        // Tambahkan flag untuk menandai bahwa perubahan ini berasal dari kode
        (window as any)._updatingHashFromCode = true
        document.location.hash = `#${newHash}`
        setTimeout(() => {
          (window as any)._updatingHashFromCode = false
        }, 0)
      }
    }
  }
  export const setRoute = (newUrl: string) => {
    setUrl(newUrl)
  }
  export function useLocation() {
    return {
      url: $savedUrl,
      pathname: $pathname,
      queryString: $queryString,
    }
  }
  export const getRoute = (
    url: string | null = null
  ): [string, string | null] => {
    const currentUrl = !url ? $savedUrl : url
    const routeSplit = currentUrl.split("?")

    let path: string = ""
    let queryString: string | null = null
    path = routeSplit[0]

    if (routeSplit.length > 1) {
      queryString = routeSplit[1]
    }
    return [path, queryString]
  }
  let routeChangeCallbacks: any = {}
  let routeChangeCallbacksKeep: any = {}
  export const addRouteChangeCallback = (
    callback: any,
    key: string,
    keep = false
  ) => {
    routeChangeCallbacks[key] = callback
    routeChangeCallbacksKeep[key] = keep
  }
  export let onRouteChange = (path: string, queryString: string | null) => {
    // Trigger semua route change callbacks yang terdaftar
    triggerRouteChange(path, queryString)
  }
  export function triggerRouteChange(path: string, queryString: string | null) {
    Object.keys(routeChangeCallbacks).forEach((key) => {
      try {
        routeChangeCallbacks[key](path, queryString)
      } catch (error) {
        console.error('Error calling callback for key:', key, error)
      }
    })
  }
  export function triggerRouteChangeKey(inputKey: string) {
    if (routeChangeCallbacks[inputKey]) {
      routeChangeCallbacks[inputKey]($savedUrl, $queryString)
    }
  }
  savedUrl.subscribe((value) => {
    const [path, queryString] = getRoute(value)
    lastPath.set(path)
    lastQueryString.set(queryString)
    
    // Hanya update hash jika menggunakan hash router dan nilai berbeda
    if (USE_HASH_ROUTER) {
      const currentHash = document.location.hash.substring(1)
      if (currentHash !== value) {
        // Jangan update hash jika ini adalah event hashchange yang sudah diproses
        // Ini mencegah infinite loop dan tab saling mempengaruhi
        // Hash sudah diupdate oleh setUrl
      }
    } else {
      // Untuk non-hash router, tetap update hash seperti sebelumnya
      document.location.hash = `${value}`
    }
    
    onRouteChange(path, queryString)
  })

  let routeChangesTimer: any = null
  let routeChangesClock: number = 0
  const routeChangesTimeout: number = 2000
  const watchRouteChanges = () => {
    if (USE_HASH_ROUTER) {
      // Untuk routing berbasis hash, gunakan event listener hashchange
      const hashChangeListener = () => {
        // Jangan proses jika perubahan berasal dari kode kita sendiri
        if ((window as any)._updatingHashFromCode) {
          return
        }
        
        const hashUrl = document.location.hash.substring(1)
        if (hashUrl !== $savedUrl) {
          setRoute(hashUrl)
        }
      }
      
      window.addEventListener('hashchange', hashChangeListener)
      
      // Nonaktifkan polling IndexedDB sepenuhnya saat menggunakan hash router
      if (routeChangesTimer) {
        clearInterval(routeChangesTimer)
        routeChangesTimer = null
      }
    } else {
      // Untuk routing berbasis IndexedDB, gunakan polling seperti sebelumnya
      if (routeChangesTimer) return
      clearInterval(routeChangesTimer)
      routeChangesTimer = setInterval(async () => {
        // console.log(`route changes watcher is running ${routeChangesClock}`)
        routeChangesClock += 1
        const lastUrl = await idb.get("route.url")
        if (lastUrl && lastUrl != $savedUrl) setRoute(lastUrl as string)
      }, routeChangesTimeout)
    }
  }
  export const navigate = (newUrl: string) => {
    setRoute(newUrl)
  }
  onMount(() => {
    const loadLastUrl = async () => {
      let initialUrl: string | null = null
      
      // Jika menggunakan hash router, baca dari hash browser terlebih dahulu
      if (USE_HASH_ROUTER) {
        if (document.location.hash) {
          initialUrl = document.location.hash.substring(1) // Hapus karakter '#' di awal
        } else {
          // Jika tidak ada hash, gunakan URL default untuk tab baru
          initialUrl = "/chat"
        }
      } else {
        // Hanya baca dari IndexedDB jika tidak menggunakan hash router
        const lastUrl = await idb.get("route.url")
        if (lastUrl) {
          initialUrl = lastUrl as string
        }
      }
      
      // Jika masih tidak ada URL, gunakan URL default
      if (!initialUrl) {
        initialUrl = "/chat"
      }
      
      // Pastikan URL dimulai dengan '/'
      if (initialUrl && !initialUrl.startsWith('/')) {
        initialUrl = '/' + initialUrl
      }
      
      setRoute(initialUrl)
    }
    loadLastUrl()
    watchRouteChanges()
    
      })
</script>

<div class=" space-y-3 hidden">
  <label class="input input-bordered flex items-center gap-2 mb-4">
    Address:<input
      bind:value={$savedUrl}
      type="text"
      class="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
      placeholder="url"
    />
  </label>
</div>
