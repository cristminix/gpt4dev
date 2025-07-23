<script lang="ts">
  import type {CourseAuthorInterface, CourseInfoInterface, TocSecInterface} from "@/global/classes/types";
  import { JsonView } from '@zerodevx/svelte-json-view'

    export let courseInfo: CourseInfoInterface |null= null
    export  let courseAuthors: CourseAuthorInterface[] = []
  export let tocsBySections: TocSecInterface = {}
</script>

{#if courseInfo}
  <div class="course-info">
    <JsonView json={courseInfo} />
    <!-- <h2 class="text-2xl">{courseInfo.title}</h2>
    <p>{courseInfo.description}</p> -->
  </div>
  <div class="course-authors">
      <h3 class="text-xl">Authors</h3>
      <JsonView json={courseAuthors} />
  </div>
  <div class="tocs-by-sections">
    <h3 class="text-xl">Tocs by Sections</h3>
    <JsonView json={tocsBySections} />
  </div>
{/if}