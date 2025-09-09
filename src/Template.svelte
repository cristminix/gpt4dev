<script lang="ts">
  import { onMount } from "svelte"
  import type { RouteApp } from "./components/RouteApp.types"
  import type Toasts from "./components/Toasts.svelte"
  import AdminTemplate from "./templates/AdminTemplate.svelte"
  import SingleTemplate from "./templates/SingleTemplate.svelte"

  // console.log("Parent component rendered")
  onMount(() => {})

  export let config: any = null
  export let routeApp: RouteApp
  export let toasts: Toasts
  export let name: string = "admin"

  console.log({ name })
</script>

{#if name === "admin"}
  <AdminTemplate {routeApp}>
    <slot />
  </AdminTemplate>
{:else if name === "single"}
  <SingleTemplate>
    <slot />
  </SingleTemplate>
{/if}
