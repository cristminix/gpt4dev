<script lang="ts">
  export let to: string
  export let routeApp: any
  export let isActive: boolean = false
  export let className: string

  const onNavigate = (event: Event) => {
    routeApp.setRoute(to)
    return event.preventDefault()
  }
</script>

<a
  href={to}
  on:click={onNavigate}
  class={`${isActive ? "active" : ""} ${className}`}><slot /></a
>
