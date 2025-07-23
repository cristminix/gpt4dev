<script lang="ts">
  import type DBStore from "@/global/db/DBStore"
  import { cls13 } from "./cls"
  import Menu from "./Menu.svelte"
  import menus from "./side-menu.json"
  export let routeApp: any

  export let store: DBStore
  export let config: any
  // let menus: any = []
</script>

<nav class={`${cls13} !p-4`}>
  <Menu {routeApp} data={menus} {store} {config} />
</nav>
