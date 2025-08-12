import type { SvelteComponent } from "svelte"

declare class Toasts extends SvelteComponent {
  /**
   * Trigger the toast notification
   */
  doToast(t: string, message: string): void
}

export default Toasts
