import type { SvelteComponentTyped } from "svelte"
import About from "../components/About.svelte"
import Contact from "../components/Contact.svelte"
import NotFound from "../components/NotFound.svelte"
import CoursePage from "./course/CoursePage.svelte"
import CourseDisplayPage from "./course/CourseDisplayPage.svelte"
import AddCoursePage from "./course/AddCoursePage.svelte"
import FileManagerPage from "./FileManagerPage.svelte"

type Route = {
  path: string
  component: new (...args: any[]) => SvelteComponentTyped<any>
}

type Params = Record<string, string>

export function createRouter() {
  const routes: Route[] = [
    { path: "/about", component: About },
    { path: "/contact", component: Contact },
    { path: "/contact/:id", component: Contact },
    { path: "/contact/page/:page", component: Contact },
    { path: "/course", component: CoursePage },
    { path: "/course/display/:id/:slug", component: CourseDisplayPage },
    { path: "/course/add/:slug", component: AddCoursePage },
    { path: "/file-manager", component: FileManagerPage },
  ]

  function match(path: string) {
    for (const route of routes) {
      const pattern = new RegExp("^" + route.path.replace(/:[^\s/]+/g, "([\\w-]+)") + "$")
      const matches = path.match(pattern)
      if (matches) {
        const params: Params = {}
        const paramNames = route.path.match(/:[^\s/]+/g) || []
        paramNames.forEach((param, index) => {
          const key = param.slice(1)
          params[key] = matches[index + 1]
        })
        return { component: route.component, params }
      }
    }
    return null
  }

  return {
    match,
    notFoundComponent: NotFound,
  }
}
