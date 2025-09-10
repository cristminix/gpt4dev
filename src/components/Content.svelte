<script lang="ts">
</script>

<button
  type="button"
  aria-haspopup="dialog"
  aria-expanded="false"
  aria-controls="hs-unstyled-modal"
  data-hs-overlay="#hs-unstyled-modal"
>
  Open modal
</button>

<div
  id="hs-unstyled-modal"
  class="hs-overlay hidden size-full fixed top-0 start-0 z-60 overflow-x-hidden overflow-y-auto pointer-events-none"
  role="dialog"
  tabindex="-1"
  aria-labelledby="hs-unstyled-modal-label"
>
  <div
    class="hs-overlay-open:opacity-100 hs-overlay-open:duration-500 opacity-0 transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto"
  >
    <div class="pointer-events-auto">
      <h3 id="hs-unstyled-modal-label">Title</h3>
      Modal content
    </div>
  </div>
</div>
<main class="w-full lg:ps-64 text-neutral-200 template-content">
  <slot />
</main>
