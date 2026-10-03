import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// Sitio 100% pre-renderizado por ahora: las páginas se sirven desde los assets estáticos.
// Cuando se conecte Supabase y haya revalidación (ISR), cambiar a r2IncrementalCache.
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
