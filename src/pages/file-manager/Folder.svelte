<script lang="ts">
  import { writable } from "svelte/store"
  import { onMount } from "svelte"
  import type {
    TFolderFileCreationFn,
    TFolderItem,
    TIsSelectedFn,
    TOnSelectFn,
    TSetExpandFn,
  } from "../types"

  export let isSelected: TIsSelectedFn
  export let onSelect: TOnSelectFn
  export let data: TFolderItem | TFolderItem[] | null
  export let isRoot: boolean
  export let setExpand: TSetExpandFn

  let isExpand = writable(data ? data.isExpanded : false)
  let selected = writable(data ? data.selected : false)

  const setExpanded = () => {
    isExpand.update((n) => {
      const expanded = !n
      setExpand({ id: data.id, expanded })
      return expanded
    })
  }

  onMount(() => {
    console.log(data)
  })
</script>

{#if data}
  {#if data.isFolder}
    <section class="folder {isRoot ? 'root-folder' : ''}">
      <button
        type="button"
        on:click={() => {
          setExpanded()
          onSelect(data.id, data.path ?? "")
        }}
        on:keydown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            setExpanded()
            onSelect(data.id, data.path ?? "")
          }
        }}
        class="folder-wrap {isSelected(data.id) ? 'selected' : ''}"
      >
        <div class="icon-wrap">
          {#if $isExpand}
            <i class="fa fa-caret-down mr-2" />
            <i class="fa fa-folder mr-1" />
          {:else}
            <i class="fa fa-caret-right mr-2" />
            <i class="fa fa-folder mr-1" />
          {/if}
          <span class="folder-name mr-1">{data.name}</span>
        </div>
        <div class="folder-toolbar-action"></div>
      </button>

      <div style="display: {$isExpand ? 'block' : 'none'};">
        {#if data.items}
          {#each data.items.sort() as item}
            <svelte:self
              {isSelected}
              {onSelect}
              explorerData={data}
              {setExpand}
              data={item}
            />
          {/each}
        {/if}
      </div>
    </section>
  {:else}
    <button
      type="button"
      on:click={() => {
        onSelect(data.id, data.path ?? "")
      }}
      on:keydown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onSelect(data.id, data.path ?? "")
        }
      }}
      class="file {isSelected(data.id) ? 'selected' : ''}"
    >
      <i class="fa fa-file mr-2" />
      <span class="filename {isSelected(data.id) ? 'selected' : ''}"
        >{data.name}</span
      >
    </button>
  {/if}
{/if}
