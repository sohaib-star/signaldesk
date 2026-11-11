type ClassValue = string | false | null | undefined;

/** Joins truthy class names. Deliberately tiny; no conflict resolution. */
export function cx(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
