import { Client } from "../Client"

class PollinationsAI extends Client {
  availableModels = [
    {
      name: "gpt-5-nano",
      description: "OpenAI GPT-5 Nano",
      provider: "azure",
      tier: "anonymous",
      community: false,
      aliases: "gpt-5-nano",
      input_modalities: ["text", "image"],
      output_modalities: ["text"],
      tools: true,
      vision: true,
      audio: false,
    },
    {
      name: "llama-fast-roblox",
      original_name: "@cf/meta/llama-3.2-11b-vision-instruct",
      description: "Llama 3.2 1B",
      provider: "cloudflare",
      tier: "anonymous",
      community: false,
      aliases: "llama-3.2-1b-instruct",
      input_modalities: ["text", "image"],
      output_modalities: ["text"],
      tools: true,
      vision: true,
      audio: false,
    },
    {
      name: "llama-roblox",
      original_name: "meta-llama/Meta-Llama-3.1-8B-Instruct-fast",
      description: "Llama 3.1 8B Instruct",
      provider: "nebius",
      tier: "anonymous",
      community: false,
      aliases: "llama-3.1-8b-instruct",
      input_modalities: ["text"],
      output_modalities: ["text"],
      tools: true,
      vision: false,
      audio: false,
    },
    {
      name: "llamascout",
      original_name: "@cf/meta/llama-4-scout-17b-16e-instruct",
      description: "Llama 4 Scout 17B",
      provider: "cloudflare",
      tier: "anonymous",
      community: false,
      aliases: "llama-4-scout-17b-16e-instruct",
      input_modalities: ["text"],
      output_modalities: ["text"],
      tools: false,
      vision: false,
      audio: false,
    },
    {
      name: "mistral",
      original_name: "mistral-small-3.1-24b-instruct-2503",
      description: "Mistral Small 3.1 24B",
      provider: "scaleway",
      tier: "anonymous",
      community: false,
      aliases: "mistral-small-3.1-24b-instruct",
      input_modalities: ["text"],
      output_modalities: ["text"],
      tools: true,
      vision: false,
      audio: false,
    },
    {
      name: "mistral-nemo-roblox",
      original_name: "mistralai/Mistral-Nemo-Instruct-2407",
      description: "Mistral Nemo Instruct 2407",
      provider: "nebius",
      tier: "anonymous",
      community: false,
      aliases: "mistral-nemo-instruct-2407",
      input_modalities: ["text"],
      output_modalities: ["text"],
      tools: true,
      vision: false,
      audio: false,
    },
    {
      name: "mistral-roblox",
      original_name: "@cf/mistralai/mistral-small-3.1-24b-instruct",
      description: "Mistral Small 3.1 24B",
      provider: "cloudflare",
      tier: "anonymous",
      community: false,
      aliases: "mistral-small-cloudflare",
      input_modalities: ["text", "image"],
      output_modalities: ["text"],
      tools: true,
      vision: true,
      audio: false,
    },
    {
      name: "nova-fast",
      description: "Amazon Nova Micro (Bedrock)",
      provider: "bedrock",
      community: false,
      tier: "anonymous",
      aliases: "nova-micro-v1",
      input_modalities: ["text"],
      output_modalities: ["text"],
      tools: true,
      vision: false,
      audio: false,
    },
    {
      name: "openai",
      description: "OpenAI GPT-4.1 Nano",
      provider: "azure",
      tier: "anonymous",
      community: false,
      aliases: "gpt-4.1-nano",
      input_modalities: ["text", "image"],
      output_modalities: ["text"],
      tools: true,
      original_name: "gpt-4.1-nano-2025-04-14",
      vision: true,
      audio: false,
    },
    {
      name: "openai-audio",
      original_name: "gpt-4o-mini-audio-preview-2024-12-17",
      description: "OpenAI GPT-4o Mini Audio Preview",
      maxInputChars: 2000,
      voices: [
        "alloy",
        "echo",
        "fable",
        "onyx",
        "nova",
        "shimmer",
        "coral",
        "verse",
        "ballad",
        "ash",
        "sage",
        "amuch",
        "dan",
      ],
      provider: "azure",
      tier: "seed",
      community: false,
      aliases: "gpt-4o-mini-audio-preview",
      input_modalities: ["text", "image", "audio"],
      output_modalities: ["audio", "text"],
      tools: true,
      vision: true,
      audio: true,
    },
    {
      name: "openai-fast",
      description: "OpenAI GPT-4.1 Nano",
      provider: "azure",
      tier: "anonymous",
      community: false,
      aliases: "gpt-4.1-nano",
      input_modalities: ["text", "image"],
      output_modalities: ["text"],
      tools: true,
      vision: true,
      audio: false,
    },
    {
      name: "openai-large",
      original_name: "gpt-4.1-2025-04-14",
      description: "OpenAI GPT-4.1",
      maxInputChars: 5000,
      provider: "azure",
      tier: "flower",
      community: false,
      aliases: "gpt-4.1",
      input_modalities: ["text", "image"],
      output_modalities: ["text"],
      tools: true,
      vision: true,
      audio: false,
    },
    {
      name: "openai-roblox",
      description: "OpenAI GPT-4.1 Nano",
      provider: "azure",
      tier: "anonymous",
      community: false,
      aliases: "gpt-4.1-nano",
      input_modalities: ["text", "image"],
      output_modalities: ["text"],
      tools: true,
      vision: true,
      audio: false,
    },
    {
      name: "qwen-coder",
      original_name: "qwen2.5-coder-32b-instruct",
      description: "Qwen 2.5 Coder 32B",
      provider: "scaleway",
      tier: "anonymous",
      community: false,
      aliases: "qwen2.5-coder-32b-instruct",
      input_modalities: ["text"],
      output_modalities: ["text"],
      tools: true,
      vision: false,
      audio: false,
    },
    {
      name: "roblox-rp",
      description: "Roblox RP Multi-Model (Random Bedrock Selection)",
      provider: "bedrock",
      tier: "anonymous",
      community: false,
      input_modalities: ["text"],
      output_modalities: ["text"],
      tools: true,
      vision: false,
      audio: false,
    },
    {
      name: "bidara",
      description:
        "BIDARA (Biomimetic Designer and Research Assistant by NASA)",
      provider: "azure",
      tier: "anonymous",
      community: true,
      input_modalities: ["text", "image"],
      output_modalities: ["text"],
      tools: true,
      vision: true,
      audio: false,
    },
    {
      name: "elixposearch",
      description: "Elixpo Search",
      provider: "azure",
      tier: "anonymous",
      community: true,
      input_modalities: ["text"],
      output_modalities: ["text"],
      tools: false,
      vision: false,
      audio: false,
    },
    {
      name: "evil",
      description: "Evil",
      provider: "scaleway",
      uncensored: true,
      tier: "seed",
      community: true,
      input_modalities: ["text", "image"],
      output_modalities: ["text"],
      tools: true,
      vision: true,
      audio: false,
    },
    {
      name: "midijourney",
      description: "MIDIjourney",
      provider: "azure",
      tier: "anonymous",
      community: true,
      input_modalities: ["text"],
      output_modalities: ["text"],
      tools: true,
      vision: false,
      audio: false,
    },
    {
      name: "mirexa",
      description: "Mirexa AI Companion",
      provider: "azure",
      tier: "seed",
      community: true,
      input_modalities: ["text", "image"],
      output_modalities: ["text"],
      tools: true,
      vision: true,
      audio: false,
    },
    {
      name: "rtist",
      description: "Rtist",
      provider: "azure",
      tier: "seed",
      community: true,
      input_modalities: ["text"],
      output_modalities: ["text"],
      tools: true,
      vision: false,
      audio: false,
    },
    {
      name: "sur",
      description: "Sur AI Assistant",
      provider: "scaleway",
      tier: "seed",
      community: true,
      input_modalities: ["text", "image"],
      output_modalities: ["text"],
      tools: true,
      vision: true,
      audio: false,
    },
    {
      name: "unity",
      description: "Unity Unrestricted Agent",
      provider: "scaleway",
      uncensored: true,
      tier: "seed",
      community: true,
      input_modalities: ["text", "image"],
      output_modalities: ["text"],
      tools: true,
      vision: true,
      audio: false,
    },
  ]
  constructor(options: any = {}) {
    super({
      baseUrl: "https://text.pollinations.ai",
      apiEndpoint: "https://text.pollinations.ai/openai",
      imageEndpoint: "https://image.pollinations.ai/prompt/{prompt}",
      defaultModel: "gpt-oss",
      referrer: "https://g4f.dev",
      modelAliases: {
        "gpt-oss-120b": "gpt-oss",
        "gpt-4o-mini": "openai",
        "gpt-4.1-nano": "openai-fast",
        "gpt-4.1": "openai-large",
        "o4-mini": "openai-reasoning",
        "command-r-plus": "command-r",
        "gemini-2.5-flash": "gemini",
        "gemini-2.0-flash-thinking": "gemini-thinking",
        "qwen-2.5-coder-32b": "qwen-coder",
        "llama-3.3-70b": "llama",
        "llama-4-scout": "llamascout",
        "mistral-small-3.1-24b": "mistral",
        "deepseek-r1": "deepseek-reasoning",
        "phi-4": "phi",
        "deepseek-v3": "deepseek",
        "grok-3-mini-high": "grok",
        "gpt-4o-audio": "openai-audio",
        "sdxl-turbo": "turbo",
        "gpt-image": "gptimage",
        "flux-kontext": "kontext",
      },
      ...options,
    })
  }

  get models() {
    return {
      list: async () => {
        if (this._models.length > 0) return this._models
        try {
          let [textModelsResponse, imageModelsResponse] = await Promise.all([
            this._fetchWithProxyRotation(
              "https://text.pollinations.ai/models"
            ).catch((e) => {
              console.error("Failed to fetch text models from all proxies:", e)
              return { data: [] }
            }),
            this._fetchWithProxyRotation(
              "https://image.pollinations.ai/models"
            ).catch((e) => {
              console.error("Failed to fetch image models from all proxies:", e)
              return []
            }),
          ])
          if ("json" in textModelsResponse) {
            textModelsResponse = await textModelsResponse.json()
          }
          if ("json" in imageModelsResponse) {
            imageModelsResponse = await imageModelsResponse.json()
          }
          const textModels =
            (textModelsResponse as any).data || textModelsResponse || []
          this._models = [
            ...textModels.map((model: any) => {
              model.id = model.id || this.swapAliases[model.name] || model.name
              model.type = model.type || "chat"
              return model
            }),
            ...(Array.isArray(imageModelsResponse)
              ? imageModelsResponse
              : []
            ).map((model: any) => {
              return { id: this.swapAliases[model] || model, type: "image" }
            }),
          ]
          return this._models
        } catch (err) {
          console.error("Final fallback for Pollinations models:", err)
          return [
            { id: "gpt-4.1-mini", type: "chat" },
            { id: "deepseek-v3", type: "chat" },
            { id: "flux", type: "image" },
            { id: "gpt-image", type: "image" },
          ]
        }
      },
    }
  }
}

export { PollinationsAI }
export default PollinationsAI
