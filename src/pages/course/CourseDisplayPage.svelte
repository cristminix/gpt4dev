<script lang="ts">
  import type DBStore from "@/global/db/DBStore"
  import type {
    TExerciseFile,
    TThumbnail,
    TAuthor,
    TCourse,
  } from "@/global/db/models/schema"
  import { onMount } from "svelte"
  import { writable } from "svelte/store"
  import {
    getCourseDetail,
    type TGetCourseDetailResult,
  } from "./course-display-page/fn/getCourseDetail"
  import type MCourse from "@/global/db/models/MCourse"
  import type MExerciseFile from "@/global/db/models/MExerciseFile"
  import type MThumbnail from "@/global/db/models/MThumbnail"
  import { JsonView } from "@zerodevx/svelte-json-view"
  import { data } from "jquery"
  import type MAuthor from "@/global/db/models/MAuthor"
  import type MAuthorCourse from "@/global/db/models/MAuthorCourse"
  import Fs from "@/global/classes/Fs"
  import FsImage from "./course-display-page/fn/FsImage.svelte"
  import { courseUrlFromSlug } from "@/global/fn/course/courseUrlFromSlug"
  import CourseAuthors from "./CourseAuthors.svelte"
  import type { T } from "vitest/dist/chunks/environment.LoooBwUu"
  import { formatDuration } from "@/global/fn/formatDuration"

  export let params: any
  export let queryString: any
  export let routeApp: any
  export let store: DBStore
  export let sourceParam: any
  // const courseDetail = writable<TGetCourseDetailResult | null>(null)
  const fs = new Fs("fs")
  let course = writable<TCourse | null>(null)
  let authors = writable<TAuthor[]>([])
  let exerciseFiles = writable<TExerciseFile[]>([])
  let thumbnails = writable<TThumbnail[]>([])
  let mCourse: MCourse
  let mExerciseFile: MExerciseFile
  let mThumbnnail: MThumbnail
  let mAuthor: MAuthor
  let mAuthorCourse: MAuthorCourse
  let selectedThumbnail = writable<TThumbnail | null>(null)
  const loadModels = () => {
    mCourse = store.get("Course") as MCourse
    mExerciseFile = store.get("ExerciseFile") as MExerciseFile
    mThumbnnail = store.get("Thumbnail") as MThumbnail
    mAuthor = store.get("Author") as MAuthor
    mAuthorCourse = store.get("AuthorCourse") as MAuthorCourse
  }
  const loadData = async (courseId: number) => {
    loadModels()
    console.log("loadData", courseId)
    const courseDetailsRec = await getCourseDetail(
      mCourse,
      mExerciseFile,
      mThumbnnail,
      mAuthor,
      mAuthorCourse,
      courseId
    )
    console.log({ courseDetailsRec })
    const {
      course: course_,
      authors: authors_,
      exerciseFiles: exerciseFiles_,
      thumbnails: thumbnails_,
    } = courseDetailsRec
    thumbnails.update((o) => [])
    selectedThumbnail.set(null)
    setTimeout(() => {
      course.update((o) => course_)
      authors.update((o) => authors_)
      exerciseFiles.update((o) => exerciseFiles_)
      thumbnails.update((o) => thumbnails_)
      selectedThumbnail.set(getLargestThumbnail(thumbnails_))
    }, 512)
  }
  onMount(() => {
    store.onReady(() => {
      console.log("DBStore is ready", params)
      loadData(params.id)
    })
    // if (sourceParam) {
    //   sourceParam.subscribe((o) => {
    //     console.log("sourceParam", o)
    //     if (o && o.id) {
    //       loadData(o.id)
    //     }
    //   })
    // }
    if (routeApp) {
      // routeApp.addRouteChangeCallback(() => {
      //   const [a, self] = arguments
      //   console.log("route change", { self })
      //   loadData(self.params.id)
      // }, "course-display-page")
    }
  })
  $: {
    loadData(params.id)
  }
  const getLargestThumbnail = (sources: TThumbnail[]) => {
    let largest = 0
    let selected: TThumbnail | null = null
    sources.forEach((thumbnail) => {
      const [width, height] = thumbnail.size.split("x")
      const size = parseInt(width) * parseInt(height)
      if (!largest) {
        largest = size
      } else {
        if (size > largest) {
          largest = size
          selected = thumbnail
        }
      }
    })
    return selected
  }
const blankImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PmYz+QAAAABJRU5ErkJggg=="  
</script>

<!-- <code>
  [{JSON.stringify(params)}]
</code> -->
{#if $course}
  <div
    class=" bg-gray-800 rounded-xl overflow-hidden shadow-lg flex flex-col md:flex-row gap-6 p-6"
  >
    <!-- Thumbnail -->
    <div class="flex-shrink-0">
      <div class="relative">
        {#if $selectedThumbnail !== null}
          <FsImage
            {fs}
            cls="w-full md:w-[280px] h-[180px] object-cover rounded-lg"
            path={$selectedThumbnail.path ?? ""}
            alt={$selectedThumbnail.path ?? ""}
            title={$selectedThumbnail.size}
            {blankImage}
          />
        {/if}

        <!-- <div
          class="absolute top-2 left-2 bg-indigo-900 text-white text-xs px-2 py-1 rounded-md font-semibold"
        >
          Ae
        </div> -->
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 space-y-4">
      <div>
        <h2 class="text-2xl font-bold leading-snug">
          {$course?.title}
        </h2>
        <p class="text-sm text-gray-400 mt-1">
          {#each $authors as author, index}
            {author.name}
            {#if index < $authors.length - 1},
            {/if}
          {/each}
        </p>
        <p class="text-sm text-gray-400 flex items-center gap-2 mt-1">
          <span>⏱️</span>
          {formatDuration($course?.duration)}
        </p>
      </div>

      <p class="text-gray-300 text-sm">
        {$course?.description}
      </p>
    </div>
  </div>
{/if}
