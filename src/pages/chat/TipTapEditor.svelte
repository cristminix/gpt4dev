<script>
  import { onMount, onDestroy } from "svelte"
  import { Editor } from "@tiptap/core"
  import StarterKit from "@tiptap/starter-kit"
  import Placeholder from "@tiptap/extension-placeholder"
  import OrderedList from "@tiptap/extension-ordered-list"
  let element
  let editor

  onMount(() => {
    editor = new Editor({
      element: element,
      extensions: [
        StarterKit,
        Placeholder.configure({
          placeholder: "Add a message, if you'd like.",
          emptyNodeClass: "text-gray-800 dark:text-neutral-200",
        }),
        OrderedList.configure({
          HTMLAttributes: {
            class: "list-decimal list-inside text-gray-800 dark:text-white",
          },
        }),
      ],
      content: "<p>Hello World! 🌍️ </p>",
      onTransaction: () => {
        // force re-render so `editor.isActive` works as expected
        editor = editor
      },
    })
  })

  onDestroy(() => {
    if (editor) {
      editor.destroy()
    }
  })
</script>

<div class="max-w-6xl mx-auto sticky bottom-0 z-10 p-3 sm:py-6">
  {#if editor}
    <button
      on:click={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      class:active={editor.isActive("heading", { level: 1 })}
    >
      H1
    </button>
    <button
      on:click={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      class:active={editor.isActive("heading", { level: 2 })}
    >
      H2
    </button>
    <button
      on:click={() => editor.chain().focus().setParagraph().run()}
      class:active={editor.isActive("paragraph")}
    >
      P
    </button>
  {/if}

  <div bind:this={element} />
</div>

<style>
  button.active {
    background: black;
    color: white;
  }
</style>
