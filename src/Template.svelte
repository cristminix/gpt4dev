<script lang="ts">
  // import Content from "./components/ux/Content.svelte"
  // import Sidebar from "./components/ux/Sidebar.svelte"
  // import SidebarToggle from "./components/ux/SidebarToggle.svelte"
  import HEADER from "./components/HEADER.svelte"
  import Logo from "./components/Logo.svelte"
  import Dropdown from "./components/Dropdown.svelte"
  import Breadcrumb from "./components/Breadcrumb.svelte"
  import Sidebar from "./components/Sidebar.svelte"
  import Content from "./components/Content.svelte"
  import { onMount } from "svelte"

  // console.log("Parent component rendered")
  onMount(() => {})

  export let config: any = null
  export let routeApp: any
</script>

<HEADER />
<Logo />
<Dropdown />
<Breadcrumb />
<Sidebar {routeApp} />
<Content>
  <slot />
</Content>
