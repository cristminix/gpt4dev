export function cleanHtmlMarkup(input: string): string {
  // Remove HTML tags
  let cleaned = input.replace(/<[^>]*>/g, '');
  
  // Replace HTML entities
  cleaned = cleaned.replace(/&nbsp;/g, ' ')
                   .replace(/&amp;/g, '&')
                   .replace(/&lt;/g, '<')
                   .replace(/&gt;/g, '>')
                   .replace(/&quot;/g, '"')
                   .replace(/&#39;/g, "'");
  
  // Remove extra whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  return cleaned;
}