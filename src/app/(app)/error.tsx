"use client";

import { useEffect } from "react";
import { errorDigest } from "@/lib/error-digest";

export default function WorkspaceError({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    // Replaced by structured server-side logging in a later milestone.
    console.error(error);
  }, [error]);

  const digest = errorDigest(error);

  return (
    <div role="alert" className="px-5 py-12 sm:px-8 lg:px-12">
      <p className="font-mono text-eyebrow text-signal-strong uppercase">
        Error
      </p>
      <h1 className="mt-2 font-display text-3xl font-medium tracking-tight">
        This view failed to load
      </h1>
      <p className="mt-3 max-w-[62ch] leading-relaxed text-graphite-700">
        Nothing was changed. Try again
        {digest
          ? "; if the problem continues, quote the reference below."
          : "."}
      </p>
      {digest ? (
        <p className="mt-3 font-mono text-sm text-graphite-600">
          Reference: {digest}
        </p>
      ) : null}
      <button
        type="button"
        onClick={() => retry()}
        className="mt-6 border border-ink px-4 py-2 text-sm font-medium transition-colors hover:bg-ink hover:text-paper"
      >
        Try again
      </button>
    </div>
  );
}
