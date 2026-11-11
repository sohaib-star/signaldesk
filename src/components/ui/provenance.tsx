import { cx } from "@/lib/cx";

/**
 * Every value SignalDesk shows belongs to exactly one provenance kind. The
 * kind is always visible, so a reader can tell a stored fact from a computed
 * value, an estimate, or text written by a language model.
 */
export const PROVENANCE = {
  fact: {
    label: "Fact",
    glyph: "■",
    description: "A stored record, shown as written.",
  },
  derived: {
    label: "Derived",
    glyph: "ƒ",
    description:
      "Computed by a documented formula. The formula and its inputs can always be opened.",
  },
  estimate: {
    label: "Estimate",
    glyph: "≈",
    description:
      "Arithmetic on stated assumptions. Set in italics, with its method alongside.",
  },
  generated: {
    label: "Generated",
    glyph: "¶",
    description:
      "Written by a language model. Cites the facts it used and never stands alone.",
  },
} as const;

export type ProvenanceKind = keyof typeof PROVENANCE;

export function ProvenanceMark({
  kind,
  className,
}: {
  kind: ProvenanceKind;
  className?: string;
}) {
  const { label, glyph } = PROVENANCE[kind];
  return (
    <span
      className={cx(
        "inline-flex items-baseline gap-1.5 font-mono text-eyebrow text-graphite-700 uppercase",
        className,
      )}
    >
      <span aria-hidden="true" className="w-3 text-center text-ink">
        {glyph}
      </span>
      {label}
    </span>
  );
}

/** Reference table of all provenance kinds. */
export function ProvenanceLegend() {
  return (
    <dl className="border-t border-graphite-300">
      {(Object.keys(PROVENANCE) as ProvenanceKind[]).map((kind) => (
        <div
          key={kind}
          className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-x-4 border-b border-graphite-200 py-3"
        >
          <dt>
            <ProvenanceMark kind={kind} />
          </dt>
          <dd
            className={cx(
              "text-sm leading-relaxed text-graphite-700",
              kind === "estimate" && "italic",
            )}
          >
            {PROVENANCE[kind].description}
          </dd>
        </div>
      ))}
    </dl>
  );
}
