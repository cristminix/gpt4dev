export function autoScroll() {
  setTimeout(() => {
    const templateContent = document.querySelector(".template-content")
    if (templateContent) {
      window.scrollTo({
        top: templateContent.scrollHeight + 200,
        behavior: "smooth", // Optional: smooth scrolling
      })
    }
  }, 1000)
}
