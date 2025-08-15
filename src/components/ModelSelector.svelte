<script lang="ts">
  import jquery from "jquery"
  import { writable } from "svelte/store"
  import {
    Client,
    CorsProxyManager,
    Custom,
    PollinationsAI,
    DeepInfra,
    Together,
    Puter,
    HuggingFace,
  } from "@/pages/chat/chat-page/classes/cors-proxy-manager/CorsProxyManager"
  // Definisikan interface untuk tipe data
  interface Model {
    model: string
    label: string
    group?: string
    models?: Model[]
    image?: number
    video?: number
    audio?: number
  }

  interface Provider {
    name: string
    label: string
    auth?: boolean
    image?: number
    video?: number
    audio?: number
    active_by_default?: boolean
  }

  const providerList = writable<Provider[]>([])
  const modelList = writable<Model[]>([])
  let firstTimer = 0
  const liveProviderList = [
    "PollinationsAI",
    "Puter",
    "Together",
    "DeepInfra",
    "HuggingFace",
  ]
  const liveProviderLabes = liveProviderList.map((p) => `${p}-Live`)
  import { getModelConfig } from "@/global/store/chat/getModelConfig"
  import { setModelConfig } from "@/global/store/chat/setModelConfig"

  function doSetModelConfig(
    provider: string | null = null,
    model: string | null = null
  ) {
    const oldConfig = getModelConfig()
    // console.log({ oldConfig, firstTimer, provider, model })
    firstTimer++

    const modelConfig = {
      provider: provider ?? jquery("#provider").val(),
      model: model ?? jquery("#model").val(),
    }
    // console.log(typeof modelConfig.model)
    // if (!model && oldConfig.provider === provider) return
    if (modelConfig.model == "") {
      // console.log($modelList)
      for (const m of $modelList) {
        // console.log(m)
        if (Array.isArray(m.models)) {
          modelConfig.model = m.models[0].model
        } else {
          modelConfig.model = m.model
        }
      }
    }
    // console.log(modelConfig)
    setModelConfig(modelConfig)
  }
  function addLiveProvider() {
    const list = []
    let i = 0
    for (const p of liveProviderList) {
      list.push({
        active_by_default: false,
        audio: 0,
        auth: true,
        hf_space: false,
        image: 0,
        label: liveProviderLabes[i],
        login_url: "",
        name: liveProviderLabes[i],
        nodriver: false,
        parent: null,
        video: 0,
        vision: false,
      })
      i += 1
    }
    return list
  }
  async function initProviderData() {
    const providerListSet: Provider[] = await fetch(
      "api/backend-api/v2/providers"
    ).then((r) => r.json())
    // console.log(providerListSet)
    providerList.update((o) => [...providerListSet, ...addLiveProvider()])
  }
  async function getLiveProviderModels(p: string) {
    const providerName = p.replace(/-Live$/, "")
    // const idx = liveProviderList.findIndex
    let instance: any
    let models: []
    switch (providerName) {
      case "PollinationsAI":
        instance = new PollinationsAI()
        /*
        {
  "aliases": "gpt-5-nano",
  "audio": false,
  "community": false,
  "description": "OpenAI GPT-5 Nano",
  "input_modalities": [
   "text",
   "image"
  ],
  "name": "gpt-5-nano",
  "output_modalities": [
   "text"
  ],
  "provider": "azure",
  "tier": "anonymous",
  "tools": true,
  "vision": true
 },
        */
        const srcModels = instance.availableModels
        //@ts-ignore
        models = srcModels.map((m: any) => {
          return {
            audio: m.audio,
            count: null,
            default: true,
            image: m.input_modalities.includes("image"),
            label: `${m.name} ${m.aliases ? `(${m.aliases})` : ""}`,
            model: m.name,
            video: false,
            vision: m.vision,
          }
        })
        break
      case "Together":
        instance = new Together()
        break
      case "Puter":
        instance = new Puter()
        break
      case "DeepInfra":
        instance = new DeepInfra()
        break
      case "HuggingFace":
        instance = new HuggingFace()
        models = await instance.models.list()
        /*
        {
      _id: "621ffdc136468d709f181172",
      id: "turing-usp/FinBertPTBR",
      inferenceProviderMapping: [
        {
          _id: "68515aeb5dc4c5c1055386dd",
          provider: "hf-inference",
          providerId: "turing-usp/FinBertPTBR",
          status: "live",
          task: "text-classification",
          type: "single-model",
        },
      ],
      trendingScore: 0,
    },
        */
        models = models.map((m: any) => {
          return {
            audio: false,
            count: null,
            default: true,
            image: false,
            label: m.id,
            model: m.id,
            video: false,
            vision: false,
          }
        })
        break
    }
    console.log({ p, providerName, instance })
    return models
  }
  async function initModelData(providerName: string) {
    let modelListSet: Model[] = providerName.match(/Live$/)
      ? await getLiveProviderModels(providerName)
      : await fetch(`api/backend-api/v2/models/${providerName}`).then((r) =>
          r.json()
        )
    // modelListSet = modelListSet.sort((a, b) => a.label.localeCompare(b.label))
    console.log({ modelListSet })
    modelList.update((o) => modelListSet)
    setTimeout(() => {
      doSetModelConfig(providerName)
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
        onProviderChange(provider)
      }
    }, 1000)

    // console.log(modelConfig)
  })

  modelList.subscribe((o) => {
    // console.log(o)
  })

  async function onProviderChange(providerName: string) {
    try {
      if (providerName) {
        await initModelData(providerName)
      }
      console.log({ providerName })
    } catch (error) {
      const modelConfig = getModelConfig()
      const { provider } = modelConfig
      console.log({ provider })

      if (provider) {
        await initModelData(provider)
      }
    }
  }

  $: loadProviderList()

  function isModelSelected(model: string, provider: string | null) {
    const modelConfig = getModelConfig()
    if (
      (provider ? modelConfig.provider === provider : true) &&
      modelConfig.model === model
    )
      return true
    return false
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
          on:change={(e) =>
            doSetModelConfig(null, (e.target as HTMLSelectElement).value)}
          class="w-full py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
        >
          {#each $modelList as model, index}
            {#if Array.isArray(model.models)}
              <option value="" disabled>--{model.group}--</option>
              {#each model.models as subModel, subIndex}
                <option
                  value={subModel.model}
                  selected={isModelSelected(subModel.model, null)}
                  >{subModel.label}
                  {(subModel.image ?? 0) > 0 ? "📷" : ""}
                  {(subModel.audio ?? 0) > 0 ? "🔊" : ""}
                  {(subModel.video ?? 0) > 0 ? "📹" : ""}</option
                >
              {/each}
            {:else}
              <option
                value={model.model}
                selected={isModelSelected(model.model, null)}
                >{model.label}
                {(model.image ?? 0) > 0 ? "📷" : ""}
                {(model.audio ?? 0) > 0 ? "🔊" : ""}
                {(model.video ?? 0) > 0 ? "📹" : ""}</option
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
          on:change={(e: Event) =>
            onProviderChange((e.target as HTMLSelectElement).value)}
          class="py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
        >
          {#each $providerList as provider}
            {#if provider.active_by_default || true}
              <option value={provider.name}
                >{provider.label}
                {provider.auth ? "🗝" : ""}
                {(provider.image ?? 0) > 0 ? "📷" : ""}
                {(provider.video ?? 0) > 0 ? "📹" : ""}</option
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
