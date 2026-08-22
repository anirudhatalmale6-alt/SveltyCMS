import { contentSystem } from "@src/content/index.server";
import type { Locale } from "@src/paraglide/runtime";
import { logger } from "@utils/logger";
import { SvelteMap } from "svelte/reactivity";

/**
 * Constructs a redirect URL to the first available collection, prefixed with the given language.
 * Returns null if no collections are found, allowing the caller to decide on a fallback route.
 * @param language The validated user language (e.g., 'en', 'de').
 */
export async function fetchAndRedirectToFirstCollection(
  language: Locale,
  tenantId?: string | null,
): Promise<string | null> {
  try {
    logger.debug(`Fetching first collection path for language: ${language}`);

    const firstCollection = contentSystem.collections.getSmartFirst(tenantId);
    if (firstCollection) {
      // Ensure the collection path — fall back to /collection/{id} if no path set
      const pathValue = firstCollection.path || `/collection/${firstCollection._id}`;
      const collectionPath = pathValue.startsWith("/") ? pathValue : `/${pathValue}`;
      const redirectUrl = `/${language}${collectionPath}`;
      logger.info(
        `Redirecting to first collection: ${firstCollection.name} at path: ${redirectUrl}`,
      );
      return redirectUrl;
    }

    logger.warn("No collections found via getSmartFirst(), returning null.");
    return null; // Return null if no collections are configured
  } catch (err) {
    logger.error("Error in fetchAndRedirectToFirstCollection:", err);
    return null; // Return null on error
  }
}

const cachedFirstCollectionPaths = new SvelteMap<string, { path: string; expiry: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

/**
 * A cached function to get the redirect path for the first available collection.
 * The cache is keyed by tenant *and* language — keying by language alone lets
 * one tenant's landing route be served to another for up to CACHE_DURATION.
 * @param language The validated user language.
 * @param tenantId The tenant whose collections to resolve (null = single-tenant).
 */
export async function getCachedFirstCollectionPath(
  language: Locale,
  tenantId?: string | null,
): Promise<string | null> {
  const now = Date.now();
  const cacheKey = `${tenantId ?? "global"}:${language}`;
  const cachedEntry = cachedFirstCollectionPaths.get(cacheKey);

  // Return cached result if still valid
  if (cachedEntry && now < cachedEntry.expiry) {
    return cachedEntry.path;
  }

  // Fetch fresh data by calling the utility function
  const result = await fetchAndRedirectToFirstCollection(language, tenantId);

  // Cache the result if it's a valid path
  if (result) {
    cachedFirstCollectionPaths.set(cacheKey, {
      path: result,
      expiry: now + CACHE_DURATION,
    });
  }

  return result;
}
