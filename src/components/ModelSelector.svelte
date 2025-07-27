<script lang="ts">
  import { set } from "idb-keyval"
  import jquery from "jquery"
  import { writable } from "svelte/store"
  const providerList = writable([])
  const modelList = writable([])
  let firstTimer = 0
  export function getModelConfig() {
    return JSON.parse(localStorage.getItem("modelConfig") || "{}")
  }
  function setModelConfig(provider = null, model = null) {
    const oldConfig = getModelConfig()
    console.log({ oldConfig, firstTimer, provider, model })
    firstTimer++

    const modelConfig = {
      provider: provider ?? jquery("#provider").val(),
      model: model ?? jquery("#model").val(),
    }
    console.log(typeof modelConfig.model)
    // if (!model && oldConfig.provider === provider) return
    if (modelConfig.model == "") {
      console.log($modelList)
      for (const model of $modelList) {
        // console.log(model)
        if (Array.isArray(model.models)) {
          modelConfig.model = model.models[0].model
        } else {
          modelConfig.model = model.model
        }
      }
    }
    console.log(modelConfig)

    localStorage.setItem("modelConfig", JSON.stringify(modelConfig))
  }
  async function initProviderData() {
    const providerListSet = await fetch("api/backend-api/v2/providers").then(
      (r) => r.json()
    )
    // console.log(providerListSet)
    providerList.update((o) => providerListSet)
  }
  async function initModelData(providerName: string) {
    const modelListSet = await fetch(
      `api/backend-api/v2/models/${providerName}`
    ).then((r) => r.json())
    modelList.update((o) => modelListSet)
    setTimeout(() => {
      setModelConfig(providerName)
    }, 256)
  }
  async function loadProviderList() {
    await initProviderData()
  }
  providerList.subscribe((o) => {
    const modelConfig = getModelConfig()
    const { provider } = modelConfig
    setTimeout(() => {
      if (provider) {
        jquery("#provider").val(provider)
        jquery("#provider").trigger("change")
        onProviderChange()
      }
    }, 1000)

    console.log(modelConfig)
  })
  modelList.subscribe((o) => {
    // console.log(o)
  })
  async function onProviderChange(e: any) {
    try {
      const providerName = e.target.value
      await initModelData(providerName)
    } catch (error) {
      const modelConfig = getModelConfig()
      const { provider } = modelConfig
      await initModelData(provider)
    }

    // console.log({ provider })
  }
  $: loadProviderList()

  function isModelSelected(model, provider, index) {
    const modelConfig = getModelConfig()
    if (
      (provider ? modelConfig.provider === provider : true) &&
      modelConfig.model === model
    )
      return true
    return index === 0
  }
</script>

<div class="relative">
  <div
    class="model-container-parent absolute inset-y-0 start-0 flex items-center z-20 ps-3.5"
  >
    <div class="field flex items-center gap-2">
      {#if $modelList.length > 0}
        <select
          name="model"
          id="model"
          on:change={(e) => setModelConfig(null, e.target.value)}
          class="w-full py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
        >
          {#each $modelList as model, index}
            {#if Array.isArray(model.models)}
              <option value="" disabled>{model.group}</option>
              {#each model.models as subModel, subIndex}
                <option
                  value={subModel.model}
                  selected={isModelSelected(model.model, null)}
                  >{subModel.label}</option
                >
              {/each}
            {:else}
              <option
                value={model.model}
                selected={isModelSelected(model.model, null)}
                >{model.label}</option
              >
            {/if}
          {/each}
        </select>
      {/if}
    </div>
    <div class="relative model-container">
      {#if $providerList.length > 0}
        <select
          name="provider"
          id="provider"
          on:change={onProviderChange}
          class="py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
        >
          {#each $providerList as provider}
            {#if provider.active_by_default || true}
              <option value={provider.name}
                >{provider.label}
                {provider.auth ? "🗝" : ""}
                {provider.image > 0 ? "📷" : ""}
                {provider.video > 0 ? "📹" : ""}</option
              >
            {/if}
          {/each}
        </select>
      {/if}

      <div class="absolute top-1/2 end-2.5 -translate-y-1/2">
        <svg
          class="shrink-0 size-4 text-gray-500 dark:text-neutral-500"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m7 15 5 5 5-5"></path>
          <path d="m7 9 5-5 5 5"></path>
        </svg>
      </div>
    </div>
  </div>
</div>
