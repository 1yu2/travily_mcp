# travily_mcp

MCP server wrapper for Tavily search/extract.

## Prerequisites
- Node.js 18+
- Tavily API key

## Setup

```bash
npm install
```

## Environment

Create a `.env` (or export env vars) with:

```
TRAVLY_KEY=your_tavily_api_key_here
```

## Run

```bash
node mcp/travily/server.js
```

## MCP client config example

```json
{
  "mcpServers": {
    "travily": {
      "command": "node",
      "args": ["/absolute/path/to/mcp/travily/server.js"],
      "env": {
        "TRAVLY_KEY": "your_tavily_api_key_here"
      }
    }
  }
}
```

## Tools

- `travily.search`
  - `query` (string, required)
  - `max_results` (1-20)
  - `search_depth` (`basic`|`advanced`)
  - `topic` (`general`|`news`)
  - `include_answer` (bool)
  - `include_images` (bool)
  - `include_raw_content` (bool)

- `travily.extract`
  - `urls` (array[string], required)
  - `include_images` (bool)
  - `include_raw_content` (bool)
