<script lang="ts">
  export let to: string
  export let className: string
  export let routeApp: any
  export let isActive: boolean = false
  const onNavigate = (event: Event) => {
    routeApp.setRoute(to)
    return event.preventDefault()
  }
</script>

<a href={to} on:click={onNavigate} class={`${className} ${isActive ? "active" : ""}`}><slot /></a>
