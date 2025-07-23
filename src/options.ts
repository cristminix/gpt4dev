import OptionsApp from "./OptionsApp.svelte"
import { mount } from "svelte"

// const app = document.querySelector("body")!
const app = document.querySelector<HTMLDivElement>("#app")!

mount(OptionsApp, { target: app })
