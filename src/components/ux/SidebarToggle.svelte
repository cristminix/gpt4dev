<script lang="ts">
  import Breadcrumb from "./Breadcrumb.svelte"
  import { cls2, cls3, cls4, cls5 } from "./cls"

  export let store: any
  export let config: any

  let sidebarTgCls = ""
</script>

<!-- Sidebar Toggle -->
<div class={`sidebar-toggle ${sidebarTgCls}`}>
  <div class={cls2}>
    <!-- Navigation Toggle -->
    <button type="button" data-hs-overlay="#application-sidebar" aria-controls="application-sidebar" aria-label="Toggle navigation" class={cls3}>
      <span class={cls4}> Toggle Navigation </span>
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16" class={cls5}>
        <path
          fill-rule="evenodd"
          d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
        >
        </path>
      </svg>
    </button>
    <!-- End Navigation Toggle -->

    <Breadcrumb />
  </div>
</div>
<!-- End Sidebar Toggle -->
