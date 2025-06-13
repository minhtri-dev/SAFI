import { BedrockClient } from "../services/awsService"
import { createReactAgent } from "@langchain/langgraph/prebuilt"
import { StateGraph, Annotation } from "@langchain/langgraph"
import { AIMessage, BaseMessage, HumanMessage } from "@langchain/core/messages"
import { ToolNode } from "@langchain/langgraph/prebuilt"
import { MongoDBSaver } from "@langchain/langgraph-checkpoint-mongodb"
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts"

import { getMongoClient } from "../services/dbService"
import { facilityLookupTool } from "./tools/facilityLookupTool" // Use the local tool

// Define GraphState at the top level for use as both a runtime value and a type
const GraphState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
  }),
})

export async function getAgent() {
  const tools = [facilityLookupTool]

  const llm = await BedrockClient()

  const reactAgent = createReactAgent({
    llm: llm,
    tools: tools,
  })

  return reactAgent
}

async function callAgent(state: typeof GraphState.State) {
  const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        `You are a helpful AI assistant, collaborating with other assistants. Use the provided tools to progress towards answering the question. If you are unable to fully answer, that's OK, execute what you can to make progress. If you or any of the other assistants have the final answer or deliverable, prefix your response with FINAL ANSWER so the team knows to stop. You have access to the following tools: {tool_names}.\n{system_message}\nCurrent time: {time}.`,
      ],
      new MessagesPlaceholder("messages"),
    ])

    const agent = await getAgent()

    const tools = [facilityLookupTool]

    const formattedPrompt = await prompt.formatMessages({
      system_message: "You are a helpful Chatbot Agent.",
      time: new Date().toISOString(),
      tool_names: tools.map((tool) => tool.name).join(", "),
      messages: state.messages,
    })

    const response = await agent.invoke({ messages: formattedPrompt })

    return response
}

export async function invokeAgent(query: string, thread_id: string) {
  // Use the top-level GraphState instead of re-declaring it
  const tools = [facilityLookupTool]
  const toolNode = new ToolNode<typeof GraphState.State>(tools)

  const client = getMongoClient()

  // Define a new graph using the top-level GraphState
  const workflow = new StateGraph(GraphState)
    .addNode("agent", callAgent)
    .addNode("tools", toolNode)
    .addEdge("__start__", "agent")
    .addConditionalEdges("agent", shouldContinue)
    .addEdge("tools", "agent")
  
  const checkpointer = new MongoDBSaver({ client: client, dbName: "SafiDB" })

  const app = workflow.compile({ checkpointer })

  const finalState = await app.invoke(
    {
      messages: [new HumanMessage(query)],
    },
    { recursionLimit: 15, configurable: { thread_id: thread_id } }
  )

  return finalState.messages[finalState.messages.length - 1].content
}

function shouldContinue(state: typeof GraphState.State) {
  const messages = state.messages
  const lastMessage = messages[messages.length - 1] as AIMessage

  // If the LLM makes a tool call, then we route to the "tools" node
  if (lastMessage.tool_calls?.length) {
    return "tools"
  }
  // Otherwise, we stop (reply to the user)
  return "__end__"
}