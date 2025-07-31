export function createProviderUsername(provider: any) {
  return `${provider.model}:${provider.label}`.trim()
}
