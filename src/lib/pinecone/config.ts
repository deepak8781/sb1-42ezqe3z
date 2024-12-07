export const PINECONE_CONFIG = {
  apiKey: import.meta.env.VITE_PINECONE_API_KEY,
  environment: import.meta.env.VITE_PINECONE_ENVIRONMENT,
  indexName: import.meta.env.VITE_PINECONE_INDEX_NAME,
  host: 'https://neev-lplamsl.svc.aped-4627-b74a.pinecone.io'
};

export const EMBEDDING_CONFIG = {
  model: 'text-embedding-ada-002',
  dimensions: 1536, // OpenAI ada-002 model dimension
  metric: 'cosine'
};

export const SEARCH_DEFAULTS = {
  limit: 5,
  threshold: 0.7
};