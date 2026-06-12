export type OpenRouterModel = {
  id: string;
  label: string;
  provider: string;
};

export const OPENROUTER_FREE_MODELS: OpenRouterModel[] = [
  {
    id: "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
    label: "Nemotron 3 Nano Omni 30B",
    provider: "NVIDIA",
  },
  {
    id: "nvidia/nemotron-3-ultra-550b-a55b:free",
    label: "Nemotron 3 Ultra 550B",
    provider: "NVIDIA",
  },
  {
    id: "nex-agi/nex-n2-pro:free",
    label: "NEX N2 Pro",
    provider: "NexAGI",
  },
  {
    id: "poolside/laguna-xs.2:free",
    label: "Laguna XS.2",
    provider: "Poolside",
  },
  {
    id: "poolside/laguna-m.1:free",
    label: "Laguna M.1",
    provider: "Poolside",
  },
  {
    id: "openrouter/owl-alpha",
    label: "Owl Alpha",
    provider: "OpenRouter",
  },
];

export const DEFAULT_OPENROUTER_MODEL = OPENROUTER_FREE_MODELS[0].id;

export const getOpenRouterModelLabel = (modelId: string) => {
  return OPENROUTER_FREE_MODELS.find((model) => model.id === modelId)?.label || modelId;
};
