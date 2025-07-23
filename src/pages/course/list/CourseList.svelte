<script lang="ts">
  import { writable } from "svelte/store"

  const courseList = writable([])
  async function loadCourseList() {
    // const courses = store.get("Course").getList()
    // setCourseList(courses)
    // setInitial(false)
    // courseList.update(o=>data)
  }
</script>

{#each courseList as course, index}{/each}
