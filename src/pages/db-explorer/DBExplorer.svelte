<script lang="ts">
  import { makeDelay } from "@/global/fn/makeDelay"
  import { onMount, beforeUpdate, afterUpdate } from "svelte"
  // import DBEditorBoolean from "./db-editor/DBEditorBoolean.svelte";
  // import DBEditorInteger from "./db-editor/DBEditorInteger.svelte";
  // import DBEditorObject from "./db-editor/DBEditorObject.svelte";
  // import DBEditorString from "./db-editor/DBEditorString.svelte";
  // import Pager from "@/components/shared/Pager.svelte";
  // import Grid from "@/components/shared/Grid.svelte";
  // import { makeDelay } from "@/global/fn";
  // import config from "./config.json"
  import GridTable from "@/global/components/grid/GridTable.svelte"
  import Pager from "@/global/components/grid/Pager.svelte"
  import type { GridOptionsInterface, IGridData, OptionalGridOptionsInterface } from "@/global/components/grid/types"
  import { writable } from "svelte/store"
  import type DrizzleDB from "@/global/db/models/DrizzleDB"
  import type DBStore from "@/global/db/DBStore"
  import configTables from "./config.json"

  export let store: DBStore
  // export let table
  export let page: number = 1
  export let routeApp: any
  export let params: any
  const loading = writable(false)

  const conf = writable<any>(null)
  let errorMessage = ""
  let projectList: any[] = []
  let editorFactoryRefs: any = {}
  let grid = writable<IGridData>({
    records: [],
    limit: 600,
    page: 1,
    totalPages: 0,
    totalRecords: 0,
    orderBy: "key",
    orderDir: "desc",
  })
  const model = writable<DrizzleDB | null>(null)
  let table = writable<string | null>(null)
  const delay = makeDelay(256)

  const updateList = async (pageNumber: number,limit:number) => {
    let nGrid : IGridData= {
      ...$grid,
      records: [],
    }
    grid.update((o) => nGrid)
    console.log("update list called")
    loading.update((o) => true)
    delay(async () => {
      console.log("delay called",{$conf,$model})
      if ($conf) {
        const method = $conf.listMethod as keyof DrizzleDB
        if ($model) {
          nGrid = await $model[method](limit,pageNumber)
            console.log({nGrid})
            grid.update((o) => ({ ...o, ...nGrid }))
        } else {
          console.log($model)
        }
      }
      loading.update((o) => false)
    
    })
  }
  interface ConfigItem {
    gridOptions: OptionalGridOptionsInterface; 
}
  const setModelAndConf = (configTableKey: string) => {
    loading.update((o) => true)
    // model = null
    // conf = null
    const tables = configTables.tables as any
    const tableConf = tables[$table as keyof typeof tables]
    // console.log({ tables, tableConf, table: $table })
    const itemGridOptions =  tableConf? tableConf.gridOptions:null//getGridOptions(configTables.tables,configTableKey)
    // console.log({itemGridOptions})
    gridOptions.update(o=>({...defaultGridOptions,...itemGridOptions}))
    if (tableConf) {
      const modelName = tableConf.model
      console.log(modelName)
      const modelSet = store.get<DrizzleDB>(modelName)
      // console.log(modelSet)
      conf.update((o) => tableConf)
      if (modelSet) model.update((o) => modelSet)
    } else {
      errorMessage = `No config set for ${configTableKey} table`
    }
    loading.update((o) => false)
  }

  const onRefresh = async (e: any, setLoading: any) => {
    // entryPoint()
    init($table)
    // loading.update((o) => true)
    // await updateList($grid.page,$grid.limit)
    // loading.update((o) => false)
  }

  const editorFactory = (editor: any, field: any, value: any, item: any, index: number, fieldIndex: number) => {
    if (!editorFactoryRefs[`${index}-${fieldIndex}-${field}`]) {
      editorFactoryRefs[`${index}-${fieldIndex}-${field}`] = null
    }
    const ref = editorFactoryRefs[`${index}-${fieldIndex}-${field}`]
    const components: any = {
      // boolean: <DBEditorBoolean {item} {field} {value} bind:this={ref} />,
      // string: <DBEditorString {item} {field} {value} bind:this={ref} />,
      // object: <DBEditorObject {item} {field} {value} bind:this={ref} />,
      // integer: <DBEditorInteger {item} {field} {value} bind:this={ref} />,
    }
    const editorComponent = components[editor]
    return editorComponent
  }

  const onCancelRow = async (item: any, index: number, options: any, linkCls: string, gridAction: any) => {
    options.fields.map((field: any, fieldIndex: number) => {
      const editor = editorFactoryRefs[`${index}-${fieldIndex}-${field}`]
      editor.cancelRow()
    })
    gridAction.setState({ editMode: false })
  }

  const onEditRow = async (item: any, index: number, options: any, linkCls: string, gridAction: any) => {
    options.fields.map((field: any, fieldIndex: number) => {
      const editor = editorFactoryRefs[`${index}-${fieldIndex}-${field}`]
      const editMode = editor.state.editMode
      if (!editMode) {
        editor.editRow()
      } else {
        editor.saveRow()
      }
    })
    const editMode = gridAction.state.editMode
    gridAction.setState({ editMode: !editMode })
  }

  const getLinkButton = () => {
    /* return (
      <button   on:click={() => onEditRow()}>
        <i class="bi bi-pencil-square"></i> Ubah
      </button>
    )
    */
  }
  let deleteActionDynamicComponent:any
  const defaultGridOptions :GridOptionsInterface= {
    routeApp,
    numberWidthCls: "",
    actionWidthCls: "",
    widthCls: ["3/8", "5/8"],
    headers: ["Setting", "Value"],
    fields: ["key", "value"],
    enableDelete: true,
    enableEdit:false,
    // callbackFields: {},
    enableActions:true,
    useAutoEditor: true,
    callbackActions: {
      delete: async(item: any, index: number, options: any) => {
        let title = item.title 
        if(item.name){
          title = item.name
        }
        if(!title){
          title = item.id
        }
        // console.log(item)
        if(title){
          if(confirm(`Delete ${title} ?`)){
            if($model){
              try{
                await $model.delete(item.id)
                await init($table)
              }catch(e){
                alert(e)
              }

            }
          }
        }
      },
        edit: (item: any, index: number, options: any, linkCls: string, gridAction: any) => {

        /*
        return (
          <>
            <button class={linkCls} on:click={(evt) => onEditRow(item, index, options, linkCls, gridAction)}>
              <i class="bi bi-pencil-square"></i>
              {gridAction.state.editMode ? "Save" : "Edit"}
            </button>
            {gridAction.state.editMode && (
              <button class={"ml-2 " + linkCls} on:click={(evt) => onCancelRow(item, index, options, linkCls, gridAction)}>
                <i class="bi bi-x-circle"></i> Cancel
              </button>
            )}
          </>
        )
          */
      },
    },
  }
  const gridOptions = writable<GridOptionsInterface>({...defaultGridOptions})

  model.subscribe((value) => {
    if (value) {
      const nGridOptions = $gridOptions
      if ($conf) {
        nGridOptions.routeApp = routeApp
        nGridOptions.headers = $conf.headers
        nGridOptions.fields = $conf.fields
        nGridOptions.editors = $conf.editors
      }
      nGridOptions.editorFactory = editorFactory
      console.log(nGridOptions)
      gridOptions.update((o) => ({ ...o, ...nGridOptions }))
    }
  })

  function entryPoint() {
    if (params.table) {
      table.update((o) => params.table)
    }
  }

  function init(table: string | null = null) {
    if (table) {
      setModelAndConf(table)
      updateList(1,$grid.limit)
    }
  }
  table.subscribe((value) => {
    init(value)
  })
  onMount(() => {
    entryPoint()
  })
  afterUpdate(() => {
    // console.log(`before update`)
    entryPoint()
  })
</script>

{#if model}
  {#if $loading}
    Loading ....
  {:else}
    <div class="  my-4 border mb-2 rounded-xl shadow-sm p-6 dark:bg-gray-800 dark:border-gray-700" id={`db-table-explorer-${table}`}>
      <div class="flex flex-col">
        <div
          class="-m-1.5 overflow-x-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-slate-700 dark:[&::-webkit-scrollbar-thumb]:bg-slate-500"
        >
          <div class="p-1.5 min-w-full inline-block align-middle">
            <div>
              <GridTable options={$gridOptions} records={$grid.records} page={$grid.page} limit={$grid.limit} />
            </div>
          </div>
        </div>
        <div class="pager-container mt-3">
          <Pager path={`/database/${table}`} page={$grid.page} total_pages={$grid.totalPages} limit={$grid.limit} {onRefresh} />
        </div>
      </div>
    </div>
  {/if}
{:else}
  {errorMessage}
{/if}
<svelte:component this={deleteActionDynamicComponent}>
  Dynamic content
</svelte:component>