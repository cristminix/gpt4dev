export function cleanQuotes(input: string): string {
  // Replace various quote types with standard double quotes
  let cleaned = input
    .replace(/[\u2018\u2019]/g, "'") // Smart single quotes
    .replace(/[\u201C\u201D]/g, '"') // Smart double quotes
    .replace(/[\u0060\u00B4]/g, "'") // Backticks and acute accents
    .replace(/['"]/g, "")

  return cleaned
}
