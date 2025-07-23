<script lang="ts">
  import type { GridOptionsInterface } from "./types"

  export let options: GridOptionsInterface
  //   const tableCls = "min-w-full divide-y divide-gray-200 dark:divide-gray-700"
  const tableHeaderCls = "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
  const numberWidthCls = options.numberWidthCls || ""
  const actionWidthCls = options.actionWidthCls || ""

  function getRealCaption(defaultCaption: string, index: number) {
    let realCaption = defaultCaption
    if (options.callbackHeaders) {
      const field = options.fields[index]
      if (options.callbackHeaders[field]) {
        realCaption = options.callbackHeaders[field](field, index, options.fields)
      }
    }
    return realCaption
  }
</script>

<tr>
  <th scope="col" class={`${numberWidthCls} ${tableHeaderCls}`}>No</th>
  {#each options.headers as caption, index}
    {@const realCaption = getRealCaption(caption, index)}
    {@const tableHeaderWidthCls = options.widthCls[index] || ""}

    <th scope="col" class={`${tableHeaderWidthCls} ${tableHeaderCls}`}>{realCaption}</th>
  {/each}
  {#if options.enableActions}
  <th scope="col" class={`${actionWidthCls} ${tableHeaderCls}`}>Action</th>
  {/if}
</tr>
