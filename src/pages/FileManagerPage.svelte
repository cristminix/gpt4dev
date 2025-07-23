<script lang="ts">
  import Fs from "@/global/classes/Fs"
  import Folder from "./file-manager/Folder.svelte"
  //   import useTraverseTree from "./file-manager/useTraverseTree"
  import type {
    TFolderItem,
    TIsSelectedFn,
    TOnSelectFn,
    TSetExpandFn,
  } from "./types"
  import { crc32Id } from "@/global/fn/crc32Id"
  import { writable } from "svelte/store"
  import { onMount } from "svelte"
  import "./file-manager/style.css"
  import { select } from "underscore"
  import FileManagerToolbar from "./file-manager/FileManagerToolbar.svelte"
  let explorerData = writable<TFolderItem | TFolderItem[] | null>()
  type TExplorerState = {
    expanded: any
    selected: any
  }
  let explorerState = writable<TExplorerState>({ expanded: {}, selected: {} })
  //   const { insertNode } = useTraverseTree()
  const fs = new Fs("fs")

  const isExpand = (id: string | number) => {
    return $explorerState.expanded[id] ? true : false
  }
  const setExpand: TSetExpandFn = (payload) => {
    console.log(payload)
    const { id, expanded } = payload
    const state = $explorerState
    const item = { [id]: expanded }
    state.expanded = { ...state.expanded, ...item }
    explorerState.update((o) => state)
  }
  const onSelectItem: TOnSelectFn = (id, path) => {
    const state = $explorerState
    const item = { id, path }
    state.selected = item
    explorerState.update((o) => state)
    console.log(id, path, { state })
  }
  const isSelected: TIsSelectedFn = (id) => {
    if (!$explorerState.selected) return false
    return $explorerState.selected.id === id
  }
  const createUStamp = () => {
    return new Date().getTime().toString()
  }
  const walk = async (dstDir: string | null = null) => {
    let targetDir = !dstDir ? "/" : dstDir
    const isRootDir = targetDir === "/"
    const ls = await fs.readdirSync(targetDir)
    let output: TFolderItem | TFolderItem[] = {
      id: crc32Id(createUStamp()),
      name: targetDir,
      isFolder: true,
      items: [],
    }

    if (!isRootDir) {
      output = []
    }
    if (!Array.isArray(output)) output.isExpanded = isExpand(output.id)

    for (const name of ls) {
      if (name === ".git") continue
      const absPath = `${targetDir === "/" ? "" : targetDir}/${name}`
      const stat = await fs.statSync(absPath)
      const isFolder = stat.type === "dir"

      const item: TFolderItem = {
        id: crc32Id(createUStamp()),
        name,
        isFolder,
        path: absPath,
      }

      if (isFolder) {
        item.isExpanded = isExpand(item.id)

        item.items = (await walk(absPath)) as TFolderItem[]
      }
      if (isRootDir) {
        if (!Array.isArray(output)) {
          if (output.items) output.items.push(item)
        }
      } else {
        if (Array.isArray(output)) {
          output.push(item)
        }
      }
    }

    return output
  }
  const generateExplorerData = async () => {
    const data = await walk()
    explorerData.update((o) => null)
    setTimeout(() => {
      explorerData.update((oData) => data)
    }, 256)
  }
  onMount(() => {
    generateExplorerData()
  })
</script>

<main class=" py-4">
  {#if $explorerState.selected.path}
    <span class="text-sm">{$explorerState.selected.path}</span>
    <FileManagerToolbar />
  {/if}
  <div class="file-explorer-app">
    <div class="left-side">
      {#if explorerData}
        <Folder
          {isSelected}
          onSelect={onSelectItem}
          {setExpand}
          data={$explorerData}
          isRoot={true}
        />
      {/if}
    </div>
    <div class="right-side">
      <slot />
    </div>
  </div>
</main>
