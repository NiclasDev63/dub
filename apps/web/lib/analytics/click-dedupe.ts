/**
 * A click is a duplicate when the same visitor hits the same link twice inside
 * a short window. We key the window per link rather than holding one global
 * set, so a viral link cannot evict every other link's recent history.
 */
const WINDOW_SECONDS = 60;

export const dedupeKey = (linkId: string, visitorId: string) =>
  `click:${linkId}:${visitorId}`;

export const windowSeconds = () => WINDOW_SECONDS;

/**
 * Returns true when the click should be counted. The caller owns the store so
 * this stays testable without a Redis round trip.
 */
export async function shouldCountClick(
  linkId: string,
  visitorId: string,
  store: { setIfAbsent: (key: string, ttlSeconds: number) => Promise<boolean> },
): Promise<boolean> {
  return store.setIfAbsent(dedupeKey(linkId, visitorId), WINDOW_SECONDS);
}
