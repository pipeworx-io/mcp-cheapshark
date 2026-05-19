interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * CheapShark MCP.
 */


const BASE = 'https://www.cheapshark.com/api/1.0';
const UA = 'pipeworx-mcp-cheapshark/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  {
    name: 'deals',
    description: 'Search deals across stores.',
    inputSchema: {
      type: 'object',
      properties: {
        storeID: { type: 'string', description: 'Comma-sep store IDs. See stores().' },
        pageNumber: { type: 'number' },
        pageSize: { type: 'number' },
        sortBy: { type: 'string', description: 'DealRating | Title | Savings | Price | Metacritic | Reviews | Release | Store | Recent' },
        desc: { type: 'boolean' },
        lowerPrice: { type: 'number' },
        upperPrice: { type: 'number' },
        metacritic: { type: 'number' },
        steamRating: { type: 'number' },
        steamAppID: { type: 'number' },
        title: { type: 'string' },
        exact: { type: 'boolean' },
        AAA: { type: 'boolean' },
        steamworks: { type: 'boolean' },
        onSale: { type: 'boolean' },
      },
    },
  },
  { name: 'deal', description: 'Single deal detail.', inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] } },
  { name: 'stores', description: 'List supported stores.', inputSchema: { type: 'object', properties: {} } },
  {
    name: 'games',
    description: 'Game lookup.',
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        limit: { type: 'number' },
        steamAppID: { type: 'number' },
        exact: { type: 'boolean' },
      },
      required: ['title'],
    },
  },
  { name: 'game', description: 'Game details.', inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] } },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const get = async (path: string, params?: URLSearchParams) => {
    const url = `${BASE}${path}${params && [...params].length ? `?${params}` : ''}`;
    const res = await fetch(url, { headers: { Accept: 'application/json', 'User-Agent': UA } });
    if (!res.ok) throw new Error(`CheapShark: ${res.status}`);
    return res.json();
  };
  const numericKeys = new Set(['pageNumber', 'pageSize', 'lowerPrice', 'upperPrice', 'metacritic', 'steamRating', 'steamAppID']);
  const boolKeys = new Set(['desc', 'exact', 'AAA', 'steamworks', 'onSale']);
  const buildParams = (a: Record<string, unknown>) => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(a)) {
      if (k === '_apiKey' || v == null) continue;
      if (boolKeys.has(k)) p.set(k, v ? '1' : '0');
      else if (numericKeys.has(k)) p.set(k, String(Number(v)));
      else p.set(k, String(v));
    }
    return p;
  };
  switch (name) {
    case 'deals':
      return get('/deals', buildParams(args));
    case 'deal': {
      const p = new URLSearchParams({ id: reqStr(args, 'id', '"<deal-id>"') });
      return get('/deals', p);
    }
    case 'stores':
      return get('/stores');
    case 'games':
      return get('/games', buildParams(args));
    case 'game': {
      const p = new URLSearchParams({ id: reqStr(args, 'id', '"<game-id>"') });
      return get('/games', p);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
