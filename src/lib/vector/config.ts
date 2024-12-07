export const TOGETHER_CONFIG = {
  apiKey: import.meta.env.VITE_TOGETHER_API_KEY,
  model: 'togethercomputer/m2-bert-80M-8k-base',
  maxBatchSize: 100,
};

export const SIMILARITY_THRESHOLD = 0.7;