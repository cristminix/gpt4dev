<script lang="ts">
  import { onMount } from "svelte"
  import type { RouteApp } from "./RouteApp.types"
  export let routeApp: RouteApp
  onMount(() => {
    if (routeApp) {
      routeApp.setRoute("/chat/new")
    }
  })
</script>

<p class="p-8">404 Page Not Found</p>
