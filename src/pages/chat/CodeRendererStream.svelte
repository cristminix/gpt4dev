<script lang="ts">
  export let lang = ""
  export let text = ""
</script>

<div class="my-3 bg-gray-900 rounded-lg dark:bg-neutral-900">
  <div class="px-3 py-1 dark:bg-neutral-900 rounded-lg">
    <span class="text-xs text-gray-400 dark:text-neutral-600">{lang}</span>
  </div>
  <div class="code-toolbar pl-6 pb-2">
    <pre class=""><code class="language-{lang}">{text}</code></pre>
    <div class="toolbar">
      <div class="toolbar-item">
        <button
          class="copy-to-clipboard-button"
          type="button"
          data-copy-state="copy"><span>Copy</span></button
        >
      </div>
    </div>
  </div>
</div>
