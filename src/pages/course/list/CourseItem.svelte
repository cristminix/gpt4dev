<script lang="ts">
    export let store:any
    export let config:any
    export let course:any

    let thumbnailUrl = null
    if (course) {
    // console.log(course)
    const thumbnails = store.get("Thumbnail").getListByCourseId(course.id)
    // console.log(thumbnails)
    if (thumbnails.length > 0) {
      const thumbnail = thumbnails[thumbnails.length - 1]
      if (!isTimeExpired(thumbnail.expiresAt)) {
        thumbnailUrl = thumbnail.url
      } else {
        console.error(`Thumbnail expired`)
      }
    }
  }
  const authors = store.get("Author").getListByCourse(course)
</script>
<div class="course-display flex gap-2 mb-2 bg-gray-50 dark:bg-slate-800 p-4">
    {thumbnailUrl ? (
      <div
        style={{ backgroundImage: `url('${thumbnailUrl}'` }}
        class={`flex-none min-h-[128px] w-[256px] bg-cover thumbnail-container rounded rounded-md  `}
      ></div>
    ) : null}
    <div class="">
      <div class="pl-2">
        <div>
          <h4 class="text-2xl">
            {" "}
            <a class="" href={`#/manager/${course.slug}`}>
              {course.title}
            </a>
          </h4>
          <CourseAuthors authors={authors} noLinks={true} />

          <p class="pt-2">
            {course.description.replace(
              "com.linkedin.learning.api.common.AttributedText",
              ""
            )}
          </p>
        </div>
        <div class="p-2">
          {/* <i class="fa fa-external-link"/></a> */}
        </div>
      </div>
    </div>
  </div>