

import { pipeline } from '@xenova/transformers'
import { type EmbeddingsInterface } from '@langchain/core/embeddings'

async function getEmbedding(data: string[]): Promise<number[][]> {
  try {
    // Initialise the feature extraction pipeline
    const extractor = await pipeline(
      'feature-extraction',
      'Xenova/all-MiniLM-L6-v2',
    )
    // Extract features, with options for pooling and normalisation.
    const response = await extractor(data, { pooling: 'mean', normalize: true })
    // Return the response.data directly (assuming it's already structured as an array of embeddings)
    return response.tolist()
  } catch (error) {
    console.error('Error fetching embeddings:', error)
    throw new Error('Failed to get embeddings')
  }
}

// Custom embeddings class implementing the expected API using EmbeddingsInterface.
export class FacilityEmbeddings implements EmbeddingsInterface {
  // Embeds an array of texts to an array of embeddings.
  async embedDocuments(texts: string[]): Promise<number[][]> {
    return getEmbedding(texts)
  }

  // Embeds a single query string.
  async embedQuery(text: string): Promise<number[]> {
    const embeddings = await getEmbedding([text])
    // Return the first embedding from the array.
    return embeddings[0]
  }
}