<script>
  export let content
</script>

<li
  class="max-w-6xl py-2 px-4 sm:px-6 lg:px-8 mx-auto flex gap-x-2 sm:gap-x-4 bg-slate-700 pt-4 rounded-md conversation-item user-message"
>
  <div class="grow max-w-[95%] w-full">
    <div class="flex gap-x-2 sm:gap-x-4">
      <span
        class="shrink-0 inline-flex items-center justify-center size-9.5 rounded-full bg-gray-600"
      >
        <img
          class="shrink-0 size-9.5 rounded-full"
          src="https://yt3.ggpht.com/12FI-egQT8pzC2MrkVzR2TgjIX7ul6mxmqTvrLd21m_rvUzQyVIAy4Phtv7J2TBp0Vi37PMh0iA=s88-c-k-c0x00ffffff-no-rj"
          alt="Avatar"
        />
      </span>

      <div class="space-y-3 inner-content">
        {content}
      </div>
    </div>
  </div>
</li>
