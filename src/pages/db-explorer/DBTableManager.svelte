<script lang="ts">
  import { onMount } from "svelte"

  import { formatBytes } from "@/global/fn/formatBytes"
  import Button from "@/global/components/ux/Button.svelte"
  import { niceScrollbarCls } from "@/components/ux/cls"
  import GridTable from "@/global/components/grid/GridTable.svelte"
  import Pager from "@/global/components/grid/Pager.svelte"
  import type {
    GridOptionsInterface,
    IGridData,
    OptionalGridOptionsInterface,
  } from "@/global/components/grid/types"
  import { writable } from "svelte/store"
  import DBStore from "@/global/db/DBStore"
  import type RoutesApp from "@/components/RoutesApp.svelte"
  import type DrizzleDB from "@/global/db/models/DrizzleDB"

  export let store: DBStore
  export let config: any
  export let routeApp: RoutesApp
  import configTables from "./config.json"

  const schema = {
    availables: [
      "App",
      "Setting",
      "Author",
      "Course",
      "AuthorCourse",
      "Section",
      "Toc",
      "ExerciseFile",
      "StreamLocation",
      "Transcript",
      "Thumbnail",
      "PrxCache",
      "QState",
      "DMSetup",
      "DMStatus",
    ],
  }
  interface TRowData {
    table: string
    desc: string
    size: string
    counts: number
  }

  const records: TRowData[] = []

  let grid = writable<IGridData>({
    records,
    limit: 5,
    page: 1,
    totalPages: 0,
    totalRecords: 0,
    orderBy: "key",
    orderDir: "asc",
  })
  const loading = writable(true)
  // let reinitLoading: boolean[] = []
  const storageSz = writable("0")

  /*
  const onReinit = async (item: any, index: number) => {
    if (confirm(`The ${item.table} table is going to be dropped, are you sure you want to reinit?`)) {
      console.log(`Reinit ${item.table} table`)

      let reinitLoadingState = [...reinitLoading]
      reinitLoadingState[index] = true
      reinitLoading = reinitLoadingState

      const model = store.get(item.table)
      if (model) {
        if (item.table == "PrxCache") {
          //   await model.clearAll()
        } else {
          //   await model.truncate()
        }
      }
      reinitLoadingState = [...reinitLoading]
      reinitLoadingState[index] = false
      reinitLoading = reinitLoadingState
      updateStorageSize()
      updateList()
      //      config.getUiConfig().reloadSidebar()
    }
    console.log(item)
  }
  */

  const gridOptions = writable<GridOptionsInterface>({
    routeApp,
    numberWidthCls: "",
    actionWidthCls: "",
    widthCls: ["1/4", "3/4", "3/4"],
    headers: ["Table Name", "Table Size", "Row Counts"],
    fields: ["table", "size", "counts"],
    fieldTypes: ["string", "string", "number"],
    enableEdit: false,
    enableActions: false,
    callbackActions: {
      // edit: (item:, index, options, linkCls, gridAction) => {
      //   return ''
      // },
    },
    enableDelete: false,
  })

  const getTableSizeByModelName = async (modelName: string) => {
    let result: any
    if (modelName == "PrxCache") {
      // sSize = 0 //await store.get("PrxCache").getSize()
    } else {
      const model = store.get<DrizzleDB>(modelName)
      if (model) {
        const tableName = model.schema
        console.log({ tableName })
        result = await model.getDataSize()
      }
    }
    return result ? result : { counts: 0, size: 0 }
  }

  const updateList = async () => {
    let tableSize = 0
    const newGrid = { ...$grid }
    newGrid.records = []
    loading.update((o) => true)

    for (const table of schema.availables) {
      const desc = ""
      const result = await getTableSizeByModelName(table)
      const { size, counts } = result
      const item: TRowData = { table, desc, size: formatBytes(size), counts }
      newGrid.records.push(item)
      tableSize += size
    }
    setTimeout(() => {
      storageSz.update((o) => formatBytes(tableSize))
      grid.update((o) => newGrid)
      loading.update((o) => false)
    }, 512)
  }

  const exportDb = async () => {
    // createDownloadFile()
    /*
    const anchor = document.createElement("a")
    const filename = "db.json"
    const results = { records: {} }

    //   store.availables.map((model) => {
    //     results.records[model] = {};
    //     try {
    //       store.get(model).getAll().map((rec) => {
    //         results.records[model][rec.id] = rec;
    //       });
    //     } catch (e) {
    //       console.error(e);
    //     }
    //   });

    const buffer = JSON.stringify(results)
    const objectURL = window.URL.createObjectURL(new Blob([buffer]))
    anchor.download = filename
    anchor.href = objectURL
    anchor.click()
    */
  }

  store.onReady(() => {
    updateList()
  })
  onMount(() => {
    if (store.isReady()) {
      updateList()
    }
  })

  const containerCls =
    "db-table-manager my-4 border mb-2 rounded-xl shadow-sm p-6 dark:bg-gray-800 dark:border-gray-700"
</script>

<div class={containerCls}>
  <div class="explorer-toolbar mb-2">
    <div class="flex gap-2">
      <Button
        on:click={() => exportDb()}
        caption="Export to json"
        icon="fa fa-file-text"
      />
      <Button
        on:click={(f) => f}
        icon="fa fa-save"
        caption={`Storage Size :   ${$storageSz}`}
      />
    </div>
  </div>
  <div class="flex flex-col">
    <div class={"-m-1.5 overflow-x-auto " + niceScrollbarCls}>
      <div class="p-1.5 min-w-full inline-block align-middle">
        {#if !$loading}
          <GridTable
            options={$gridOptions}
            records={$grid.records}
            page={$grid.page}
            limit={$grid.limit}
          />
        {/if}
      </div>
    </div>
    <div class="pager-container mt-3">
      {#if !$loading}
        <Pager
          path="/database/table-manager"
          page={$grid.page}
          total_pages={$grid.totalPages}
          limit={$grid.limit}
          onRefresh={(e) => {
            // onRefresh(e)
            updateList()
          }}
        />
      {/if}
    </div>
  </div>
</div>
