export const getUrlSearchParams = (inputUrl: string = window.location.search) => {
  const params = new Proxy(new URLSearchParams(inputUrl), {
    get: (searchParams, prop) => searchParams.get(prop as string),
  })
  return params
}
