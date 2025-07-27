<script lang="ts">
  export let to: string
  export let routeApp: any
  export let isActive: boolean = false
  export let className: string
  export let title: string = ""
  const onNavigate = (event: Event) => {
    routeApp.setRoute(to)
    return event.preventDefault()
  }
</script>

<a
  href={to}
  {title}
  on:click={onNavigate}
  class={`${isActive ? "active" : ""} ${className}`}><slot /></a
>
