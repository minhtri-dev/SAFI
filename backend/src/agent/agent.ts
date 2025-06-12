import { BedrockClient } from "../services/awsService";
import { createReactAgent } from "@langchain/langgraph/prebuilt";

import { facilityLookupTool } from "./tools/facilityLookupTool"; 


export async function getAgent() {

  const tools = [facilityLookupTool];

  console.log("Creating agent with tools:", tools.map(tool => tool.name));

  const llm = await BedrockClient();

  const reactAgent = createReactAgent({
    llm: llm,
    tools: tools,
    prompt: `You are a helpful agent that can answer questions about RMIT facilities.`
  });

  return reactAgent;
}