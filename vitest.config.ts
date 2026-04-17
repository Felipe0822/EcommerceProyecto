import {defaultExclude, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    include: ["tests/*.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
        include: ["src/**/*.ts"],
        exclude: [ 
        ...defaultExclude, "**/*.spec.ts", "**/node_modules/**", "**/dist/**","**/external/**","**/routes/**","**/types/**","**/services/**","**/config/**","**/controllers/**","**/repositories/**"]

    }}
});