<script lang="ts">
  import Toast from "@/global/components/ux/Toast.svelte"
  import { onMount } from "svelte"
  import FetchStateInfo from "./add-course-page/FetchStateInfo.svelte"
  import { getUrlSearchParams } from "@/global/fn/getUrlSearchParams"
  import MSetting from "@/global/db/models/MSetting"
  import { writable } from "svelte/store"
  import type DBStore from "@/global/db/DBStore"
  import PrxCache from "@/global/classes/PrxCache"
  import { createDownloadFile } from "@/global/fn/createDownloadFile"
  import { getM3RecByType } from "@/content-scripts/inject/fn/legacy/getM3RecByType"
  import {
    fetchXmlDoc,
    getCourseSectionTocsFromDoc,
  } from "@/global/classes/course-api/fn"
  import { courseUrlFromSlug } from "@/global/fn/course/courseUrlFromSlug"
  import { getCourseInfoFromDoc } from "@/global/classes/course-api/fn/getCourseInfoFromDoc"
  import { getCourseAuthorsFromDoc } from "@/global/classes/course-api/fn/getCourseAuthorsFromDoc"
  import CourseInfoDetail from "@/options/pages/course/add-course-page/CourseInfoDetail.svelte"
  import type {
    CourseAuthorInterface,
    CourseInfoInterface,
    TocInterface,
    TocSecInterface,
  } from "@/global/classes/types"
  import { getCourseInfoLegacy } from "@/global/fn/course/legacy/parser/getCourseInfoLegacy"
  import { getCourseAuthorsLegacy } from "@/global/fn/course/legacy/parser/course/getCourseAuthorsLegacy"
  import ICRDQueueMan from "@/options/pages/course/add-course-page/ICRDQueueMan.svelte"
  import { getCourseTocsLegacy } from "@/global/fn/course/legacy/parser/toc/getCourseTocsLegacy"
  import RoutesApp from "@/options/components/RoutesApp.svelte";

  export let store: DBStore
  export let params: any = null
  export let queryString: string = ""
  export let routeApp: RoutesApp

  let toastRef: Toast
  const loading = writable(true)
  const mSetting = store.get("Setting") as MSetting
  const mPrxCache = PrxCache.getInstance()
  let courseInfo = writable<CourseInfoInterface | null>(null)
  let courseAuthors = writable<CourseAuthorInterface[]>([])
  let tocsBySections = writable<TocSecInterface>({})
  let icrdQueueManRef: ICRDQueueMan

  let fetchStateInfoRef: FetchStateInfo
  store.onReady(() => loading.set(false))
  const clearDetails = () => {
    courseInfo.update((o) => null)
    courseAuthors.update((o) => [])
  }
  onMount(() => {
    if (store.isReady()) loading.set(false)
    clearDetails()

    if (routeApp) {
      routeApp.addRouteChangeCallback(() => {
        clearDetails()
      }, "add-course-page")
    }
  })
  function fetchCourseTocsSecs(
    courseInfo_: CourseInfoInterface | null,
    mode: string,
    docOrDs: any,
    courseSlug: string
  ) {
    let tocsBySections: TocSecInterface = {}

    if (courseInfo_) {
      if (Array.isArray(courseInfo_.sections)) {
        for (const section of courseInfo_.sections) {
          const { itemStars, slug: sectionSlug } = section
          let tocs: TocInterface[] | null = null
          if (mode === "legacy") {
            tocs = getCourseTocsLegacy(docOrDs, itemStars)
          } else {
            tocs = getCourseSectionTocsFromDoc(section, docOrDs, courseSlug)
          }
          if (Array.isArray(tocs)) {
            tocsBySections[sectionSlug as keyof TocSecInterface] = tocs
          } else {
            tocsBySections[sectionSlug as keyof TocSecInterface] = []
          }
        }
      }
    }
    console.log({ tocsBySections })
    return tocsBySections
  }
  async function onFetchCourseLegacy(slug: string) {
    const result = await mPrxCache.get(slug)
    const ds = result.content
    // createDownloadFile(JSON.stringify(ds), "legacy-m3rec.json")
    const rows = getM3RecByType(
      "com.linkedin.learning.api.deco.content.Course",
      ds
    )
    const courseInfoTMP = getCourseInfoLegacy(ds, slug)
    const courseAuthorsTMP = getCourseAuthorsLegacy(ds, slug)
    const tocsBySectionsTMP: TocSecInterface = fetchCourseTocsSecs(
      courseInfoTMP,
      "legacy",
      ds,
      slug
    )

    tocsBySections.update((o) => tocsBySectionsTMP)

    courseInfo.update((o) => courseInfoTMP)
    courseAuthors.update((o) => courseAuthorsTMP)

    console.info({ rows, ds })
  }

  async function onFetchCourse(slug: string) {
    // Implement non-legacy mode fetch logic here


    const { doc, statusCode, errorMessage } = await fetchXmlDoc(
      courseUrlFromSlug(slug),
      true
    )

    if (statusCode === 200) {
      // const html = doc.html()
      // createDownloadFile( html,`${slug}.xml`)
      const courseInfoTMP = getCourseInfoFromDoc(doc, slug)
      const courseAuthorsTMP = getCourseAuthorsFromDoc(doc)
      const tocsBySectionsTMP: TocSecInterface = fetchCourseTocsSecs(
        courseInfoTMP,
        "non-legacy",
        doc,
        slug
      )

      tocsBySections.update((o) => tocsBySectionsTMP)
      courseInfo.update((o) => courseInfoTMP)
      courseAuthors.update((o) => courseAuthorsTMP)
      console.info({ courseAuthorsTMP })
    }
  }
  async function onFetch() {
    fetchStateInfoRef.setLoading(true)

    fetchStateInfoRef.setRunLevel(1)
    fetchStateInfoRef.setStatusCode(200)


    const searchParams = getUrlSearchParams(queryString) as any
    // console.log(searchParams.legacyMode)
    const legacyMode = searchParams.legacyMode === "true"
    const { slug } = params

    try {
      if (legacyMode) {
        await onFetchCourseLegacy(slug)
      } else {
        await onFetchCourse(slug)
      }
      toastRef.add("Fetch completed successfully")
      if (icrdQueueManRef) {
        if ($courseInfo !== null) {
          const {courseId} = await icrdQueueManRef.processQueue(
                  $courseInfo,
                  $courseAuthors,
                  $tocsBySections
          )
          if (routeApp) {
            routeApp.navigate(`/course/display/${courseId}/${slug}`)
          }
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toastRef.add(`Error during fetch: ${error.message}`, "error")
      } else {
        toastRef.add("An unknown error occurred during fetch", "error")
      }
    }
    fetchStateInfoRef.setLoading(false)
    fetchStateInfoRef.setRunLevel(2)
  }

  function onRetry() {
    onFetch()
  }
</script>

<Toast bind:this={toastRef} />

{#if $loading}
  <span><i class="fa fa-spin fa-spinner" /></span>
{:else}
  <div class="add-course-page">This is add course-page</div>
  <FetchStateInfo
    bind:this={fetchStateInfoRef}
    name="Course Info"
    {onFetch}
    {onRetry}
  />
  <CourseInfoDetail
    courseInfo={$courseInfo}
    courseAuthors={$courseAuthors}
    tocsBySections={$tocsBySections}
  />
  <ICRDQueueMan {routeApp} {store} bind:this={icrdQueueManRef} />
{/if}
