import { defineConfig } from "vitest/config";

export default defineConfig({
  esbuild: {
    loader: { '.js': 'jsx' },
  },
  test: {
    environment: "jsdom",
    globals: true,
  },
});