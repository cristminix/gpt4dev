<script lang="ts">
  import HEADER from "./HEADER.svelte"
  import Logo from "./Logo.svelte"
  import Dropdown from "./Dropdown.svelte"
  import Breadcrumb from "./Breadcrumb.svelte"
  import Sidebar from "./Sidebar.svelte"
  import Content from "./Content.svelte"
  import { onMount } from "svelte"

  console.log("Parent component rendered")
  onMount(() => {})
</script>

<HEADER />
<Logo />
<Dropdown />
<Breadcrumb />
<Sidebar />
<Content />

<h2>Test Parent Render</h2>
