import fs from 'fs';

export interface CacheOptions {
  memoryTTL: number; // Time in milliseconds for memory cache
  diskTTL: number;   // Time in milliseconds for disk cache
  cacheFilePath: string; // Path to cache file on disk
}

export class Cache {
  private memoryCache: { data: string | null; timestamp: Date | null };
  private options: CacheOptions;

  constructor(options: CacheOptions) {
    this.memoryCache = { data: null, timestamp: null };
    this.options = options;
  }

  // Helper to check if the cache is still valid
  private isCacheValid(cacheTimestamp: Date | null, ttl: number): boolean {
    if (!cacheTimestamp) return false;
    const now = new Date();
    return now.getTime() - cacheTimestamp.getTime() < ttl;
  }

  // Get data from cache (either memory or disk)
  async get(): Promise<string | null> {
    // Check memory cache first
    if (this.memoryCache.data && this.isCacheValid(this.memoryCache.timestamp, this.options.memoryTTL)) {
      console.log('Serving from memory cache');
      return this.memoryCache.data;
    }

    // Check disk cache
    if (fs.existsSync(this.options.cacheFilePath)) {
      const stats = fs.statSync(this.options.cacheFilePath);
      const lastModified = new Date(stats.mtime);

      if (this.isCacheValid(lastModified, this.options.diskTTL)) {
        console.log('Serving from disk cache');
        const diskData = fs.readFileSync(this.options.cacheFilePath, 'utf-8');

        // Update memory cache from disk cache
        this.memoryCache = {
          data: diskData,
          timestamp: new Date(),
        };

        return diskData;
      }
    }

    // Cache is not valid (in either memory or disk)
    return null;
  }

  // Set data in both memory and disk cache
  async set(data: string): Promise<void> {
    // Cache in memory
    this.memoryCache = {
      data: data,
      timestamp: new Date(),
    };

    // Cache on disk
    fs.writeFileSync(this.options.cacheFilePath, data, 'utf-8');
  }
}

