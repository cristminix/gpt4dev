import { vitePreprocess } from "@sveltejs/vite-plugin-svelte"

export default {
  // Consult https://svelte.dev/docs#compile-time-svelte-preprocess
  // for more information about preprocessors
  preprocess: vitePreprocess(),
  onwarn: (warning, handler) => {
    // Menonaktifkan peringatan aksesibilitas
    if (warning.code.startsWith("a11y-")) {
      return
    }
    // Menonaktifkan peringatan untuk properti export yang tidak digunakan
    if (warning.code === "export_let_unused") {
      return
    }
    handler(warning)
  },
}
