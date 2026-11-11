import type { ReactNode } from "react";

/**
 * Two-column editorial body: a working column and a narrower margin column
 * for context and explanations ("marginalia"). The margin stacks below the
 * working column on small screens.
 */
export function PageBody({
  children,
  margin,
}: {
  children: ReactNode;
  margin?: ReactNode;
}) {
  return (
    <div className="grid lg:grid-cols-[minmax(0,1fr)_18rem] xl:grid-cols-[minmax(0,1fr)_21rem]">
      <div className="min-w-0 px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
        {children}
      </div>
      {margin ? (
        <aside
          aria-label="About this view"
          className="border-t border-graphite-200 px-5 py-8 sm:px-8 lg:border-t-0 lg:border-l lg:px-7 lg:py-10"
        >
          {margin}
        </aside>
      ) : null}
    </div>
  );
}

/** A titled note in the margin column. */
export function MarginNote({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="not-first:mt-8 not-first:border-t not-first:border-graphite-200 not-first:pt-6">
      <h2 className="font-mono text-eyebrow text-graphite-600 uppercase">
        {title}
      </h2>
      <div className="mt-2.5 text-sm leading-relaxed text-graphite-700">
        {children}
      </div>
    </section>
  );
}
