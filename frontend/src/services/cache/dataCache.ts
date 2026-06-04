/**
 * ═══════════════════════════════════════════════════════════════════════════
 * DataCache Service — Production-Grade TTL Cache for Anime Studio
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Features:
 *  • TTL-based expiry with auto-cleanup
 *  • LRU eviction when max size is reached
 *  • Namespace-based key grouping & bulk invalidation
 *  • Stale-While-Revalidate (SWR) pattern for background refresh
 *  • Request deduplication (coalescing) — no duplicate in-flight API calls
 *  • LocalStorage persistence for cross-session caching
 *  • Cache statistics (hits, misses, evictions, size)
 *  • Priority levels (HIGH keeps data longer under eviction pressure)
 *  • Prefix/pattern-based cache clearing
 *  • Batch get & set operations
 *  • Cache warming (pre-populate from known data)
 *  • Debug mode with verbose console logging
 *  • Fully typed with TypeScript generics
 */

// ─────────────────────────────────────────────────────────────────────────────
// Types & Interfaces
// ─────────────────────────────────────────────────────────────────────────────

export type CachePriority = 'LOW' | 'NORMAL' | 'HIGH';

export interface CacheOptions {
  /** Time-to-live in ms. Defaults to 5 min. */
  ttl?: number;
  /** Whether to persist this entry in localStorage. Default: false */
  persist?: boolean;
  /** Priority level — HIGH entries survive LRU eviction longer. */
  priority?: CachePriority;
  /** Stale-while-revalidate window in ms. If set, stale data is returned
   *  immediately and a background refresh is triggered. */
  swr?: number;
  /** Namespace for group invalidation (e.g. 'studio', 'projects'). */
  namespace?: string;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  priority: CachePriority;
  persist: boolean;
  swr?: number;
  namespace?: string;
  accessCount: number;
  lastAccessed: number;
}

export interface CacheStats {
  hits: number;
  misses: number;
  evictions: number;
  expirations: number;
  size: number;
  persistedKeys: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// TTL Presets — use these for consistency across the studio
// ─────────────────────────────────────────────────────────────────────────────

export const TTL = {
  /** 30 seconds — for rapidly changing data (telemetry, live logs) */
  SHORT:    30 * 1000,
  /** 5 minutes — default for most API responses */
  DEFAULT:  5  * 60 * 1000,
  /** 15 minutes — for infrequently changing data (templates, categories) */
  MEDIUM:   15 * 60 * 1000,
  /** 1 hour — for stable reference data (tutorials, help articles) */
  LONG:     60 * 60 * 1000,
  /** 24 hours — for near-static data (SEO entries, growth strategies) */
  DAY:      24 * 60 * 60 * 1000,
  /** Never expires (session lifetime only — still clears on page reload) */
  FOREVER:  Number.MAX_SAFE_INTEGER,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Cache Keys — centralized constants to avoid typos across the codebase
// ─────────────────────────────────────────────────────────────────────────────

export const CACHE_KEYS = {
  // Studio
  PRODUCTION:         (userId: string, projectId?: number) => `studio:production:${userId}:${projectId ?? 'default'}`,
  SCENES:             (projectId: number)                  => `studio:scenes:${projectId}`,
  CHARACTER_MANIFEST: (userId: string, projectId?: number) => `studio:characters:${userId}:${projectId ?? 'default'}`,
  WORLD_LORE:         (userId: string, projectId?: number) => `studio:world:${userId}:${projectId ?? 'default'}`,
  WORLD_MODULE:       (mod: string, userId: string)        => `studio:world:${mod}:${userId}`,
  SEO_ENTRIES:        ()                                   => `studio:seo:entries`,
  GROWTH_STRATEGIES:  (track?: string)                     => `studio:growth:${track ?? 'all'}`,
  ENGINE_CONFIG:      (userId: string)                     => `studio:engine:config:${userId}`,
  TELEMETRY_RECENT:   ()                                   => `studio:engine:telemetry:recent`,

  // Projects
  PROJECTS_LIST:      ()                                   => `projects:list`,
  PROJECT_DETAIL:     (projectId: number)                  => `projects:detail:${projectId}`,

  // Library
  SCRIPTS:            ()                                   => `library:scripts`,
  STORYBOARDS:        ()                                   => `library:storyboards`,
  TEMPLATES:          ()                                   => `library:templates`,
  CATEGORIES:         ()                                   => `library:categories`,
  RECENT_ACTIVITY:    ()                                   => `library:recent-activity`,

  // Platform
  USER_SETTINGS:      (userId: string)                     => `platform:settings:${userId}`,
  USER_PROFILE:       (userId: string)                     => `platform:profile:${userId}`,
  USER_BALANCE:       (userId: string)                     => `platform:balance:${userId}`,
  ASSETS:             (userId: string, type?: string)      => `platform:assets:${userId}:${type ?? 'all'}`,
  NOTIFICATIONS:      (userId: string)                     => `platform:notifications:${userId}`,
  TODOS:              (userId: string)                     => `platform:todos:${userId}`,
  LOGS:               ()                                   => `platform:logs`,

  // Community & Discovery
  COMMUNITY_POSTS:    ()                                   => `community:posts`,
  DISCOVER_ITEMS:     ()                                   => `community:discover`,

  // Help
  TUTORIALS:          ()                                   => `help:tutorials`,
  HELP_CATEGORIES:    ()                                   => `help:categories`,
  FAQS:               ()                                   => `help:faqs`,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Namespaces — for bulk cache invalidation
// ─────────────────────────────────────────────────────────────────────────────

export const CACHE_NS = {
  STUDIO:    'studio',
  PROJECTS:  'projects',
  LIBRARY:   'library',
  PLATFORM:  'platform',
  COMMUNITY: 'community',
  HELP:      'help',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// DataCache Class
// ─────────────────────────────────────────────────────────────────────────────

const PERSIST_PREFIX = '__animestudio_cache__';
const DEFAULT_MAX_SIZE = 200;

class DataCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private inFlight: Map<string, Promise<any>> = new Map();
  private stats: CacheStats = { hits: 0, misses: 0, evictions: 0, expirations: 0, size: 0, persistedKeys: 0 };
  private maxSize: number;
  private debug: boolean;
  private cleanupTimer: ReturnType<typeof setInterval> | null = null;

  constructor(maxSize = DEFAULT_MAX_SIZE, debug = false) {
    this.maxSize = maxSize;
    this.debug = debug;
    this.restoreFromStorage();
    this.startAutoCleanup();
  }

  // ── Core: Get ─────────────────────────────────────────────────────────────

  /**
   * Get a cached value. Returns null if missing or expired.
   * Triggers a background SWR refresh if entry is in the stale window.
   */
  get<T>(key: string, swrFetcher?: () => Promise<T>): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      this.stats.misses++;
      this.log(`MISS  ${key}`);
      return null;
    }

    const now = Date.now();
    const age = now - entry.timestamp;

    if (age > entry.ttl) {
      this.cache.delete(key);
      this.stats.expirations++;
      this.stats.size = this.cache.size;
      this.log(`EXPIRE ${key}`);
      return null;
    }

    // Stale-While-Revalidate: data is within TTL but past SWR window
    if (entry.swr !== undefined && swrFetcher && age > entry.swr) {
      this.log(`SWR   ${key} — returning stale, revalidating in background`);
      this.revalidate(key, swrFetcher, entry);
    }

    entry.accessCount++;
    entry.lastAccessed = now;
    this.stats.hits++;
    this.log(`HIT   ${key} (age: ${Math.round(age / 1000)}s)`);
    return entry.data as T;
  }

  // ── Core: Set ─────────────────────────────────────────────────────────────

  /**
   * Store a value in the cache with optional configuration.
   */
  set<T>(key: string, data: T, options: CacheOptions | number = {}): void {
    // Support legacy number TTL argument for backward compat
    const opts: CacheOptions = typeof options === 'number' ? { ttl: options } : options;

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: opts.ttl ?? TTL.DEFAULT,
      priority: opts.priority ?? 'NORMAL',
      persist: opts.persist ?? false,
      swr: opts.swr,
      namespace: opts.namespace,
      accessCount: 0,
      lastAccessed: Date.now(),
    };

    // LRU eviction if at capacity
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      this.evictLRU();
    }

    this.cache.set(key, entry);
    this.stats.size = this.cache.size;
    this.log(`SET   ${key} (ttl: ${Math.round(entry.ttl / 1000)}s, priority: ${entry.priority})`);

    if (entry.persist) {
      this.persistToStorage(key, entry);
    }
  }

  // ── Core: Has ─────────────────────────────────────────────────────────────

  /**
   * Check if a valid (non-expired) cache entry exists.
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.stats.expirations++;
      this.stats.size = this.cache.size;
      return false;
    }

    return true;
  }

  // ── Core: getOrFetch ──────────────────────────────────────────────────────

  /**
   * ⭐ Primary usage pattern.
   * Returns cached data if valid. Otherwise calls fetchFn, caches and returns result.
   * Automatically deduplicates in-flight requests — if two callers request the
   * same key simultaneously, only ONE API call is made.
   */
  async getOrFetch<T>(
    key: string,
    fetchFn: () => Promise<T>,
    options: CacheOptions | number = {}
  ): Promise<T> {
    // 1. Cache hit
    const cached = this.get<T>(key);
    if (cached !== null) return cached;

    // 2. Request deduplication — reuse in-flight promise
    if (this.inFlight.has(key)) {
      this.log(`DEDUP ${key} — reusing in-flight request`);
      return this.inFlight.get(key) as Promise<T>;
    }

    // 3. Cache miss — fetch and store
    const promise = fetchFn().then((data) => {
      this.set(key, data, options);
      this.inFlight.delete(key);
      return data;
    }).catch((err) => {
      this.inFlight.delete(key);
      throw err;
    });

    this.inFlight.set(key, promise);
    return promise;
  }

  // ── Invalidation ──────────────────────────────────────────────────────────

  /** Remove a single cache entry. */
  clear(key: string): void {
    this.removeFromStorage(key);
    this.cache.delete(key);
    this.stats.size = this.cache.size;
    this.log(`CLEAR ${key}`);
  }

  /** Remove all keys that start with a given prefix. */
  clearByPrefix(prefix: string): number {
    let count = 0;
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
        this.removeFromStorage(key);
        count++;
      }
    }
    this.stats.size = this.cache.size;
    this.log(`CLEAR_PREFIX "${prefix}" — removed ${count} entries`);
    return count;
  }

  /** Remove all keys belonging to a namespace (e.g. CACHE_NS.STUDIO). */
  clearNamespace(namespace: string): number {
    let count = 0;
    for (const [key, entry] of this.cache.entries()) {
      if (entry.namespace === namespace) {
        this.cache.delete(key);
        this.removeFromStorage(key);
        count++;
      }
    }
    this.stats.size = this.cache.size;
    this.log(`CLEAR_NS "${namespace}" — removed ${count} entries`);
    return count;
  }

  /** Wipe everything. */
  clearAll(): void {
    const keys = [...this.cache.keys()];
    keys.forEach(k => this.removeFromStorage(k));
    this.cache.clear();
    this.inFlight.clear();
    this.stats.size = 0;
    this.log(`CLEAR_ALL`);
  }

  // ── Batch Operations ──────────────────────────────────────────────────────

  /**
   * Set multiple cache entries at once.
   * @example dataCache.setMany([['key1', data1], ['key2', data2]], { ttl: TTL.MEDIUM })
   */
  setMany<T>(entries: [string, T][], options: CacheOptions | number = {}): void {
    for (const [key, data] of entries) {
      this.set(key, data, options);
    }
  }

  /**
   * Get multiple keys at once. Returns a Map of key → value (null if missing).
   */
  getMany<T>(keys: string[]): Map<string, T | null> {
    const result = new Map<string, T | null>();
    for (const key of keys) {
      result.set(key, this.get<T>(key));
    }
    return result;
  }

  // ── Cache Warming ─────────────────────────────────────────────────────────

  /**
   * Pre-populate cache with known data (e.g., data from SSR or a prior fetch).
   * Useful for seeding the cache before the user navigates to a section.
   */
  warm<T>(entries: { key: string; data: T; options?: CacheOptions }[]): void {
    this.log(`WARM  ${entries.length} entries`);
    for (const { key, data, options } of entries) {
      if (!this.has(key)) {
        this.set(key, data, options);
      }
    }
  }

  // ── TTL Utilities ─────────────────────────────────────────────────────────

  /** Returns remaining TTL in ms for a key, or 0 if expired/missing. */
  getRemainingTTL(key: string): number {
    const entry = this.cache.get(key);
    if (!entry) return 0;
    const remaining = entry.ttl - (Date.now() - entry.timestamp);
    return Math.max(0, remaining);
  }

  /** Refresh the timestamp of an existing entry, resetting its TTL. */
  touch(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    entry.timestamp = Date.now();
    this.log(`TOUCH ${key}`);
    return true;
  }

  // ── Inspection ────────────────────────────────────────────────────────────

  /** Returns a snapshot of cache statistics. */
  getStats(): Readonly<CacheStats> {
    return { ...this.stats };
  }

  /** Lists all active cache keys with their remaining TTL and namespace. */
  inspect(): { key: string; remainingMs: number; namespace?: string; priority: CachePriority; hits: number }[] {
    const now = Date.now();
    return [...this.cache.entries()]
      .filter(([, e]) => now - e.timestamp <= e.ttl)
      .map(([key, e]) => ({
        key,
        remainingMs: e.ttl - (now - e.timestamp),
        namespace: e.namespace,
        priority: e.priority,
        hits: e.accessCount,
      }))
      .sort((a, b) => b.remainingMs - a.remainingMs);
  }

  /** Returns the number of valid (non-expired) entries currently cached. */
  size(): number {
    return [...this.cache.keys()].filter(k => this.has(k)).length;
  }

  // ── Private: LRU Eviction ─────────────────────────────────────────────────

  private evictLRU(): void {
    // Sort entries: LOW priority evicted first, then by lastAccessed (oldest first)
    const priorityScore: Record<CachePriority, number> = { LOW: 0, NORMAL: 1, HIGH: 2 };

    const candidates = [...this.cache.entries()].sort(([, a], [, b]) => {
      const pd = priorityScore[a.priority] - priorityScore[b.priority];
      return pd !== 0 ? pd : a.lastAccessed - b.lastAccessed;
    });

    const [evictKey] = candidates[0];
    this.removeFromStorage(evictKey);
    this.cache.delete(evictKey);
    this.stats.evictions++;
    this.stats.size = this.cache.size;
    this.log(`EVICT ${evictKey} (LRU)`);
  }

  // ── Private: SWR Background Revalidation ─────────────────────────────────

  private revalidate<T>(key: string, fetcher: () => Promise<T>, entry: CacheEntry<T>): void {
    if (this.inFlight.has(key)) return; // already revalidating

    const promise = fetcher()
      .then((fresh) => {
        this.set(key, fresh, {
          ttl: entry.ttl,
          priority: entry.priority,
          persist: entry.persist,
          swr: entry.swr,
          namespace: entry.namespace,
        });
        this.inFlight.delete(key);
      })
      .catch(() => this.inFlight.delete(key));

    this.inFlight.set(key, promise);
  }

  // ── Private: Auto Cleanup ─────────────────────────────────────────────────

  private startAutoCleanup(): void {
    // Run cleanup every 2 minutes to purge expired entries
    this.cleanupTimer = setInterval(() => {
      const now = Date.now();
      let purged = 0;
      for (const [key, entry] of this.cache.entries()) {
        if (now - entry.timestamp > entry.ttl) {
          this.cache.delete(key);
          this.removeFromStorage(key);
          purged++;
        }
      }
      this.stats.size = this.cache.size;
      if (purged > 0) this.log(`CLEANUP — purged ${purged} expired entries`);
    }, 2 * 60 * 1000);
  }

  // ── Private: LocalStorage Persistence ─────────────────────────────────────

  private persistToStorage<T>(key: string, entry: CacheEntry<T>): void {
    try {
      localStorage.setItem(`${PERSIST_PREFIX}${key}`, JSON.stringify(entry));
      this.stats.persistedKeys++;
    } catch {
      // Ignore (e.g., private browsing quota exceeded)
    }
  }

  private removeFromStorage(key: string): void {
    try {
      localStorage.removeItem(`${PERSIST_PREFIX}${key}`);
    } catch { /* ignore */ }
  }

  private restoreFromStorage(): void {
    try {
      const now = Date.now();
      let restored = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const storageKey = localStorage.key(i);
        if (!storageKey?.startsWith(PERSIST_PREFIX)) continue;

        const cacheKey = storageKey.slice(PERSIST_PREFIX.length);
        const raw = localStorage.getItem(storageKey);
        if (!raw) continue;

        const entry: CacheEntry<any> = JSON.parse(raw);
        if (now - entry.timestamp <= entry.ttl) {
          this.cache.set(cacheKey, entry);
          restored++;
        } else {
          localStorage.removeItem(storageKey);
        }
      }
      this.stats.size = this.cache.size;
      if (restored > 0) this.log(`RESTORE — loaded ${restored} entries from localStorage`);
    } catch { /* ignore */ }
  }

  // ── Private: Debug Logging ────────────────────────────────────────────────

  private log(msg: string): void {
    if (this.debug) {
      console.debug(`[DataCache] ${msg}`);
    }
  }

  /** Toggle debug logging at runtime. */
  setDebug(enabled: boolean): void {
    this.debug = enabled;
  }

  /** Destroy the cache and clear the cleanup timer. */
  destroy(): void {
    if (this.cleanupTimer) clearInterval(this.cleanupTimer);
    this.clearAll();
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Singleton Export
// ─────────────────────────────────────────────────────────────────────────────

export const dataCache = new DataCache(
  200,
  process.env.NODE_ENV === 'development'
);
