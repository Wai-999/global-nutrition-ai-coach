import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vitest/config";

function nutritionApiPlugin(): Plugin {
  return {
    name: "nutrition-coach-api",
    configureServer(server) {
      server.middlewares.use("/api/coach", async (req, res) => {
        const { handleNodeRequest } = (await import(new URL("./server/coach.mjs", import.meta.url).href)) as {
          handleNodeRequest: (req: unknown, res: unknown) => Promise<void>;
        };
        await handleNodeRequest(req, res);
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), nutritionApiPlugin()],
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx", "server/**/*.test.mjs"],
    setupFiles: "./vitest.setup.ts",
    globals: true,
  },
});
