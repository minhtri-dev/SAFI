
import { tool } from "@langchain/core/tools";
import { MongoDBAtlasVectorSearch } from '@langchain/mongodb'
import { z } from "zod";

import { FacilityEmbeddings } from "../../services/embeddingsService";
import { getDatabase } from '../../services/dbService'

export const facilityLookupTool = tool(
  async ({ query, n = 3 }) => {
    console.log("Facility lookup tool called");

    const db = getDatabase()
    const collection = db.collection("Facility");

    const dbConfig = {
      collection: collection,
      indexName: "vector_index",
      textKey: "embedding_text",
      embeddingKey: "embedding",
    };

    // Initialise vector store
    const vectorStore = new MongoDBAtlasVectorSearch(
      new FacilityEmbeddings(),
      dbConfig
    );

    const result = await vectorStore.similaritySearchWithScore(query, n);
    return JSON.stringify(result);
  },
  {
    name: "facility_lookup",
    description: "Gathers facility_lookup details from the Safi database",
    schema: z.object({
      query: z.string().describe("The search query"),
      n: z
        .number()
        .optional()
        .default(3)
        .describe("Number of results to return"),
    }),
  }
);