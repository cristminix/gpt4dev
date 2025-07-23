<script lang="ts">
  import { onMount, afterUpdate } from "svelte"
  import { createEventDispatcher } from "svelte"

  export let id: string
  export let checked: boolean
  export let label: string
  export let className: string
  export let tabIndex: number
  export let onChange: (checked: boolean) => void

  let ckRef: HTMLInputElement | null = null
  const dispatch = createEventDispatcher()

  const onCheckChange = (e: Event) => {
    setTimeout(() => {
      if (ckRef) {
        console.log(ckRef.checked)
        onChange(ckRef.checked)
        dispatch("change", ckRef.checked)
      }
    }, 256)
  }

  onMount(() => {
    setTimeout(() => {
      if (ckRef) {
        ckRef.checked = checked
      }
    }, 256)
  })

  afterUpdate(() => {
    if (ckRef) {
      ckRef.checked = checked
    }
  })
</script>

<div class={`flex ${className}`}>
  <input
    {tabIndex}
    bind:this={ckRef}
    on:click={onCheckChange}
    type="checkbox"
    class="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
    {id}
  />
  <label for="hs-default-checkbox" class="text-sm text-gray-500 ms-3 dark:text-gray-400">{label}</label>
</div>
