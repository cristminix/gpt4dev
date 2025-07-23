<script lang="ts">
  import { compile, type ParamData } from "path-to-regexp"

  import MCourse from "@/global/db/models/MCourse"
  import { cls14 } from "./cls"
  import MenuItem from "./MenuItem.svelte"
  import { onMount } from "svelte"
  import { writable } from "svelte/store"
  import type { MenuInterface } from "./types"
  import type { TCourse } from "@/global/db/models/schema"
  import type DBStore from "@/global/db/DBStore"
  const loading = writable(true)
  export let data: any
  export let routeApp: any
  export let store: DBStore
  export let config: any
  const DEV_MODE = import.meta.env.DEV
  const menuData = writable(data)
  const isHidden = (item: any) => {
    if (item.hidden) return true
    if (DEV_MODE && item.dev) return false
    if (!DEV_MODE && item.dev) return false
    return false
  }
  // const mCourse = store.get("Course") as MCourse
  const getChildrenByModel = (item: MenuInterface) => {
    // console.log(item, index)
    if (item.model === "Course") {
      const courseList = mCourse.getAll().map((course: TCourse) => {
        let title = "",
          path = ""
        if (item.childRoutePath && item.displayField) {
          title = course[item.displayField as keyof TCourse] as string
          const pathFn = compile<ParamData>(item.childRoutePath)
          const courseParams: ParamData = Object.keys(course).reduce(
            (params, key) => {
              const key2 = key as keyof TCourse
              if (course[key2]) params[key] = course[key2].toString()
              return params
            },
            {} as ParamData
          )

          path = pathFn(courseParams)
        }

        const menu: MenuInterface = {
          title,
          path,
          iconCls: item.childIconCls ?? "",
        }
        return menu
      })
      const courseMenuItems: MenuInterface[] = [
        {
          title: "Add Course",
          iconCls: "fa fa-square-plus",
          path: "/course/add",
        },
        ...courseList,
      ]
      // console.log(courseMenuItems)
      return courseMenuItems
    }
    return []
  }
  const addActivateHandler = () => {
    routeApp.addRouteChangeCallback(() => {
      console.log("route changed")
      menuData.update((o) => [])
      setTimeout(() => {
        menuData.update((o) => [...data])
      })
    }, "menu")
  }
  // store.onReady(() => {
  //   if (mCourse.isReady()) {
  //     loading.update((o) => false)
  //     addActivateHandler()
  //   }
  // })
  // onMount(() => {
  //   if (mCourse.isReady()) {
  //     loading.update((o) => false)
  //     addActivateHandler()
  //   }
  // })
</script>

{#if $loading}
  loading ...
{:else}
  <ul class={cls14}>
    {#each $menuData as item, index}
      {@const hidden = isHidden(item)}
      {#if !hidden}
        {#if item.useModel}
          {@const childrens = getChildrenByModel(item)}
          {@const hasChild = true}
          <MenuItem
            {routeApp}
            {childrens}
            name={item.slug}
            {index}
            {hasChild}
            title={item.title}
            path={item.path}
            icon={item.iconCls}
          />
        {:else}
          <MenuItem
            {routeApp}
            childrens={item.children}
            name={item.slug}
            {index}
            hasChild={item.hasChild}
            title={item.title}
            path={item.path}
            icon={item.iconCls}
          />
        {/if}
      {/if}
    {/each}
  </ul>
{/if}
