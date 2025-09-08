<script lang="ts">
  export let lang = ""
  export let text = ""
</script>

<div class="mt-3 bg-gray-900 rounded-lg dark:bg-neutral-800">
  <div class="px-3 py-1">
    <span class="text-xs text-gray-400 dark:text-neutral-500">{lang}</span>
  </div>
  <div class="code-toolbar">
    <pre class="rounded-lg language-js"><code class="language-js">{text}</code
      ></pre>
  </div>
</div>
