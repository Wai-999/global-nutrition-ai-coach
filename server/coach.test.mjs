import { describe, expect, it, vi } from "vitest";
import { createCoachResponse } from "./coach.mjs";

describe("createCoachResponse", () => {
  it("rejects invalid JSON", async () => {
    const response = await createCoachResponse("{bad json", {});

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/invalid json/i);
  });

  it("rejects missing prompts", async () => {
    const response = await createCoachResponse("{}", {});

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/prompt is required/i);
  });

  it("returns demo content in mock mode", async () => {
    const response = await createCoachResponse(
      JSON.stringify({ prompt: "Build a plan" }),
      { MOCK_COACH_REPORT: "true" },
    );

    expect(response.status).toBe(200);
    expect(response.body.text).toContain("## [SUMMARY]");
  });

  it("rejects placeholder API keys before calling Anthropic", async () => {
    const fetchImpl = vi.fn();
    const response = await createCoachResponse(
      JSON.stringify({ prompt: "Build a plan" }),
      { ANTHROPIC_API_KEY: "sk-ant-your-key" },
      fetchImpl,
    );

    expect(response.status).toBe(500);
    expect(response.body.error).toMatch(/placeholder/i);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("relays Anthropic text responses", async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ content: [{ type: "text", text: "Final plan" }] }),
    });

    const response = await createCoachResponse(
      JSON.stringify({ prompt: "Build a plan" }),
      { ANTHROPIC_API_KEY: "sk-ant-test-key", ANTHROPIC_MODEL: "claude-sonnet-4-6" },
      fetchImpl,
    );

    expect(response.status).toBe(200);
    expect(response.body.text).toBe("Final plan");
    expect(fetchImpl).toHaveBeenCalledWith(
      "https://api.anthropic.com/v1/messages",
      expect.objectContaining({ method: "POST" }),
    );
  });
});
