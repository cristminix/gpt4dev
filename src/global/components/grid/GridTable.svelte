<script lang="ts">
  import { niceScrollbarCls } from "@/components/ux/cls"
  import GridHeaders from "./GridHeaders.svelte"
  import GridItems from "./GridItems.svelte"
  import type { GridOptionsInterface } from "./types"
  import { onMount } from "svelte"

  export let page: number
  export let limit: number
  export let options: GridOptionsInterface
  export let context: any = null
  export let records: any[]
  const tableCls = "min-w-full divide-y divide-gray-200 dark:divide-gray-700"
  // const tableCls = "w-full"
  const theadCls = "border-b sticky top-0 bg-gray-100 dark:bg-gray-800"

  const emptyRecords = records ? (records.length > 0 ? false : true) : false

  onMount(() => {
    console.log(records)
  })
</script>

<div class="block h-screen">
  <table class={tableCls}>
    <thead class={theadCls}>
      <GridHeaders {options} />
    </thead>
    <tbody class={` overflow-y-auto ${niceScrollbarCls}`}>
      <GridItems
        empty={emptyRecords}
        {context}
        {records}
        {page}
        {limit}
        {options}
      />
    </tbody>
  </table>
</div>
