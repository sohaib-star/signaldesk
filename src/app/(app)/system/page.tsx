import type { Metadata } from "next";
import type { ReactNode } from "react";
import { MarginNote, PageBody } from "@/components/ui/page-body";
import { PageHeader } from "@/components/ui/page-header";
import { ProvenanceLegend } from "@/components/ui/provenance";

export const metadata: Metadata = {
  title: "Design system",
  robots: { index: false },
};

type Swatch = { token: string; hex: string; use: string; dark?: boolean };

const SURFACES: Swatch[] = [
  { token: "paper", hex: "#F4F1EA", use: "Primary working surface" },
  { token: "paper-raised", hex: "#FAF8F3", use: "Inputs, popovers" },
  { token: "paper-sunken", hex: "#ECE8DF", use: "Wells, code, table stripes" },
  { token: "ink", hex: "#16181C", use: "Text, chrome, rail", dark: true },
  {
    token: "ink-raised",
    hex: "#202328",
    use: "Hover/active on ink",
    dark: true,
  },
];

const GRAPHITE: Swatch[] = [
  { token: "graphite-200", hex: "#D5CFC3", use: "Hairline rules" },
  { token: "graphite-300", hex: "#BDB6A8", use: "Strong rules; text on ink" },
  { token: "graphite-400", hex: "#9A9387", use: "Secondary text on ink" },
  { token: "graphite-500", hex: "#77716A", use: "Non-text marks only" },
  {
    token: "graphite-600",
    hex: "#5C5852",
    use: "Secondary text on paper",
    dark: true,
  },
  {
    token: "graphite-700",
    hex: "#45423D",
    use: "Body text, muted",
    dark: true,
  },
];

const SIGNAL: Swatch[] = [
  {
    token: "signal",
    hex: "#E8590C",
    use: "Attention marks, focus ring",
    dark: true,
  },
  { token: "signal-strong", hex: "#B2430A", use: "Attention text", dark: true },
  { token: "signal-wash", hex: "#F7E3D4", use: "Attention row background" },
];

export default function SystemPage() {
  return (
    <>
      <PageHeader
        eyebrow="Reference / Design system"
        title="Design system"
        dek="The tokens and conventions every SignalDesk view is built from. Tailwind's default palette is disabled, so these are the only colours available."
      />
      <PageBody
        margin={
          <>
            <MarginNote title="The orange rule">
              Signal orange means one thing: this needs a decision. It is never
              used for decoration, selection, or navigation state.
            </MarginNote>
            <MarginNote title="Contrast">
              Text on paper uses graphite-600 or darker (≥ 6.3:1). Orange text
              uses signal-strong (5.0:1). Plain signal (3.2:1) is reserved for
              non-text marks.
            </MarginNote>
          </>
        }
      >
        <Block title="Surfaces">
          <SwatchRow swatches={SURFACES} />
        </Block>
        <Block title="Graphite">
          <SwatchRow swatches={GRAPHITE} />
        </Block>
        <Block title="Signal">
          <SwatchRow swatches={SIGNAL} />
        </Block>

        <Block title="Typography">
          <dl className="border-t border-graphite-300">
            <TypeRow name="Display / Newsreader" token="font-display">
              <span className="font-display text-4xl font-medium tracking-tight">
                Halvorsen renewal is stalling
              </span>
            </TypeRow>
            <TypeRow name="Interface / Instrument Sans" token="font-sans">
              <span className="text-base">
                Proposal sent 19 days ago; stage norm is 7 days.
              </span>
            </TypeRow>
            <TypeRow name="Figures / IBM Plex Mono" token="font-mono">
              <span className="font-mono text-base tabular-nums">
                42,500.00 &nbsp; 1,180.00 &nbsp; 17.4%
              </span>
            </TypeRow>
            <TypeRow name="Eyebrow" token="text-eyebrow">
              <span className="font-mono text-eyebrow text-graphite-600 uppercase">
                01 / Section label
              </span>
            </TypeRow>
          </dl>
          <p className="mt-3 text-sm text-graphite-600">
            Specimen text only. These strings illustrate type, not data.
          </p>
        </Block>

        <Block title="Provenance marks">
          <ProvenanceLegend />
        </Block>
      </PageBody>
    </>
  );
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="not-first:mt-14">
      <h2 className="mb-4 border-b-2 border-ink pb-2 font-display text-2xl font-medium tracking-tight">
        {title}
      </h2>
      {children}
    </section>
  );
}

function SwatchRow({ swatches }: { swatches: Swatch[] }) {
  return (
    <ul className="grid grid-cols-2 gap-px border border-graphite-200 bg-graphite-200 sm:grid-cols-3 xl:grid-cols-6">
      {swatches.map((s) => (
        <li key={s.token} className="bg-paper">
          <div
            className="h-16 border-b border-graphite-200"
            style={{ backgroundColor: `var(--color-${s.token})` }}
          />
          <div className="p-2.5">
            <p className="font-mono text-xs">{s.token}</p>
            <p className="font-mono text-xs text-graphite-600">{s.hex}</p>
            <p className="mt-1 text-xs leading-snug text-graphite-700">
              {s.use}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function TypeRow({
  name,
  token,
  children,
}: {
  name: string;
  token: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-x-6 gap-y-2 border-b border-graphite-200 py-4 sm:grid-cols-[12rem_minmax(0,1fr)]">
      <dt>
        <p className="text-sm font-medium">{name}</p>
        <p className="font-mono text-xs text-graphite-600">{token}</p>
      </dt>
      <dd className="min-w-0">{children}</dd>
    </div>
  );
}
