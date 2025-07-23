<script lang="ts">
    import { onMount } from "svelte";
  import GridActions from "./GridActions.svelte"
  import GridItemEmpty from "./GridItemEmpty.svelte"
  import type { GridOptionsInterface } from "./types"
  export let context: any

  export let limit: number
  export let empty: boolean
  export let options: GridOptionsInterface
  export let records: any[]
  export let page: number

  const spanCls = "my-2 h-8 block bg-gray-200 rounded-full dark:bg-gray-700"
  const tdCls = "px-6 py-4 text-sm font-normal text-gray-800 dark:text-gray-200 align-top"
  const tdCls2 = "px-6 py-4 whitespace-nowrap text-right text-sm font-medium align-top"
  const trCls = "align-top" //"odd:bg-white even:bg-gray-100 hover:bg-gray-100 dark:odd:bg-gray-800 dark:even:bg-gray-700 dark:hover:bg-gray-700"
  const linkCls = "text-blue-500 hover:text-blue-700"

  function getFieldText(field: string, fieldIndex: number, item: any, index: number) {
    let value = item[field]
    // console.log({ item, value })
    try {
      value = typeof value == "object" ? JSON.stringify(value) : value.toString()
    } catch (e) {}
    let fieldText = value
    if (options.callbackFields) {
      if (options.callbackFields[field]) {
        fieldText = options.callbackFields[field](field, value, item, index)
      }
    }
    if (options.useAutoEditor) {
      let editor = "string"
      try {
        options.editors[fieldIndex]
      } catch (e) {}
      // console.log(item)
      // if (options.editorFactory) fieldText = options.editorFactory(editor, field, value, item, index, fieldIndex)
      return fieldText
    }
    return fieldText
  }
  function recordNumber(index: number) {
    const p = index + 1
    const gp = page - 1
    const lim = limit || 5

    const recordNumber = p + gp * lim
    return recordNumber
  }

  function parseCustomAction(item: any) {
    if (options.actions) {
      if (options.actions.edit) {
        return options.actions.edit(item)
      }
    }
  }
  onMount(() => {
    console.log({options})
  })
</script>

{#if empty}
  <GridItemEmpty {options} {spanCls} {limit} />
{:else}
  {#each records as item, index}
    <tr class={` ${trCls}`}>
      <td class={tdCls}>
        {recordNumber(index)}
      </td>
      {#each options.fields as field, fieldIndex}
        {@const fieldText = getFieldText(field, fieldIndex, item, index)}
        <td class={tdCls}>
          {#if Array.isArray(options.fieldTypes)}
            {#if options.fieldTypes[fieldIndex] === "image"}
              <img src={fieldText} class="w-10 h-10 rounded-full" />
            {:else}
              {fieldText}
            {/if}
            <!-- Add content here if needed -->
          {:else}
            {fieldText} 
          {/if}
        </td>
      {/each}
      {#if options.enableActions}
        <td class={tdCls2}>
          <div class="flex items-center gap-1">
            <GridActions {options} {index} {item} {linkCls} />
          </div>
        </td>
      {/if}
    </tr>
  {/each}
{/if}
