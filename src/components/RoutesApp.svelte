<script lang="ts">
  import { writable } from "svelte/store"
  import * as idb from "idb-keyval"
  import { onMount } from "svelte"
  import { TabManager, type SimulatedTab } from "../global/classes/TabManager"
  const savedUrl = writable("")
  const lastPath = writable("")
  const lastQueryString = writable<string | null>(null)
  const pathname = writable("")
  const queryString = writable<string | null>("")
  const manager = new TabManager()
  let tab: SimulatedTab
  let firstTime = true
  export const setUrl = (targetUrl: string) => {
    idb.set(tab.id, targetUrl)
    savedUrl.update((o) => targetUrl)
    const [path, _queryString] = getRoute(targetUrl)
    pathname.update((o) => path)
    queryString.update((o) => _queryString)
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
    console.log(path, queryString)
  }
  export function triggerRouteChange(path: string, queryString: string | null) {
    Object.keys(routeChangeCallbacks).forEach((key) =>
      routeChangeCallbacks[key](path, queryString)
    )
  }
  export function triggerRouteChangeKey(inputKey: string) {
    if (routeChangeCallbacks[inputKey]) {
      routeChangeCallbacks[inputKey]($savedUrl, $queryString)
    }
  }
  savedUrl.subscribe((value) => {
    const [path, queryString] = getRoute(value)
    lastPath.update((o) => path)
    lastQueryString.update((o) => queryString)
    if (!firstTime) {
      document.location.hash = `${value}`
    }
    firstTime = false

    onRouteChange(path, queryString)
  })

  let routeChangesTimer: any = null
  let routeChangesClock: number = 0
  const routeChangesTimeout: number = 2000
  const watchRouteChanges = () => {
    if (routeChangesTimer) return
    clearInterval(routeChangesTimer)
    routeChangesTimer = setInterval(async () => {
      // console.log(`route changes watcher is running ${routeChangesClock}`)
      routeChangesClock += 1
      const lastUrl = await idb.get(tab.id)
      if (lastUrl && lastUrl != $savedUrl) setRoute(lastUrl as string)
    }, routeChangesTimeout)
  }
  export const navigate = (newUrl: string) => {
    idb.set(tab.id, newUrl)
  }
  onMount(() => {
    tab = manager.add(document.location.href)
    console.log({ tab, href: document.location.href })
    const loadLastUrl = async () => {
      const lastUrl = document.location.hash.replace("#", "") // await idb.get(tab.id)
      console.log({ lastUrl })
      if (lastUrl) setRoute(lastUrl as string)
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
