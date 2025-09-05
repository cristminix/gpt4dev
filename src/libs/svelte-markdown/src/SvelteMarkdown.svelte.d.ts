// Type definitions for SvelteMarkdown.svelte
import type { SvelteComponentTyped } from "svelte"
import type { MarkedExtension as MarkedConfig, TokensList } from "marked"

interface Renderers {
  // Anda bisa menambahkan tipe renderer spesifik di sini jika diperlukan
  [key: string]: any
}

interface SvelteMarkdownProps {
  /**
   * The Markdown source to be parsed, or an array of tokens to be rendered directly.
   */
  source?: string | TokensList

  /**
   * An object where the keys represent a node type and the value is a Svelte component. This
   * object will be merged with the default renderers.
   */
  renderers?: Partial<Renderers>

  /**
   * Options for marked
   */
  options?: MarkedConfig

  /**
   * To use inline markdown, you can assign the prop `isInline` to the component.
   */
  isInline?: boolean
}

export default class SvelteMarkdown extends SvelteComponentTyped<
  SvelteMarkdownProps,
  { parsed: CustomEvent<{ tokens: TokensList }> },
  { default: {} }
> {}
