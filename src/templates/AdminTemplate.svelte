<script lang="ts">
  import HEADER from "../components/HEADER.svelte"
  import Logo from "../components/Logo.svelte"
  import Dropdown from "../components/Dropdown.svelte"
  import Breadcrumb from "../components/Breadcrumb.svelte"
  import Sidebar from "../components/Sidebar.svelte"
  import Content from "../components/Content.svelte"
  import type { RouteApp } from "@/components/RouteApp.types"
  export let routeApp: RouteApp
</script>

<HEADER />
<!-- <Logo /> -->
<Dropdown />
<Breadcrumb />
<Sidebar {routeApp} />
<Content>
  <slot />
</Content>
