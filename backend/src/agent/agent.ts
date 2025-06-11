import { BedrockClient } from "../services/awsService";
import { createReactAgent } from "@langchain/langgraph/prebuilt";

import { facilityLookupTool } from "./tools/facilityLookupTool"; 


export async function getAgent() {

  const tools = [facilityLookupTool];

  const llm = await BedrockClient();

  const reactAgent = createReactAgent({
    llm: llm,
    tools: tools
  });

  return reactAgent;
}