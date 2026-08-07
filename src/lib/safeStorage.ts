import { z } from "zod";

/** Parse a JSON value from localStorage and validate it against a schema.
 *  Returns the fallback (and clears the corrupt entry) when validation fails. */
export function readValidated<T>(key: string, schema: z.ZodTypeAny, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return fallback;
    const parsed = schema.safeParse(JSON.parse(stored));
    if (!parsed.success) {
      localStorage.removeItem(key);
      return fallback;
    }
    return parsed.data as T;
  } catch {
    try {
      localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
    return fallback;
  }
}