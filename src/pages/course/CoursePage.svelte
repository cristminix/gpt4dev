<script lang="ts">
  import type DBStore from "@/global/db/DBStore"
  import type { TCourse } from "@/global/db/models/schema"
  import { onMount } from "svelte"
  import { writable } from "svelte/store"
  import { getCourseDetail } from "./course-display-page/fn/getCourseDetail"
  import type MCourse from "@/global/db/models/MCourse"

  export let params: any
  export let queryString: any
  export let routeApp: any
  export let store: DBStore
  const course = writable<TCourse | null>(null)
  let mCourse: MCourse
  onMount(() => {
    store.onReady(async () => {
      mCourse = store.get("Course") as MCourse
      console.log("DBStore is ready")
      const courseRec = await getCourseDetail(mCourse, params.id)
      course.update((o) => courseRec)
    })
  })
</script>

<code>
  [{JSON.stringify(course)}]
</code>
<div class="course-page">This is a course-page</div>
