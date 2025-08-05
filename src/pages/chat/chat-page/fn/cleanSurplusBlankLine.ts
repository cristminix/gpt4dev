export function cleanSurplusBlankLine(input: string): string {
  // Replace multiple consecutive blank lines with a single blank line
  return input.replace(/(\n\s*)+\n+/g, '\n');
}