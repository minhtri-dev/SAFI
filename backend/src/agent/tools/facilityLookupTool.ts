
import { tool } from "@langchain/core/tools";
import { z } from "zod";

import { getVectorStore } from '../../utils/dbUtils';

export const facilityLookupTool = tool(
  async ({ query, n = 5 }) => {
    const vectorStore = getVectorStore()

    const result = await vectorStore.similaritySearchWithScore(query, n);
    return JSON.stringify(result);
  },
  {
    name: "facility_lookup_local",
    description: "Same function as facilityLookupTool, but can be used locally because of unspecified requirements for assignment 3 that was never mentioned in the specifications of this assignment.",   
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