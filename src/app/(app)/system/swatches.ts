/**
 * Colour tokens documented on the /system reference page. Each `token` maps
 * to `--color-<token>` in src/app/globals.css; swatches.test.ts fails if a hex
 * value here drifts from the stylesheet.
 */
export type Swatch = { token: string; hex: string; use: string };

export const SURFACES: readonly Swatch[] = [
  { token: "paper", hex: "#F4F1EA", use: "Primary working surface" },
  { token: "paper-raised", hex: "#FAF8F3", use: "Inputs, popovers" },
  { token: "paper-sunken", hex: "#ECE8DF", use: "Wells, code, table stripes" },
  { token: "ink", hex: "#16181C", use: "Text, chrome, rail" },
  { token: "ink-raised", hex: "#202328", use: "Hover and active on ink" },
  { token: "ink-rule", hex: "#33363C", use: "Rules on ink" },
];

export const GRAPHITE: readonly Swatch[] = [
  { token: "graphite-100", hex: "#E4DFD5", use: "Faint fills" },
  { token: "graphite-200", hex: "#D5CFC3", use: "Hairline rules" },
  { token: "graphite-300", hex: "#BDB6A8", use: "Strong rules; text on ink" },
  { token: "graphite-400", hex: "#9A9387", use: "Secondary text on ink" },
  { token: "graphite-500", hex: "#77716A", use: "Non-text marks only" },
  { token: "graphite-600", hex: "#5C5852", use: "Secondary text on paper" },
  { token: "graphite-700", hex: "#45423D", use: "Body text, muted" },
  { token: "graphite-800", hex: "#2E2C29", use: "Emphasis on paper" },
];

export const SIGNAL: readonly Swatch[] = [
  { token: "signal", hex: "#E8590C", use: "Attention marks, focus ring" },
  { token: "signal-strong", hex: "#B2430A", use: "Attention text" },
  { token: "signal-wash", hex: "#F7E3D4", use: "Attention row background" },
];
