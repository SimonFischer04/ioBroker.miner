import { Platform } from '../generated/bos-api/types/braiins/bos/v1/Platform';
import { compareBraiinsBuild } from './version-compare';

/**
 * Subset of the global `fetch` used here, so tests can pass a fake.
 */
export type FetchFunction = (url: string, init?: RequestInit) => Promise<Response>;

/** Braiins' official firmware server: one directory per control-board platform. */
export const BRAIINS_FEED_URL = 'https://feeds.braiins-os.com';

/**
 * Static file Canaan's Avalon Family app reads to find new Nano 3 / 3S firmware.
 * Taken from the released app (v0.38.0) - it's undocumented and can move without notice.
 */
export const AVALON_UPDATE_URL = 'https://sinh1-aws-app01.s3.ap-southeast-1.amazonaws.com/app/update.json';

const GITHUB_API_URL = 'https://api.github.com';

/** Lookups are shared by all devices and reused for this long. */
const DEFAULT_CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const DEFAULT_TIMEOUT_MS = 15_000;
const USER_AGENT = 'ioBroker.miner';

/**
 * Options for {@link UpdateSources}.
 */
export interface UpdateSourcesOptions {
    /**
     * HTTP client. Default: the global `fetch`.
     */
    fetch?: FetchFunction;
    /**
     * How long a successful lookup is reused. Default: 6 hours.
     */
    cacheTtlMs?: number;
    /**
     * Timeout per HTTP request. Default: 15 seconds.
     */
    timeoutMs?: number;
    /**
     * Clock, for tests. Default: `Date.now`.
     */
    now?: () => number;
}

interface CacheEntry {
    expiresAt: number;
    value: Promise<unknown>;
}

/**
 * Feed directory for a Braiins OS control-board platform as reported by `GetMinerDetails`,
 * e.g. `PLATFORM_ZYNQ_BM3_AM2` (7) → `"zynq-bm3-am2"`.
 *
 * @param platform - platform enum value (number or name)
 * @returns the directory name, or undefined for an unspecified or unknown platform
 */
export function braiinsPlatformDirectory(platform: number | string | undefined): string | undefined {
    const name =
        typeof platform === 'number'
            ? Object.entries(Platform).find(([, value]) => value === platform)?.[0]
            : platform && platform in Platform
              ? platform
              : undefined;

    if (!name || name === 'PLATFORM_UNSPECIFIED') {
        return undefined;
    }
    return name
        .replace(/^PLATFORM_/, '')
        .toLowerCase()
        .replace(/_/g, '-');
}

/**
 * Firmware builds listed in a Braiins feed directory.
 * Files are named `firmware_<build>_<arch>.tar`, or `sd-firmware_…` on SD-card based boards.
 *
 * @param html - the directory listing page
 * @returns the build strings, e.g. `"2026-09-23-0-d6cb014c-26.09.1-plus"`, in listing order
 */
export function parseBraiinsFeedListing(html: string): string[] {
    return [...html.matchAll(/href="(?:sd-)?firmware_([^_"/]+)_[^"/]*\.tar"/g)].map(match => match[1]);
}

/**
 * Latest firmware version for the Nano 3 / 3S from Canaan's update file.
 *
 * @param data - parsed update file
 * @returns the build number as a string, e.g. `"25103101"`, or undefined if the file doesn't have one
 */
export function parseAvalonUpdateFile(data: unknown): string | undefined {
    const version = (data as { nano3?: { version?: unknown } } | null)?.nano3?.version;
    return typeof version === 'string' && /^\d{8,}$/.test(version) ? version : undefined;
}

/**
 * Looks up the latest available versions from the miners' upstream sources.
 *
 * Successful lookups are cached and shared by all devices; failed ones are not cached, and always throw,
 * so callers can never mistake a failed lookup for "up to date".
 */
export class UpdateSources {
    private readonly fetch: FetchFunction;
    private readonly cacheTtlMs: number;
    private readonly timeoutMs: number;
    private readonly now: () => number;
    private readonly cache = new Map<string, CacheEntry>();

    /**
     * @param options - see {@link UpdateSourcesOptions}
     */
    public constructor(options: UpdateSourcesOptions = {}) {
        this.fetch = options.fetch ?? ((url, init) => fetch(url, init));
        this.cacheTtlMs = options.cacheTtlMs ?? DEFAULT_CACHE_TTL_MS;
        this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
        this.now = options.now ?? Date.now;
    }

    /**
     * Tag of the latest release of a GitHub repository (drafts and pre-releases excluded).
     *
     * @param owner - repository owner
     * @param repo - repository name
     * @returns the tag, e.g. `"v6.26.0"`
     */
    public githubLatestRelease(owner: string, repo: string): Promise<string> {
        return this.cached(`github:${owner}/${repo}`, async () => {
            const response = await this.get(
                `${GITHUB_API_URL}/repos/${owner}/${repo}/releases/latest`,
                'application/vnd.github+json',
            );
            const tag = ((await response.json()) as { tag_name?: unknown }).tag_name;
            if (typeof tag !== 'string' || tag === '') {
                throw new Error(`GitHub ${owner}/${repo}: latest release has no tag`);
            }
            return tag;
        });
    }

    /**
     * Newest firmware build published for a Braiins OS control-board platform.
     *
     * @param platformDirectory - feed directory, see {@link braiinsPlatformDirectory}
     * @returns the build string, e.g. `"2026-09-23-0-d6cb014c-26.09.1-plus"`
     */
    public braiinsLatestBuild(platformDirectory: string): Promise<string> {
        return this.cached(`braiins:${platformDirectory}`, async () => {
            const response = await this.get(`${BRAIINS_FEED_URL}/${platformDirectory}/`, 'text/html');
            // compare by date and build counter - plain string order would put build 10 before build 2
            const latest = parseBraiinsFeedListing(await response.text())
                .filter(build => compareBraiinsBuild(build, build) !== undefined)
                .sort((a, b) => compareBraiinsBuild(a, b) ?? 0)
                .at(-1);
            if (!latest) {
                throw new Error(`Braiins feed ${platformDirectory}: no firmware found in the listing`);
            }
            return latest;
        });
    }

    /**
     * Latest firmware build for the Avalon Nano 3 / 3S, from Canaan's update file.
     *
     * @returns the build number as a string, e.g. `"25103101"`
     */
    public avalonNano3LatestBuild(): Promise<string> {
        return this.cached('avalon:nano3', async () => {
            const response = await this.get(AVALON_UPDATE_URL, 'application/json');
            const version = parseAvalonUpdateFile(await response.json());
            if (!version) {
                throw new Error('Avalon update file: no valid nano3 version');
            }
            return version;
        });
    }

    /**
     * Forget all cached lookups, so the next request asks the sources again.
     */
    public clearCache(): void {
        this.cache.clear();
    }

    private cached<T>(key: string, load: () => Promise<T>): Promise<T> {
        const entry = this.cache.get(key);
        if (entry && entry.expiresAt > this.now()) {
            return entry.value as Promise<T>;
        }

        // concurrent callers share one request; a failure is dropped from the cache so the next call retries
        const value = load();
        this.cache.set(key, { expiresAt: this.now() + this.cacheTtlMs, value });
        void value.catch(() => {
            if (this.cache.get(key)?.value === value) {
                this.cache.delete(key);
            }
        });
        return value;
    }

    private async get(url: string, accept: string): Promise<Response> {
        const response = await this.fetch(url, {
            headers: { Accept: accept, 'User-Agent': USER_AGENT },
            signal: AbortSignal.timeout(this.timeoutMs),
        });
        if (!response.ok) {
            throw new Error(`GET ${url} failed: HTTP ${response.status}`);
        }
        return response;
    }
}
