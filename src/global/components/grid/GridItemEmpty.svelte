<script lang="ts">
  import type { GridOptionsInterface, OptionalParams } from "./types"

  export let spanCls: string | OptionalParams
  export let limit: number | OptionalParams
  export let options: GridOptionsInterface
  const colspan = options.fields.length + 2
  // const arrLength = lastLength ? lastLength : limit
  const dummyRecords = [0]
</script>

{#each dummyRecords as value, index}
  <tr class="row-{index}">
    <td {colspan}><span class="item-{value}">No records</span></td>
  </tr>
{/each}
