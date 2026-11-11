import type { ReactNode } from "react";

/** Editorial page masthead: section eyebrow, serif title, one-paragraph dek. */
export function PageHeader({
  eyebrow,
  title,
  dek,
}: {
  eyebrow: string;
  title: string;
  dek: ReactNode;
}) {
  return (
    <header className="border-b border-graphite-200 px-5 pt-8 pb-7 sm:px-8 lg:px-12 lg:pt-14 lg:pb-9">
      <p className="font-mono text-eyebrow text-graphite-600 uppercase">
        {eyebrow}
      </p>
      <h1 className="mt-3 font-display text-4xl leading-none font-medium tracking-tight sm:text-5xl">
        {title}
      </h1>
      <p className="mt-4 max-w-[62ch] text-lg leading-relaxed text-graphite-700">
        {dek}
      </p>
    </header>
  );
}
