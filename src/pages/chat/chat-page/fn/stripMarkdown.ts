export function stripMarkdown(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1") // Bold
    .replace(/\*(.*?)\*/g, "$1") // Bold
    .replace(/\_(.*?)\_/g, "$1") // Italic
    .replace(/`(.*?)`/g, "$1") // Inline code
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1") // Links
    .replace(/#(.*?)/g, "$1") // Headers
}
