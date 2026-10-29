/**
 * Version parsing and comparison for the formats the supported miners and their upstream sources use.
 *
 * Every function returns `undefined` when it can't make sense of its input, so callers can report
 * "unknown" instead of guessing.
 */

/**
 * Extracts the first dotted version number (`1.2` or `1.2.3`) from free text,
 * e.g. `"v6.26.0"` → `"6.26.0"`, `"TeamRedMiner 0.10.21"` → `"0.10.21"`.
 *
 * @param text - text that contains a version number
 * @returns the version number, or undefined if there is none
 */
export function extractSemver(text: string | undefined): string | undefined {
    return text?.match(/\d+\.\d+(?:\.\d+)?/)?.[0];
}

/**
 * Compares two dotted version numbers numerically, segment by segment (missing segments count as 0).
 * A leading `v` and any text around the number are ignored.
 *
 * @param a - first version, e.g. `"6.21.0"` or `"v6.21"`
 * @param b - second version
 * @returns negative if a < b, 0 if equal, positive if a > b, or undefined if either can't be parsed
 */
export function compareSemver(a: string | undefined, b: string | undefined): number | undefined {
    const left = extractSemver(a)?.split('.').map(Number);
    const right = extractSemver(b)?.split('.').map(Number);
    if (!left || !right) {
        return undefined;
    }

    for (let i = 0; i < Math.max(left.length, right.length); i++) {
        const diff = (left[i] ?? 0) - (right[i] ?? 0);
        if (diff !== 0) {
            return diff;
        }
    }
    return 0;
}

/**
 * Parts of a Braiins OS build string, `<YYYY>-<MM>-<DD>-<counter>-<commit>-<version>[-plus]`.
 * The miner reports the same format in `bos_version.current` that the firmware feed uses in its file names,
 * e.g. `"2026-09-23-0-d6cb014c-26.09.1-plus"` → release `"26.09.1"`, built `[2026, 9, 23, 0]`.
 *
 * @param build - Braiins OS build string
 * @returns release version and build date/counter, or undefined if the string doesn't match the format
 */
function parseBraiinsBuild(build: string | undefined): { release: string; built: number[] } | undefined {
    const match = build?.match(/^(\d{4})-(\d{2})-(\d{2})-(\d+)-[0-9a-f]+-(\d+\.\d+(?:\.\d+)?)(?:-|$)/);
    return match ? { release: match[5], built: match.slice(1, 5).map(Number) } : undefined;
}

/**
 * Compares two Braiins OS build strings: by release version first, then by build date and counter.
 *
 * The release decides because Braiins also builds backports of older release lines (e.g. 24.04.3, 24.06.2 and
 * 24.08.1 were all built on 2024-09-12), so a later build date doesn't mean a newer release.
 * The date only orders re-spins of the same release.
 *
 * @param a - first build, e.g. `"2023-05-29-0-1daef48b-23.03.2-plus"`
 * @param b - second build
 * @returns negative if a is older, 0 if the same build, positive if a is newer, or undefined if either can't be parsed
 */
export function compareBraiinsBuild(a: string | undefined, b: string | undefined): number | undefined {
    const left = parseBraiinsBuild(a);
    const right = parseBraiinsBuild(b);
    if (!left || !right) {
        return undefined;
    }

    const byRelease = compareSemver(left.release, right.release);
    if (byRelease !== 0) {
        return byRelease;
    }
    for (let i = 0; i < left.built.length; i++) {
        if (left.built[i] !== right.built[i]) {
            return left.built[i] - right.built[i];
        }
    }
    return 0;
}

/**
 * Build number of an Avalon firmware: the date-based number before the `_`,
 * e.g. `LVERSION` `"25021401_56abae7"` → `25021401`. Canaan's update file uses the bare number (`"25103101"`).
 *
 * @param version - Avalon firmware version
 * @returns the build number, or undefined if the version doesn't start with one
 */
export function parseAvalonBuild(version: string | undefined): number | undefined {
    const match = version?.match(/^(\d{8,})(?:_|$)/);
    return match ? Number(match[1]) : undefined;
}

/**
 * Version of the IceRiver OC (PbFarmer) firmware from the package name the miner reports,
 * e.g. `softver1` `"pbv077c_ks0miner"` → `"0.7.7"`. The trailing `c` marks the commercial build.
 *
 * Only the three-digit scheme used so far (`pbv081` = v0.8.1) is understood.
 *
 * @param softver - package name reported by the miner
 * @returns the version as `major.minor.patch`, or undefined if the name doesn't match the scheme
 */
export function parseIceRiverOcVersion(softver: string | undefined): string | undefined {
    const match = softver?.match(/^pbv(\d)(\d)(\d)(?!\d)/);
    return match ? `${match[1]}.${match[2]}.${match[3]}` : undefined;
}
