import { requestCoachReport } from "./coachClient";

describe("requestCoachReport", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns report text from the API", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ text: "## [SUMMARY] Ready" }),
      }),
    );

    await expect(requestCoachReport("prompt")).resolves.toBe("## [SUMMARY] Ready");
  });

  it("throws a useful API error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ error: "Missing API key" }),
      }),
    );

    await expect(requestCoachReport("prompt")).rejects.toThrow("Missing API key");
  });
});
