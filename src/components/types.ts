import { SvelteComponent } from "svelte"

export interface RouteAppsLocation {
  pathname: string
  url: string
  queryString: string | null
}
export interface RouteAppsProps {
  setUrl: (url: string) => void
  setRoute: (url: string) => void
  useLocation: () => RouteAppsLocation
  getRoute: (url: string | null) => [string, string | null]
  onRouteChange: (path: string, queryString: string | null) => void
}
