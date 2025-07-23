<script lang="ts">
  import { writable } from "svelte/store"
  import "tailwindcss/tailwind.css"
  import "@fortawesome/fontawesome-free/css/all.min.css"
  import "bootstrap-icons/font/bootstrap-icons.css"

  import { onMount } from "svelte"
  import { SqlDB } from "@/global/classes/SqlDB"
  import DBStore from "@/global/db/DBStore"
  import Template from "./components/ux/Template.svelte"
  import RoutesApp from "./components/RoutesApp.svelte"
  import { createRouter } from "./pages/router"

  const queryString = writable<string | null>(null)
  const routeParams = writable<Record<string, string>>({})

  const sqldb = new SqlDB()
  let dbStore: DBStore = DBStore.getInstance()
  let routeApp: RoutesApp
  onMount(() => {
    sqldb.init().then(() => {
      dbStore = DBStore.getInstance()
      dbStore.setSqlDb(sqldb)
    })
  })

  const router = createRouter()
  let page: any

  function onRouteChange(path: string, _queryString: string | null) {
    const match = router.match(path)
    if (match) {
      routeParams.set(match.params)
      page = match.component
    } else {
      page = router.notFoundComponent
    }
    queryString.set(_queryString)
    if (routeApp) routeApp.triggerRouteChange(path, _queryString)
  }
</script>

<Template
  store={dbStore}
  {routeApp}
>
  <RoutesApp
    {onRouteChange}
    bind:this={routeApp}
  />
  <svelte:component
    this={page}
    queryString={$queryString}
    params={$routeParams}
    store={dbStore}
  />
</Template>
