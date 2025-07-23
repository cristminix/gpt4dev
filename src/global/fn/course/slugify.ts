export const slugify = (text: string) => {
  // Normalize the text to remove diacritics and special characters
  const normalizedText = text
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .toLowerCase()
  // Replace spaces with dashes
  const slug = normalizedText.replace(/\s+/g, "-")
  // Remove any remaining non-alphanumeric characters except for dashes
  const finalSlug = slug.replace(/[^a-z0-9-]/g, "")
  // Remove leading and trailing dashes
  return finalSlug.replace(/^-+|-+$/g, "")
}
