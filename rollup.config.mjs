import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

const dev = process.env.ROLLUP_WATCH;

// The card is served by the integration, so the bundle lands inside custom_components.
export default {
  input: "src/flow-pulse-card.ts",
  output: {
    file: "custom_components/flow_pulse/frontend/flow-pulse-card.js",
    format: "es",
    inlineDynamicImports: true,
    sourcemap: false,
  },
  plugins: [
    resolve({ browser: true }),
    typescript({ tsconfig: "./tsconfig.json", outDir: undefined, declaration: false }),
    !dev && terser({ format: { comments: false } }),
  ].filter(Boolean),
};
