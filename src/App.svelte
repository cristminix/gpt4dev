<script lang="ts">
  import { match } from "path-to-regexp"
  import { writable } from "svelte/store"
  // import "tailwindcss/tailwind.css"
  import "@fortawesome/fontawesome-free/css/all.min.css"
  import "bootstrap-icons/font/bootstrap-icons.css"

  import About from "./components/About.svelte"
  import NotFound from "./components/NotFound.svelte"
  import Contact from "./components/Contact.svelte"
  import RoutesApp from "./components/RoutesApp.svelte"
  import type { RouteApp as RouteAppType } from "./components/RouteApp.types"
  import Template from "./Template.svelte"
  // import CoursePage from "./pages/course/CoursePage.svelte"
  // import CourseDisplayPage from "./pages/course/CourseDisplayPage.svelte"
  // import AddCoursePage from "./pages/course/AddCoursePage.svelte"
  import { onMount, type SvelteComponent } from "svelte"
  import ChatPage from "./pages/ChatPage.svelte"
  import Toasts from "./components/Toasts.svelte"
  import Demo from "./pages/Demo.svelte"
  // import FileManagerPage from "./pages/FileManagerPage.svelte"
  // import DBExplorer from "./pages/db-explorer/DBExplorer.svelte"
  // import DBTableManager from "./pages/db-explorer/DBTableManager.svelte"

  let routeApp: RoutesApp | RouteAppType
  let queryString = writable<string | null>(null)
  let routeParams = writable<any>(null)
  let toasts: Toasts
  interface RoutingMap {
    [key: string]: any
  }
  // const mSetting = dbStore.get("Setting") as MSetting
  onMount(() => {})
  const routingMap: RoutingMap = {
    "/about": { page: About },
    "/chat/:id": { page: ChatPage },
    "/contact/page/:page": { page: Contact },
    "/demo": { page: Demo, template: "single" },
    // "/course": CoursePage,
    // "/course/display/:id/:slug": CourseDisplayPage,
    // "/course/add/:slug": AddCoursePage,
    // "/file-manager": FileManagerPage,
    // "/database/table-manager": DBTableManager,
    // "/database/explore/:table": DBExplorer,
  }

  let page: any
  let templateName = "admin"
  const routingKeys = Object.keys(routingMap).reverse()
  function matchRoute(input: string) {
    let matchParams: any
    let matchKey = null
    let breakTheLoop = false
    for (const key of routingKeys) {
      // console.log(key)
      const fn = match(key)
      const matchResult = fn(input)
      // console.log(matchResult)
      if (matchResult) {
        const { path, params } = matchResult
        // console.log({ path })
        if (path === key) {
          matchKey = key
          breakTheLoop = true
        } else {
          const paramKeys = Object.keys(params)
          if (paramKeys.length > 0) {
            matchKey = key
            matchParams = params
            breakTheLoop = true
          }
        }
      }
      if (breakTheLoop) break
    }
    // console.log({ matchKey })
    return [matchKey, matchParams]
  }
  function onRouteChange(path: string, _queryString: string | null) {
    const [routeKeyFound, params] = matchRoute(path)
    // page = NotFound
    if (routeKeyFound) {
      routeParams.update((o) => params)
      page = routingMap[routeKeyFound].page
      if (routingMap[routeKeyFound].template) {
        templateName = routingMap[routeKeyFound].template
      } else {
        templateName = "admin"
      }
    } else {
      page = NotFound
    }
    queryString.update((o) => _queryString)
    try {
      if (routeApp) routeApp.triggerRouteChange(path, _queryString)
    } catch (error) {}
  }
</script>

<!-- 
<nav>
  <Link {routeApp} to="/about" isActive={page === About}>About</Link> &nbsp; &nbsp;
  <Link {routeApp} to="/contact" isActive={page === Contact}>Contact Us</Link>
</nav> -->

<Template {routeApp} {toasts} name={templateName}>
  <RoutesApp bind:this={routeApp} {onRouteChange} />
  <Toasts bind:this={toasts} />
  <svelte:component
    this={page}
    queryString={$queryString}
    params={$routeParams}
    {routeApp}
    sourceParam={routeParams}
    {toasts}
  />
</Template>
