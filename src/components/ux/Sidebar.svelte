<script lang="ts">
  import type DBStore from "@/global/db/DBStore"
  import { cls10, cls11, cls12 } from "./cls"
  import SideMenu from "./SideMenu.svelte"
  import appLogo from "/logo/icon-48.png"
  export let routeApp: any

  export let store: DBStore
  export let config: any
  let sideMenuRef: any
  let hideSidebar = false
  const sidebarCls = hideSidebar ? `lg:hidden ${cls10} ` : cls10
</script>

<!-- Sidebar -->
<div id="application-sidebar" class={`${sidebarCls}`} data-hs-overlay-backdrop-container="#sidebar-overlay-backdrop">
  <div class={cls11}>
    <!-- <a href="#" aria-label="Brand" class={cls12}> Brand </a>    -->
    <a class={cls12} href="#" aria-label="Brand">
      <div class="flex">
        <img src={appLogo} />
        <div class="m-3">LLFecther</div>
      </div>
    </a>
  </div>
  <SideMenu {routeApp} {store} {config} bind:this={sideMenuRef} />
</div>
<!-- End Sidebar -->
