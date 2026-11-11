/**
 * Returns the server-generated digest of an error passed to an error
 * boundary, if present. In production, Server Component errors reach the
 * client with only a generic message plus this digest, which matches the
 * server log entry. Thrown values may be anything, so narrow first.
 */
export function errorDigest(error: unknown): string | null {
  if (typeof error !== "object" || error === null) return null;
  const digest = (error as { digest?: unknown }).digest;
  return typeof digest === "string" && digest.length > 0 ? digest : null;
}
