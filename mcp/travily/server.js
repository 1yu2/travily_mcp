import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const API_URL = "https://api.tavily.com";
const API_KEY = process.env.TRAVLY_KEY;

if (!API_KEY) {
  console.error("TRAVLY_KEY is not set in environment");
  process.exit(1);
}

const server = new Server(
  {
    name: "travily-mcp",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "travily.search",
        description: "Search the web via Tavily",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string" },
            max_results: { type: "number", minimum: 1, maximum: 20 },
            search_depth: { type: "string", enum: ["basic", "advanced"] },
            topic: { type: "string", enum: ["general", "news"] },
            include_answer: { type: "boolean" },
            include_images: { type: "boolean" },
            include_raw_content: { type: "boolean" }
          },
          required: ["query"],
          additionalProperties: false
        }
      },
      {
        name: "travily.extract",
        description: "Extract content from URLs via Tavily",
        inputSchema: {
          type: "object",
          properties: {
            urls: {
              type: "array",
              items: { type: "string" },
              minItems: 1
            },
            include_images: { type: "boolean" },
            include_raw_content: { type: "boolean" }
          },
          required: ["urls"],
          additionalProperties: false
        }
      }
    ]
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "travily.search") {
    const payload = {
      api_key: API_KEY,
      query: args.query,
      max_results: args.max_results ?? 5,
      search_depth: args.search_depth ?? "basic",
      topic: args.topic ?? "general",
      include_answer: args.include_answer ?? false,
      include_images: args.include_images ?? false,
      include_raw_content: args.include_raw_content ?? false,
    };

    const res = await fetch(`${API_URL}/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Tavily search failed: ${res.status} ${text}`);
    }

    const data = await res.json();
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }]
    };
  }

  if (name === "travily.extract") {
    const payload = {
      api_key: API_KEY,
      urls: args.urls,
      include_images: args.include_images ?? false,
      include_raw_content: args.include_raw_content ?? false
    };

    const res = await fetch(`${API_URL}/extract`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Tavily extract failed: ${res.status} ${text}`);
    }

    const data = await res.json();
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }]
    };
  }

  throw new Error(`Unknown tool: ${name}`);
});

const transport = new StdioServerTransport();
await server.connect(transport);
