export function autoScrollReasoning(
  containerSelector: string,
  contentSelector: string
) {
  let observer: MutationObserver | null = null

  function initAutoScroll() {
    // Hapus observer yang ada jika ada
    if (observer) {
      observer.disconnect()
    }

    const parentContainer = document.querySelector(containerSelector)
    const contentElement = document.querySelector(contentSelector)

    if (parentContainer && contentElement) {
      // Buat MutationObserver untuk mendeteksi perubahan pada konten
      observer = new MutationObserver(() => {
        // Gulir ke bagian bawah kontainer
        parentContainer.scrollTop = contentElement.scrollHeight
      })

      // Mulai mengamati perubahan pada elemen konten
      observer.observe(contentElement, {
        childList: true,
        subtree: true,
        characterData: true,
        characterDataOldValue: true,
      })

      // Gulir ke bagian bawah segera setelah inisialisasi
      parentContainer.scrollTop = contentElement.scrollHeight
    }
  }

  // Fungsi untuk memperbarui scroll secara langsung
  function updateScroll() {
    const parentContainer = document.querySelector(containerSelector)
    const contentElement = document.querySelector(contentSelector)

    if (parentContainer && contentElement) {
      parentContainer.scrollTop = contentElement.scrollHeight
    }
  }

  // Fungsi untuk membersihkan observer
  function cleanup() {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  }

  return {
    initAutoScroll,
    updateScroll,
    cleanup,
  }
}
