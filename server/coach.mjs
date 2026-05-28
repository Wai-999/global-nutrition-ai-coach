import { readFileSync } from "node:fs";

const ANTHROPIC_MESSAGES_URL = "https://api.anthropic.com/v1/messages";
const MAX_BODY_CHARS = 70000;
const MAX_PROMPT_CHARS = 65000;
const DEFAULT_MAX_TOKENS = 4000;
const MAX_ALLOWED_TOKENS = 5000;
const ANTHROPIC_TIMEOUT_MS = 120000;

function loadDotEnv() {
  try {
    const text = readFileSync(new URL("../.env", import.meta.url), "utf8");
    for (const line of text.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;

      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;

      const key = trimmed.slice(0, eq).trim();
      const value = trimmed
        .slice(eq + 1)
        .trim()
        .replace(/^['"]|['"]$/g, "");

      if (key && process.env[key] === undefined) process.env[key] = value;
    }
  } catch {
    // .env is optional; deployed environments usually inject variables directly.
  }
}

loadDotEnv();

function jsonResponse(status, body) {
  return { status, body };
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", chunk => {
      body += chunk;
      if (body.length > MAX_BODY_CHARS) {
        reject(Object.assign(new Error("Request body is too large."), { status: 413 }));
        req.destroy();
      }
    });

    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function extractText(data) {
  if (!Array.isArray(data?.content)) return "";
  return data.content
    .map(block => (block && block.type === "text" ? block.text || "" : ""))
    .join("")
    .trim();
}

function normalizeMaxTokens(value) {
  const parsed = Number(value || DEFAULT_MAX_TOKENS);
  if (!Number.isFinite(parsed) || parsed <= 0) return DEFAULT_MAX_TOKENS;
  return Math.min(Math.round(parsed), MAX_ALLOWED_TOKENS);
}

function getApiKeyProblem(apiKey) {
  if (!apiKey) return "ANTHROPIC_API_KEY is not configured on the server.";
  if (apiKey.includes("your-key") || apiKey.includes("your-real") || apiKey.includes("your_")) {
    return "ANTHROPIC_API_KEY is still a placeholder. Replace it with a real Anthropic API key.";
  }
  if (!apiKey.startsWith("sk-ant-")) {
    return "ANTHROPIC_API_KEY does not look like an Anthropic key. Use an Anthropic key, not an OpenAI key.";
  }
  return "";
}

export async function createCoachResponse(rawBody, env = process.env, fetchImpl = fetch) {
  let payload;

  try {
    payload = JSON.parse(rawBody || "{}");
  } catch {
    return jsonResponse(400, { error: "Invalid JSON request body." });
  }

  const prompt = typeof payload.prompt === "string" ? payload.prompt.trim() : "";
  if (!prompt) return jsonResponse(400, { error: "Prompt is required." });
  if (prompt.length > MAX_PROMPT_CHARS) {
    return jsonResponse(413, { error: "Prompt is too large." });
  }

  if (env.MOCK_COACH_REPORT === "true") {
    return jsonResponse(200, {
      text: [
        "## [SUMMARY] Client Profile Overview",
        "- Demo mode is enabled, so this is a mock report.",
        "## [TIP] Personal Coach Message",
        "- Add ANTHROPIC_API_KEY to generate a full personalized nutrition plan.",
      ].join("\n"),
    });
  }

  const apiKey = env.ANTHROPIC_API_KEY;
  const apiKeyProblem = getApiKeyProblem(apiKey);
  if (apiKeyProblem) return jsonResponse(500, { error: apiKeyProblem });

  const model = env.ANTHROPIC_MODEL || "claude-sonnet-4-6";
  let upstream;

  try {
    upstream = await fetchImpl(ANTHROPIC_MESSAGES_URL, {
      method: "POST",
      signal: AbortSignal.timeout(ANTHROPIC_TIMEOUT_MS),
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: normalizeMaxTokens(env.ANTHROPIC_MAX_TOKENS),
        messages: [{ role: "user", content: prompt }],
      }),
    });
  } catch (error) {
    const timedOut = error?.name === "TimeoutError" || error?.name === "AbortError";
    return jsonResponse(504, {
      error: timedOut
        ? "Anthropic took too long to generate the report. Try again, or lower ANTHROPIC_MAX_TOKENS."
        : `Could not reach Anthropic: ${error?.message || "network request failed"}`,
    });
  }

  const data = await upstream.json().catch(() => ({}));
  if (!upstream.ok) {
    return jsonResponse(upstream.status, {
      error: data?.error?.message || "Anthropic API request failed.",
    });
  }

  const text = extractText(data);
  if (!text) return jsonResponse(502, { error: "Anthropic returned an empty response." });

  return jsonResponse(200, { text });
}

export async function handleNodeRequest(req, res) {
  if (req.method !== "POST") {
    res.writeHead(405, {
      "Content-Type": "application/json",
      Allow: "POST",
    });
    res.end(JSON.stringify({ error: "Method not allowed." }));
    return;
  }

  try {
    const rawBody = await readRequestBody(req);
    const response = await createCoachResponse(rawBody);
    res.writeHead(response.status, { "Content-Type": "application/json" });
    res.end(JSON.stringify(response.body));
  } catch (error) {
    const status = error?.status || 500;
    res.writeHead(status, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: error?.message || "Server error." }));
  }
}
