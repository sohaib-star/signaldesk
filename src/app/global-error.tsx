"use client";

import { useEffect } from "react";
import { errorDigest } from "@/lib/error-digest";

/**
 * Last-resort boundary for errors thrown by the root layout itself. It
 * replaces the whole document, so global styles and fonts are unavailable:
 * the palette is applied inline with system fonts.
 */
export default function GlobalError({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const digest = errorDigest(error);

  return (
    <html lang="en">
      <head>
        <title>Error · SignalDesk</title>
      </head>
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          background: "#f4f1ea",
          color: "#16181c",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          display: "grid",
          placeItems: "center",
          padding: "2rem",
        }}
      >
        <main role="alert" style={{ maxWidth: "32rem" }}>
          <h1 style={{ fontFamily: "Georgia, serif", fontWeight: 500 }}>
            SignalDesk couldn&rsquo;t load
          </h1>
          <p style={{ color: "#45423d", lineHeight: 1.6 }}>
            Nothing was changed. Please try again
            {digest
              ? ". If it keeps happening, include the reference below when you report it."
              : "."}
          </p>
          {digest ? (
            <p
              style={{
                fontFamily: "ui-monospace, monospace",
                color: "#5c5852",
              }}
            >
              Reference: {digest}
            </p>
          ) : null}
          <button
            type="button"
            onClick={() => retry()}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              border: "1px solid #16181c",
              background: "transparent",
              color: "#16181c",
              font: "inherit",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
