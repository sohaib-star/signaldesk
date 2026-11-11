import type { Metadata } from "next";
import Link from "next/link";
import { Wordmark } from "@/components/brand/wordmark";

export const metadata: Metadata = { title: "Not found" };

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center px-6 py-16">
      <Wordmark />
      <p className="mt-12 font-mono text-eyebrow text-graphite-600 uppercase">
        404
      </p>
      <h1 className="mt-2 font-display text-4xl font-medium tracking-tight">
        No such page
      </h1>
      <p className="mt-4 leading-relaxed text-graphite-700">
        The address doesn&rsquo;t match any view in this workspace.
      </p>
      <Link
        href="/today"
        className="mt-8 self-start border-b border-ink pb-0.5 font-medium hover:border-signal"
      >
        Go to Today
      </Link>
    </main>
  );
}
