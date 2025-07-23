<script lang="ts">
  // import { onMount } from "svelte"
  import CustomToast from "./CustomToast.svelte"
  import type { ToastItemInterface, ToastKind } from "./types"
  import { writable } from "svelte/store"

  let toastList = writable<ToastItemInterface[]>([])
  let toastTimeout = 5
  let toastRefs: Array<CustomToast | null> = []

  export function add(message: string, kind: ToastKind = "normal") {
    const availableToastKinds = ["normal", "success", "error", "warning", "closable"]
    if (!availableToastKinds.includes(kind)) {
      kind = "normal"
    }
    const toast: ToastItemInterface = {
      message,
      kind,
      interval: null,
      clock: 0,
      hidden: false,
    }
    const lastToastList = [...$toastList]
    const newToastList: ToastItemInterface[] = []
    const lastToastCount = lastToastList.length
    let lastToastIndexPtr = lastToastCount
    while (--lastToastIndexPtr >= 0) {
      console.log(lastToastIndexPtr)
      const toastItem = lastToastList[lastToastIndexPtr]
      if (!toastItem.hidden) newToastList.push(toastItem)
    }

    toastList.update((o) => [toast, ...o])
  }

  function handleToastUpdate(e: CustomEvent, idx: number) {
    $toastList[idx] = { ...$toastList[idx], ...e.detail.toast, clock: e.detail.clockTimeout || $toastList[idx].clock }
    if ($toastList[idx].hidden) {
      checkUnusedToast()
    }
  }

  function checkUnusedToast() {
    let countHidden = 0

    for (const toast of $toastList) {
      if (toast.hidden) {
        countHidden += 1
      }
    }

    if (countHidden === $toastList.length) {
      toastList.update((o) => [])
      toastRefs = []
    }
  }

  function hideToast(idx: number) {
    const toastItem = $toastList[idx]
    toastItem.hidden = true
    if (toastItem.interval) {
      clearInterval(toastItem.interval!)
    }
    if (toastRefs[idx]) {
      toastRefs[idx].setHidden(true)
    }
    checkUnusedToast()
  }

  function hideToastByTimeout(toastItem: ToastItemInterface, index: number) {
    if (!toastItem.interval) {
      const interval = setInterval(() => {
        toastItem.clock! += 1
        if (toastRefs[index]) {
          toastRefs[index].setClockTimeout(toastTimeout - toastItem.clock!)
        }
        if (toastItem.clock === toastTimeout) {
          hideToast(index)
        }
      }, 1000)
      toastItem.interval = interval
    }
  }

  toastList.subscribe((value: ToastItemInterface[]) => {
    value.map((toastItem: ToastItemInterface, toastIndex: number) => {
      setTimeout(() => hideToastByTimeout(toastItem, toastIndex), 1000)
    })
  })
</script>

<div class="fixed top-0 right-4 m-4" style="z-index: 80;">
  <!-- <code>[{JSON.stringify($toastList)}]</code> -->
  {#each $toastList as toast, index}
    <CustomToast {toast} bind:this={toastRefs[index]} on:update={(e) => handleToastUpdate(e, index)} />
  {/each}
</div>
