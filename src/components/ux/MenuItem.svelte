<script lang="ts">
  import NavLink from "@/global/components/ux/NavLink.svelte"
  import { cls17, cls18, cls19, cls20, cls22, cls24, cls25 } from "./cls"
  import { onMount } from "svelte"
  import { writable } from "svelte/store"

  export let routeApp: any
  export let hasChild: boolean
  export let title: string
  export let path: string
  export let icon: string
  export let name: string
  export let childrens: any
  export let index: number
  export let parentIndex: number = -1
  const menuPath = writable(path)
  const activeMenuCls = "flex items-center gap-x-3.5 py-2 px-2.5 bg-gray-100 text-sm text-slate-700 rounded-md dark:bg-gray-900 dark:text-white"
  const inactiveTabCls = cls24 + " hover:bg-gray-100  hover:bg-gray-100 dark:hover:bg-gray-700 text-xs"
  //   const { pathname } = useLocation()
  const { pathname } = routeApp.useLocation()
  const linkCls = isActive() ? activeMenuCls : inactiveTabCls
  const realMenuCls = `${linkCls} !px-5 my-2 menu-item-${parentIndex}-${index}`
  const menuLinkCls = writable(realMenuCls)
  function isActiveRootMenu(inputPath: string) {
    const checked = pathname.startsWith(inputPath)
    // console.log({ pathname, inputPath, checked })

    return checked
    // return false
  }
  function isActive() {
    const active = pathname.startsWith($menuPath)
    // console.log({ pathname, path, active })
    return active
  }
  let self: any
  const menuChilds = writable(childrens)
  /*const addActivateHandler = () => {
    routeApp.addRouteChangeCallback(() => {
      console.log(`route changed ${title} ${parentIndex}-${index}`)
      // menuChilds.update((o) => [])
      menuLinkCls.update((o) => `${inactiveTabCls} !px-5 my-2 menu-item-${parentIndex}-${index}`)
      setTimeout(() => {
        // menuChilds.update((o) => [...childrens])
        // menuPath.update((o) => path)
        menuLinkCls.update((o) => activeMenuCls)
      }, 512)
    }, `menu-${index}`)
  }
  onMount(() => {
    // addActivateHandler()
  })
  */
</script>

{#if hasChild}
  <!-- 
<div class="join join-vertical w-full">
  <div class="collapse collapse-arrow join-item border-base-300 border">
    <input type="radio" name="my-accordion-4" checked="checked" />
    <div class="collapse-title text-xl font-medium">Click to open this one and close others</div>
    <div class="collapse-content">
      <p>hello</p>
    </div>
  </div>

 -->
  <li id={`${name}-accordion`} class="join join-vertical w-full accordion-item" data-path={path.replace(/^\//, "")}>
    <div class="collapse collapse-arrow join-item border-base-300 border">
      <input type="radio" name={`my-accordion-0`} checked={isActiveRootMenu(path)} class="!min-h-2" />
      <div class="collapse-title text-sm !after:bg-blue-300"><i class={icon}></i> {title}</div>
      <div class="collapse-content">
        <ul class={`${cls22} !p-0`}>
          {#each Object.keys($menuChilds) as key, idx}
            {@const item = childrens[key]}
            {#if !item.hidden}
              <svelte:self
                parentIndex={index}
                index={idx}
                {routeApp}
                childrens={item.childItems || {}}
                name={key}
                hasChild={item.hasChild}
                title={item.title}
                path={item.path}
                icon={item.iconCls}
              />
            {/if}
          {/each}
        </ul>
      </div>
    </div>
  </li>
{:else}
  <li>
    <NavLink bind:this={self} {routeApp} to={path} className={$menuLinkCls}>
      <i class={icon}></i>
      {title}
    </NavLink>
  </li>
{/if}

<style>
  .collapse-arrow > .collapse-title {
    padding: 12px 18px;
    min-height: 28px;
  }
  .collapse-arrow > .collapse-title::after {
    top: 22px;
  }
  .collapse-content {
    padding: 0 12px 0px 12px;
    margin-bottom: 0px;
  }
  .cls-22 {
    margin-bottom: 12px;
  }
  .accordion-item {
    /* margin-top: 0 !important; */
    /* margin-bottom: 0 !important; */
  }
</style>
