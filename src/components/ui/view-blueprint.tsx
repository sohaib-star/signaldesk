import { useId } from "react";

export type BlueprintItem = {
  title: string;
  description: string;
};

/**
 * The honest empty state for a view with no data source: it states that
 * nothing is connected and lists what the view will contain, instead of
 * rendering placeholder numbers or skeleton charts.
 */
export function ViewBlueprint({
  statement,
  items,
}: {
  statement: string;
  items: readonly BlueprintItem[];
}) {
  const headingId = useId();
  return (
    <section aria-labelledby={headingId}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b-2 border-ink pb-2">
        <h2
          id={headingId}
          className="font-display text-2xl font-medium tracking-tight"
        >
          Not connected yet
        </h2>
        <p className="font-mono text-eyebrow text-graphite-600 uppercase">
          0 records
        </p>
      </div>
      <p className="mt-4 max-w-[62ch] leading-relaxed text-graphite-700">
        {statement}
      </p>

      <h3 className="mt-10 font-mono text-eyebrow text-graphite-600 uppercase">
        Coming to this page
      </h3>
      <ol className="mt-2 border-t border-graphite-300">
        {items.map((item, i) => (
          <li
            key={item.title}
            className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-2 border-b border-graphite-200 py-4 sm:grid-cols-[3rem_minmax(0,14rem)_minmax(0,1fr)] sm:gap-x-6"
          >
            <span
              aria-hidden="true"
              className="font-mono text-sm text-graphite-600 tabular-nums"
            >
              {String.fromCharCode(97 + i)}.
            </span>
            <span className="font-medium">{item.title}</span>
            <span className="col-start-2 mt-1 text-sm leading-relaxed text-graphite-700 sm:col-start-3 sm:mt-0">
              {item.description}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
