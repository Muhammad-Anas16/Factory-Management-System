export function parseJson(value, fallback) {
  try { return value == null ? fallback : JSON.parse(value); } catch { return fallback; }
}
export const toJson = (value) => JSON.stringify(value ?? null);
