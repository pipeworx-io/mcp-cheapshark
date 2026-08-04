# @pipeworx/cheapshark

[CheapShark](https://apidocs.cheapshark.com/) MCP — PC game price tracking across Steam/Epic/GOG/Humble/etc. Keyless.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

- `deals(storeID?, pageNumber?, pageSize?, sortBy?, desc?, lowerPrice?, upperPrice?, metacritic?, steamRating?, steamAppID?, title?, exact?, AAA?, steamworks?, onSale?, output?)` — search deals
- `deal(id)` — single deal detail
- `stores()` — list stores
- `games(title, limit?, steamAppID?, exact?)` — game lookup
- `game(id)` — game details
- `alerts_manage(...)` — _omitted (requires user email + tokens)_

## Data source

`https://www.cheapshark.com/api/1.0`

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "cheapshark": {
      "url": "https://gateway.pipeworx.io/cheapshark/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Cheapshark data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
