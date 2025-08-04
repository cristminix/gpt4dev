export interface RouteAppCallback {
  (path: string, queryString: string | null): void
}

export interface RouteAppLocation {
  url: string
  pathname: string
  queryString: string | null
}

export interface RouteAppProps {
  onRouteChange?: (path: string, queryString: string | null) => void
}

export interface RouteAppExports {
  setUrl: (targetUrl: string) => void
  setRoute: (newUrl: string) => void
  useLocation: () => RouteAppLocation
  getRoute: (url?: string | null) => [string, string | null]
  addRouteChangeCallback: (
    callback: RouteAppCallback,
    key: string,
    keep?: boolean
  ) => void
  onRouteChange: (path: string, queryString: string | null) => void
  triggerRouteChange: (path: string, queryString: string | null) => void
  triggerRouteChangeKey: (inputKey: string) => void
  navigate: (newUrl: string) => void
}

// Complete component  interface
export interface RouteApp extends RouteAppExports {
  $$prop_def: RouteAppProps
}
