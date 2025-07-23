<script lang="ts">
  import { cls17, cls18, cls19, cls20, cls22, cls24, cls25 } from "./cls"
  import NavLink from "./NavLink.svelte"
  export let routeApp: any
  export let hasChild: boolean
  export let title: string
  export let path: string
  export let icon: string
  export let name: string
  export let childrens: any
  export let index: number
  const activeTabCls = "flex items-center gap-x-3.5 py-2 px-2.5 bg-gray-100 text-sm text-slate-700 rounded-md dark:bg-gray-900 dark:text-white"
  const activeMenuCls = "bg-gray-100 text-sm text-slate-700 rounded-md dark:bg-gray-900 dark:text-white"
  const inactiveTabCls = cls24 + " hover:bg-gray-100  hover:bg-gray-100 dark:hover:bg-gray-700"
  const linkCls = /*isActive ? activeTabCls : */ inactiveTabCls
  //   const { pathname } = useLocation()
  const pathname = ""
</script>

{#if hasChild}
  <li id={`${name}-accordion`} class={`${cls17} `} data-path={path.replace(/^\//, "")}>
    <button type="button" class={`${cls18} ${pathname.match(path) ? activeMenuCls : ""}`}>
      <i class={icon}></i>
      {title}

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class={cls19}
      >
        <path d="m18 15-6-6-6 6"> </path>
      </svg>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class={cls20}
      >
        <path d="m6 9 6 6 6-6"> </path>
      </svg>
    </button>
    <div id={`${name}-accordion-sub`} data-hs-accordion-always-open={pathname.match(path) ? "true" : "false"} class={`${cls25} ${pathname.match(path) ? "hidden" : "hidden"}`}>
      <ul class={cls22}>
        {#each Object.keys(childrens) as key}
          {@const item = childrens[key]}
          {#if !item.hidden}
            <svelte:self {routeApp} childrens={item.childItems || {}} name={key} hasChild={item.hasChild} title={item.title} path={item.path} icon={item.iconCls} />
          {/if}
        {/each}
      </ul>
    </div>
  </li>
{:else}
  <li>
    <NavLink {routeApp} to={path} className={linkCls}>
      <i class={icon}></i>
      {title}
    </NavLink>
  </li>
{/if}
