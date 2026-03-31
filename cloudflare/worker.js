export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname.replace(/\/+$/, "") || "/";
    const expectedToken = String(env.SHARED_API_TOKEN || "").trim();

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }

    if (!authorize(request, expectedToken)) {
      return json({ error: "Unauthorized" }, 401);
    }

    if (!env.APP_STATE_KV) {
      return json({ error: "APP_STATE_KV binding missing" }, 500);
    }

    if (pathname === "/app_state" && request.method === "GET") {
      const state = await readState(env.APP_STATE_KV);
      return json([{ id: "main", ...state }]);
    }

    if (pathname === "/app_state" && request.method === "POST") {
      const body = await safeJson(request);
      const state = normalizeState(body);
      await env.APP_STATE_KV.put("main", JSON.stringify(state));
      return json({ id: "main", ...state }, 201);
    }

    if (pathname === "/app_state/main" && request.method === "GET") {
      const state = await readState(env.APP_STATE_KV);
      return json({ id: "main", ...state });
    }

    if (pathname === "/app_state/main" && request.method === "PUT") {
      const body = await safeJson(request);
      const state = normalizeState(body);
      await env.APP_STATE_KV.put("main", JSON.stringify(state));
      return json({ id: "main", ...state });
    }

    return json({ error: "Not found" }, 404);
  },
};

const corsHeaders = () => ({
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json",
});

const json = (value, status = 200) =>
  new Response(JSON.stringify(value), {
    status,
    headers: corsHeaders(),
  });

const authorize = (request, expectedToken) => {
  if (!expectedToken) return true;
  const incoming = request.headers.get("Authorization") || "";
  return incoming === `Bearer ${expectedToken}`;
};

const safeJson = async (request) => {
  try {
    return await request.json();
  } catch {
    return {};
  }
};

const normalizeState = (value) => {
  const safe = value && typeof value === "object" ? value : {};
  return {
    users: Array.isArray(safe.users) ? safe.users : [],
    sellerCards: Array.isArray(safe.sellerCards) ? safe.sellerCards : [],
    sellerRequests: Array.isArray(safe.sellerRequests) ? safe.sellerRequests : [],
  };
};

const readState = async (kv) => {
  const raw = await kv.get("main");
  if (!raw) {
    return normalizeState({});
  }

  try {
    return normalizeState(JSON.parse(raw));
  } catch {
    return normalizeState({});
  }
};
